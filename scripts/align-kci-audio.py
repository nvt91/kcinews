#!/usr/bin/env python3
"""Audio-derived word alignment. No TTS, no credentials, no fabricated word timings."""
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
    log = run(['ffmpeg','-hide_banner','-i',str(path),'-af','silencedetect=noise=-45dB:d=0.15','-f','null','-']).stderr
    found, start = [], None
    for line in log.splitlines():
        m = re.search(r'silence_start: ([\d.]+)', line)
        if m: start = float(m.group(1))
        m = re.search(r'silence_end: ([\d.]+)', line)
        if m and start is not None:
            found.append((start, min(float(m.group(1)), total)))
            start = None
    if start is not None: found.append((start, total))
    return found


def protected_cuts(silences: list, words: list, total: float, fps: float) -> tuple[list, list]:
    """Only quiet gap interiors can be removed. Preserve two frames around speech."""
    handles, cuts, exceptions = 2/fps, [], []
    for start, end in silences:
        if end-start <= .15: continue
        # Any model-aligned word spanning a quiet interval protects that interval.
        if any(w['start'] < end and w['end'] > start for w in words):
            exceptions.append({'start': start, 'end': end, 'reason': 'word-overlap; preserve speech'})
            continue
        left = max((w['end'] for w in words if w['end'] <= start), default=0.)
        right = min((w['start'] for w in words if w['start'] >= end), default=total)
        a = max(start+handles, left+handles)
        b = min(end-handles, right-handles)
        if start <= .001: a = 0.
        if end >= total-.001: b = total
        if b-a >= 1/fps:
            cuts.append({'start': round(a,6), 'end': round(b,6), 'seconds': round(b-a,6), 'reason': 'waveform silence; two-frame speech handles'})
        else:
            exceptions.append({'start':start, 'end':end, 'reason':'two-frame handles leave no safe removable gap'})
    return cuts, exceptions


def keep_ranges(cuts: list, total: float) -> list[tuple[float, float]]:
    result, last = [], 0.
    for cut in sorted(cuts, key=lambda c:c['start']):
        a,b = cut['start'],cut['end']
        if a < last or b <= a or b > total+1e-6: raise ValueError('Overlapping or invalid cut')
        if a > last: result.append((last,a))
        last=b
    if last < total: result.append((last,total))
    return result


def pcm(path: Path):
    import numpy as np
    data=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar','48000','-f','f32le','-'],check=True,capture_output=True).stdout
    return np.frombuffer(data,dtype='<f4').copy()


def write_wav(path: Path, audio) -> None:
    import numpy as np
    path.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(48000)
        f.writeframes(np.round(np.clip(audio,-1,1)*32767).astype('<i2').tobytes())


def norm(value: str) -> list[str]:
    return re.findall(r'\w+',unicodedata.normalize('NFC',value).casefold())


def locate(words: list, phrase: str, occurrence: int = 0) -> list:
    tokens, indices=[],[]
    for i,w in enumerate(words):
        for token in norm(w['word']): tokens.append(token); indices.append(i)
    query=norm(phrase)
    matches=[i for i in range(len(tokens)-len(query)+1) if tokens[i:i+len(query)]==query]
    if not query or occurrence >= len(matches): raise ValueError('Trigger not present in actual aligned transcript: '+phrase)
    i=matches[occurrence]
    return words[indices[i]:indices[i+len(query)-1]+1]


