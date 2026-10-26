#!/usr/bin/env python3
"""Audio-derived word alignment and speech-protected edits; no TTS or invented timestamps."""
from __future__ import annotations
import argparse
import hashlib
import importlib.metadata
import json
import math
from pathlib import Path
import re
import subprocess
import wave
import unicodedata
from alignment_candidates import select_monotonic_path
from recover_alignment import recover


def run(argv: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(argv, check=True, capture_output=True, text=True)


def save(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def duration(path: Path) -> float:
    return float(run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)]).stdout.strip())


def silence_ranges(path: Path, total: float) -> list[tuple[float, float]]:
    log=run(['ffmpeg','-hide_banner','-i',str(path),'-af','silencedetect=noise=-45dB:d=0.15','-f','null','-']).stderr
    found,start=[],None
    for line in log.splitlines():
        m=re.search(r'silence_start: ([\d.]+)',line)
        if m:start=float(m.group(1))
        m=re.search(r'silence_end: ([\d.]+)',line)
        if m and start is not None:
            found.append((start,min(float(m.group(1)),total)));start=None
    if start is not None:found.append((start,total))
    return found


def protected_cuts(silences:list,words:list,total:float,fps:float)->tuple[list,list]:
    handles,cuts,exceptions=2/fps,[],[]
    for start,end in silences:
        if end-start<=.15:continue
        if any(w['start']<end and w['end']>start for w in words):
            exceptions.append({'start':start,'end':end,'reason':'word-overlap; preserve speech'});continue
        left=max((w['end'] for w in words if w['end']<=start),default=0.)
        right=min((w['start'] for w in words if w['start']>=end),default=total)
        a=max(start+handles,left+handles);b=min(end-handles,right-handles)
        if start<=.001:a=0.
        if end>=total-.001:b=total
        if b-a>=1/fps:
            cuts.append({'start':round(a,6),'end':round(b,6),'seconds':round(b-a,6),'reason':'waveform silence; two-frame speech handles'})
        else:exceptions.append({'start':start,'end':end,'reason':'two-frame handles leave no safe removable gap'})
    return cuts,exceptions


def keep_ranges(cuts:list,total:float)->list[tuple[float,float]]:
    result,last=[],0.
    for cut in sorted(cuts,key=lambda c:c['start']):
        a,b=cut['start'],cut['end']
        if a<last or b<=a or b>total+1e-6:raise ValueError('Overlapping or invalid cut')
        if a>last:result.append((last,a))
        last=b
    if last<total:result.append((last,total))
    return result


def pcm(path:Path):
    import numpy as np
    data=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar','48000','-f','f32le','-'],check=True,capture_output=True).stdout
    return np.frombuffer(data,dtype='<f4').copy()


def write_wav(path:Path,audio)->None:
    import numpy as np
    path.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(48000)
        f.writeframes(np.round(np.clip(audio,-1,1)*32767).astype('<i2').tobytes())


def norm(value:str)->list[str]:
    return re.findall(r'\w+',unicodedata.normalize('NFC',value).casefold())


def locate(words:list,phrase:str,occurrence:int=0)->list:
    tokens,indices=[],[]
    for i,w in enumerate(words):
        for token in norm(w['word']):tokens.append(token);indices.append(i)
    query=norm(phrase)
    matches=[i for i in range(len(tokens)-len(query)+1) if tokens[i:i+len(query)]==query]
    if not query or occurrence>=len(matches):raise ValueError('Trigger not present in actual aligned transcript: '+phrase)
    i=matches[occurrence]
    return words[indices[i]:indices[i+len(query)-1]+1]