def main() -> None:
    import numpy as np
    import stable_whisper
    import torch
    p=argparse.ArgumentParser()
    p.add_argument('--props',required=True);p.add_argument('--audio-root',required=True)
    p.add_argument('--output',required=True);p.add_argument('--asset-dir',required=True)
    p.add_argument('--plan',required=True);p.add_argument('--model',default='small')
    p.add_argument('--fps',type=float,default=30)
    args=p.parse_args()
    if not 1 <= args.fps <= 120: raise ValueError('Invalid established project FPS')
    source=json.loads(Path(args.props).read_text()); plan=json.loads(Path(args.plan).read_text())
    if plan.get('inputKind') != 'tts_motion': raise ValueError('Camera input requires separate take/A-V/face pipeline; not silently supported')
    out=Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
    assets=Path(args.asset_dir).resolve();assets.mkdir(parents=True,exist_ok=True)
    root=Path(args.audio_root).resolve()
    torch.set_num_threads(2)
    model=stable_whisper.load_faster_whisper(args.model,device='cpu',compute_type='int8',cpu_threads=2,num_workers=1)
    versions={name:importlib.metadata.version(name) for name in ['stable-ts','faster-whisper','ctranslate2']}
    inventory, edl, all_words, scenes, assembled=[],[],[],[],[]
    offset=0.; raw_total=0.; candidates=0; removed_count=0
    takes=['# takes.md\n','Input: preserved Vbee TTS audio, no recorded retakes.','Take selection / rejected camera takes: N/A. No new TTS calls.\n']
    for i,scene in enumerate(source['scenes']):
        src=(root/scene['audioFile']).resolve()
        if not src.is_relative_to(root) or not src.is_file(): raise ValueError('Invalid local source audio')
        text=scene.get('voiceText','').strip()
        if not text: raise ValueError('Missing exact narration; do not guess transcript')
        raw=pcm(src); raw_seconds=len(raw)/48000; raw_total+=raw_seconds
        def aligned(file: Path, tag: str) -> list:
            cache=out/'alignment'/(scene['id']+'-'+tag+'.json')
            key=hashlib.sha256((sha(file)+text+args.model+json.dumps(versions,sort_keys=True)).encode()).hexdigest()
            if cache.exists() and (cached:=json.loads(cache.read_text())).get('cacheKey')==key:
                return cached['words']
            result=model.align(str(file),text,language='vi',regroup=False,verbose=None,original_split=True,suppress_silence=True)
            if result is None: raise ValueError('Whisper alignment failed')
            data=result.to_dict()
            words=[{'word':w['word'].strip(),'start':float(w['start']),'end':float(w['end']),'probability':w.get('probability')} for seg in data['segments'] for w in seg.get('words',[])]
            if not words or norm(' '.join(w['word'] for w in words)) != norm(text): raise ValueError('Aligned transcript changed or omitted words')
            bad=[w for w in words if w['end'] <= w['start']]
            if bad: raise ValueError('Zero-duration words require alignment review: '+str(bad[:3]))
            save(cache,{'cacheKey':key,'method':'Whisper cross-attention/DTW forced alignment on actual audio; not ground-truth onset','model':args.model,'versions':versions,'audioSha256':sha(file),'transcript':text,'words':words})
            return words
        original_words=aligned(src,'original')
        silences=silence_ranges(src,raw_seconds); candidates+=len(silences)
        cuts,exceptions=protected_cuts(silences,original_words,raw_seconds,args.fps)
        ranges=keep_ranges(cuts,raw_seconds)
        chunks=[]; mapping=[]; local_offset=0.
        for a,b in ranges:
            start,end=round(a*48000),round(b*48000)
            part=raw[start:end].copy()
            fade=min(240,len(part)//2) # 5 ms, inside the protected quiet handles.
            if start>0 and fade: part[:fade]*=np.linspace(0,1,fade)
            if end<len(raw) and fade: part[-fade:]*=np.linspace(1,0,fade)
            chunks.append(part)
            mapping.append({'sourceStart':start/48000,'sourceEnd':end/48000,'outputStart':local_offset,'outputEnd':local_offset+len(part)/48000})
            local_offset+=len(part)/48000
        edited=np.concatenate(chunks) if chunks else raw.copy()
        edited_file=assets/(scene['id']+'-edited.wav');write_wav(edited_file,edited)
        words=aligned(edited_file,'edited') # Re-align the actual edited audio, not uniform re-timing.
        edited_seconds=len(edited)/48000
        words=[dict(w,start=w['start']+offset,end=w['end']+offset,sceneId=scene['id']) for w in words]
        all_words.extend(words)
        scenes.append({**scene,'startSeconds':offset,'endSeconds':offset+edited_seconds,'audioFile':None,'captions':[]})
        inventory.append({'sceneId':scene['id'],'file':str(src.relative_to(root)),'sha256':sha(src),'rawDecodedSeconds':raw_seconds,'encodedContainerSeconds':duration(src),'editedSeconds':edited_seconds,'inputKind':'tts_motion'})
        edl.append({'sceneId':scene['id'],'silencesDetected':silences,'removed':cuts,'protectedExceptions':exceptions,'sampleAccurateMapping':mapping,'speechHandlesFrames':2,'joinFadeMs':5})
        removed_count+=len(cuts); assembled.append(edited); offset+=edited_seconds
        takes.append(f"## {scene['id']}\nSource `{src.name}`; range 0–{raw_seconds:.6f}s. Single existing TTS segment retained. Rejected retakes: N/A.\n\n{text}\n")
    joined=np.concatenate(assembled);write_wav(assets/'narration-edited.wav',joined)
    write_wav(assets/'narration-raw.wav',np.concatenate([pcm(root/s['audioFile']) for s in source['scenes']]))
    beats=[]
    for n,cue in enumerate(plan['beats']):
        words=[w for w in all_words if w['sceneId']==cue['sceneId']]
        selected=locate(words,cue['trigger'],cue.get('occurrence',0))
        onset=selected[0]['start']; frame=round(onset*args.fps)
        beats.append({**cue,'id':f'beat-{n+1:03d}','startFrame':frame,'firstVisibleFrame':frame,'wordOnsetSeconds':onset,'wordEndSeconds':selected[-1]['end'],'rendererQuantizationErrorFrames':round(frame-onset*args.fps,5),'words':selected,'groundTruthSyncStatus':'REQUIRES_LISTENING_REVIEW'})
    beats.sort(key=lambda b:b['startFrame'])
    for n,b in enumerate(beats):
        b['endFrame']=beats[n+1]['startFrame'] if n+1<len(beats) else math.ceil(offset*args.fps)
        if b['endFrame']<=b['startFrame']: raise ValueError('Two effects collide at one frame; simplify plan')
        b['durationFrames']=min(round(.4*args.fps),b['endFrame']-b['startFrame'])
    # A short silent visual-only tail returns to the first frame without replaying/cutting voice.
    frames=math.ceil(offset*args.fps)+round(.5*args.fps)
    metrics={'inputKind':'tts_motion','model':args.model,'alignmentVersions':versions,'rawDecodedAudioSeconds':raw_total,'rawEncodedAudioSeconds':sum(x['encodedContainerSeconds'] for x in inventory),'editedNarrationSeconds':offset,'previewDurationSeconds':frames/args.fps,'visualLoopTailSeconds':frames/args.fps-offset,'sourceClipCount':len(inventory),'selectedTtsSegments':len(inventory),'rejectedTakes':None,'rejectedTakesReason':'N/A: no camera retakes','silencesDetected':candidates,'silencesActuallyCut':removed_count,'secondsRemoved':raw_total-offset,'actualCutRanges':removed_count,'fps':args.fps,'fpsSource':'Existing graphics-only Remotion timebase; no camera footage','faceCheck':'N/A: graphics-only, no face footage','music':'none','denoise':'bypassed: clean preserved TTS; avoid damaging consonants','manualListening':'NOT_PERFORMED_BY_AUTOMATED_PIPELINE','groundTruthTwoFrameSync':'NOT_VERIFIED','quantizationMaxAbsFrames':max(abs(b['rendererQuantizationErrorFrames']) for b in beats),'published':False,'finalRendered':False}
    save(out/'source-inventory.json',inventory);save(out/'edit-decisions.json',edl)
    save(out/'words.json',all_words);save(out/'effects-map.json',beats);save(out/'metrics.json',metrics)
    (out/'takes.md').write_text('\n'.join(takes),encoding='utf-8')
    lines=['# Effects map','Offsets compare rendered frames to model-derived audio alignment, NOT independently verified phoneme ground truth.','|Beat|Trigger|Onset s|Frame|Quantization frames|','|---|---|---:|---:|---:|']
    lines += [f"|{b['id']}|{b['trigger']}|{b['wordOnsetSeconds']:.4f}|{b['startFrame']}|{b['rendererQuantizationErrorFrames']}|" for b in beats]
    (out/'effects-map.md').write_text('\n'.join(lines),encoding='utf-8')
    props={'editingProfile':'KCI_EDIT_20261026_V1','headline':source['headline'],'edition':source['edition'],'technicalPreview':bool(plan.get('technicalPreview',False)),'preview':True,'fps':args.fps,'durationInFrames':frames,'audioFile':str((assets/'narration-master.wav').relative_to(Path('public').resolve())),'scenes':scenes,'beats':beats,'voiceCode':plan.get('voiceCode'),'sourceProvenance':plan.get('sourceProvenance')}
    save(out/'aligned-props.json',props)
    print(json.dumps(metrics,ensure_ascii=False,indent=2))


if __name__=='__main__': main()