def main()->None:
    import numpy as np
    import stable_whisper
    import torch
    p=argparse.ArgumentParser()
    for name in ['props','audio-root','output','asset-dir','plan']:p.add_argument('--'+name,required=True)
    p.add_argument('--model',default='small');p.add_argument('--fps',type=float,default=30)
    args=p.parse_args()
    if not 1<=args.fps<=120:raise ValueError('Invalid established project FPS')
    source=json.loads(Path(args.props).read_text());plan=json.loads(Path(args.plan).read_text())
    if plan.get('inputKind')!='tts_motion':raise ValueError('Camera input needs a separate take/A-V/face pipeline')
    out=Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
    assets=Path(args.asset_dir).resolve();assets.mkdir(parents=True,exist_ok=True)
    root=Path(args.audio_root).resolve();torch.set_num_threads(2);models={}
    def get_model(name):
        if name not in models:models[name]=stable_whisper.load_faster_whisper(name,device='cpu',compute_type='int8',cpu_threads=2,num_workers=1)
        return models[name]
    versions={name:importlib.metadata.version(name) for name in ['stable-ts','faster-whisper','ctranslate2']}
    inventory,edl,all_words,scenes,assembled,alignment_attempts=[],[],[],[],[],[]
    offset=raw_total=0.;candidates=removed_count=0
    takes=['# takes.md\n','Input: preserved Vbee TTS audio; no camera retakes.','Rejected camera takes: N/A. No new TTS calls.\n']
    for scene in source['scenes']:
        src=(root/scene['audioFile']).resolve()
        if not src.is_relative_to(root) or not src.is_file():raise ValueError('Invalid local source audio')
        text=scene.get('voiceText','').strip()
        if not text:raise ValueError('Missing exact narration')
        raw=pcm(src);raw_seconds=len(raw)/48000;raw_total+=raw_seconds
        def aligned(file:Path,tag:str)->list:
            cache=out/'alignment'/(scene['id']+'-'+tag+'.json')
            key=hashlib.sha256((sha(file)+text+args.model+'acoustic-candidates-v4'+json.dumps(versions,sort_keys=True)).encode()).hexdigest()
            if cache.exists() and (cached:=json.loads(cache.read_text())).get('cacheKey')==key:return cached['words']
            attempts=[];observations=[];selected=None
            passes=[(args.model,True,False,100),(args.model,True,True,442),(args.model,False,True,442)]
            if args.model!='medium':passes += [('medium',True,False,100),('medium',False,True,442)]
            for model_name,suppress,fast,tokens in passes:
                result=get_model(model_name).align(str(file),text,language='vi',regroup=False,verbose=None,original_split=True,suppress_silence=suppress,fast_mode=fast,token_step=tokens)
                if result is None:
                    attempts.append({'model':model_name,'error':'no-result'});continue
                words=[{'word':w['word'].strip(),'start':float(w['start']),'end':float(w['end']),'probability':w.get('probability')} for seg in result.to_dict()['segments'] for w in seg.get('words',[])]
                complete=bool(words) and norm(' '.join(w['word'] for w in words))==norm(text)
                bad=[w for w in words if w['end']<=w['start'] or w['start']<0]
                attempts.append({'model':model_name,'suppressSilence':suppress,'fastMode':fast,'tokenStep':tokens,'completeTranscript':complete,'invalidWords':bad,'words':words})
                if complete:observations.append(words)
                save(out/'alignment'/f"{scene['id']}-{tag}-attempts.json",{'attempts':attempts,'audioSha256':sha(file)})
                if complete and not bad:
                    selected={'model':model_name,'words':words,'method':'single acoustic alignment'};break
                mixed=select_monotonic_path(observations)
                if mixed:
                    selected={'model':'multiple-acoustic-candidates','words':mixed,'method':'monotonic unchanged observed intervals; no interpolation'};break
            if selected is None:
                observations.extend(recover(get_model(args.model),file,text,out/'alignment'/f"{scene['id']}-{tag}-recovery.json"))
                mixed=select_monotonic_path(observations)
                if mixed:selected={'model':'acoustic-recovery','words':mixed,'method':'observed ASR/padded-audio intervals with padding removed; no fabricated duration'}
            if selected is None:raise ValueError(f'TIMING_UNVERIFIED {scene["id"]}/{tag}: no valid acoustic path; evidence retained')
            alignment_attempts.append({'sceneId':scene['id'],'pass':tag,'attemptCount':len(attempts),'selectedModel':selected['model'],'method':selected['method']})
            save(cache,{'cacheKey':key,'method':selected['method']+'; requires independent listening review','model':selected['model'],'versions':versions,'audioSha256':sha(file),'transcript':text,'words':selected['words'],'attemptCount':len(attempts)})
            return selected['words']
        original_words=aligned(src,'original')
        silences=silence_ranges(src,raw_seconds);candidates+=len(silences)
        cuts,exceptions=protected_cuts(silences,original_words,raw_seconds,args.fps)
        chunks=[];mapping=[];local_offset=0.
        for a,b in keep_ranges(cuts,raw_seconds):
            start,end=round(a*48000),round(b*48000);part=raw[start:end].copy();fade=min(240,len(part)//2)
            if start>0 and fade:part[:fade]*=np.linspace(0,1,fade)
            if end<len(raw) and fade:part[-fade:]*=np.linspace(1,0,fade)
            chunks.append(part);mapping.append({'sourceStart':start/48000,'sourceEnd':end/48000,'outputStart':local_offset,'outputEnd':local_offset+len(part)/48000});local_offset+=len(part)/48000
        edited=np.concatenate(chunks) if chunks else raw.copy();edited_file=assets/(scene['id']+'-edited.wav');write_wav(edited_file,edited)
        words=aligned(edited_file,'edited');edited_seconds=len(edited)/48000
        all_words.extend(dict(w,start=w['start']+offset,end=w['end']+offset,sceneId=scene['id']) for w in words)
        scenes.append({**scene,'startSeconds':offset,'endSeconds':offset+edited_seconds,'audioFile':None,'captions':[]})
        inventory.append({'sceneId':scene['id'],'file':str(src.relative_to(root)),'sha256':sha(src),'rawDecodedSeconds':raw_seconds,'encodedContainerSeconds':duration(src),'editedSeconds':edited_seconds,'inputKind':'tts_motion'})
        edl.append({'sceneId':scene['id'],'silencesDetected':silences,'removed':cuts,'protectedExceptions':exceptions,'sampleAccurateMapping':mapping,'speechHandlesFrames':2,'joinFadeMs':5})
        removed_count+=len(cuts);assembled.append(edited);offset+=edited_seconds
        takes.append(f"## {scene['id']}\nSource `{src.name}`; range0–{raw_seconds:.6f}s. Single existing TTS segment retained. Rejected retakes: N/A.\n\n{text}\n")
    write_wav(assets/'narration-edited.wav',np.concatenate(assembled));write_wav(assets/'narration-raw.wav',np.concatenate([pcm(root/s['audioFile']) for s in source['scenes']]))
    beats=[]
    for n,cue in enumerate(plan['beats']):
        selected=locate([w for w in all_words if w['sceneId']==cue['sceneId']],cue['trigger'],cue.get('occurrence',0));onset=selected[0]['start'];frame=round(onset*args.fps)
        beats.append({**cue,'id':f'beat-{n+1:03d}','startFrame':frame,'firstVisibleFrame':frame,'wordOnsetSeconds':onset,'wordEndSeconds':selected[-1]['end'],'rendererQuantizationErrorFrames':round(frame-onset*args.fps,5),'words':selected,'groundTruthSyncStatus':'REQUIRES_LISTENING_REVIEW'})
    beats.sort(key=lambda b:b['startFrame'])
    for n,b in enumerate(beats):
        b['endFrame']=beats[n+1]['startFrame'] if n+1<len(beats) else math.ceil(offset*args.fps)
        if b['endFrame']<=b['startFrame']:raise ValueError('Two effects collide at one frame')
        b['durationFrames']=min(round(.4*args.fps),b['endFrame']-b['startFrame'])
    frames=math.ceil(offset*args.fps)+round(.5*args.fps)
    metrics={'inputKind':'tts_motion','model':args.model,'modelsActuallyLoaded':list(models),'alignmentVersions':versions,'rawDecodedAudioSeconds':raw_total,'rawEncodedAudioSeconds':sum(x['encodedContainerSeconds'] for x in inventory),'editedNarrationSeconds':offset,'previewDurationSeconds':frames/args.fps,'visualLoopTailSeconds':frames/args.fps-offset,'sourceClipCount':len(inventory),'selectedTtsSegments':len(inventory),'rejectedTakes':None,'rejectedTakesReason':'N/A: no camera retakes','silencesDetected':candidates,'silencesActuallyCut':removed_count,'secondsRemoved':raw_total-offset,'actualCutRanges':removed_count,'fps':args.fps,'fpsSource':'Original graphics-only Remotion timebase; no camera footage','faceCheck':'N/A: no face footage','music':'none','denoise':'bypassed for clean TTS','manualListening':'NOT_PERFORMED_BY_AUTOMATED_PIPELINE','groundTruthTwoFrameSync':'NOT_VERIFIED','quantizationMaxAbsFrames':max(abs(b['rendererQuantizationErrorFrames']) for b in beats),'published':False,'finalRendered':False}
    for name,value in [('source-inventory.json',inventory),('edit-decisions.json',edl),('words.json',all_words),('effects-map.json',beats),('metrics.json',metrics),('alignment-attempts.json',alignment_attempts)]:save(out/name,value)
    (out/'takes.md').write_text('\n'.join(takes),encoding='utf-8')
    lines=['# Effects map','Frame offsets reference model-derived word timing, not independently certified phoneme onset.','|Beat|Trigger|Onset s|Frame|Quantization frames|','|---|---|---:|---:|---:|']
    lines += [f"|{b['id']}|{b['trigger']}|{b['wordOnsetSeconds']:.4f}|{b['startFrame']}|{b['rendererQuantizationErrorFrames']}|" for b in beats]
    (out/'effects-map.md').write_text('\n'.join(lines),encoding='utf-8')
    save(out/'aligned-props.json',{'editingProfile':'KCI_EDIT_20261026_V1','headline':source['headline'],'edition':source['edition'],'technicalPreview':bool(plan.get('technicalPreview',False)),'preview':True,'fps':args.fps,'durationInFrames':frames,'audioFile':str((assets/'narration-master.wav').relative_to(Path('public').resolve())),'scenes':scenes,'beats':beats,'voiceCode':plan.get('voiceCode'),'sourceProvenance':plan.get('sourceProvenance')})
    print(json.dumps(metrics,ensure_ascii=False,indent=2))


if __name__=='__main__':main()
