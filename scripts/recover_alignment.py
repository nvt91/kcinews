"""Acoustic recovery candidates; never fill missing intervals by equal-word spacing."""
from __future__ import annotations
import difflib
import json
import re
import unicodedata
from pathlib import Path
import subprocess


def norm(text):
    return re.findall(r'\w+',unicodedata.normalize('NFC',text).casefold())


def flattened(result):
    return [{'word':w['word'].strip(),'start':float(w['start']),'end':float(w['end']),'probability':w.get('probability')} for s in result.to_dict()['segments'] for w in s.get('words',[])]


def anchored_candidate(base, asr, aliases):
    """Use observed intervals in matching two-or-more-word runs, keeping canonical words.

    This handles ASR '27' versus script 'hai mươi bảy' without assigning a fabricated
    interval to any component of the number. Unmatched words retain their acoustic
    alignment candidates. Only explicitly confirmed pronunciation aliases are allowed.
    """
    reverse={''.join(norm(spoken)):''.join(norm(canonical)) for canonical,spoken in aliases.items()}
    original=[''.join(norm(w['word'])) for w in base]
    recognized=[reverse.get(''.join(norm(w['word'])),''.join(norm(w['word']))) for w in asr]
    candidate=[dict(w) for w in base]
    for block in difflib.SequenceMatcher(None,original,recognized,autojunk=False).get_matching_blocks():
        if block.size<2:continue
        for offset in range(block.size):
            i,j=block.a+offset,block.b+offset
            observed=asr[j]
            if observed['end']<=observed['start'] or observed['start']<0:continue
            candidate[i]={**candidate[i],'start':observed['start'],'end':observed['end'],'probability':observed.get('probability'),'observedAsrWord':observed['word'],'timingOrigin':'actual ASR interval in matched phrase, no interpolation'}
    return candidate


def recover(model,file:Path,transcript:str,evidence:Path):
    """Observe ASR, explicit pronunciation aliases and context-padded actual audio."""
    import numpy as np
    from alignment_candidates import select_monotonic_path
    observed=[];records=[]
    def checkpoint():
        evidence.parent.mkdir(parents=True,exist_ok=True)
        evidence.write_text(json.dumps({'transcript':transcript,'candidates':records},ensure_ascii=False,indent=2),encoding='utf-8')
    asr=model.transcribe(str(file),language='vi',word_timestamps=True,regroup=False,verbose=None,condition_on_previous_text=False)
    asr_words=flattened(asr)
    records.append({'kind':'ASR-without-supplied-transcript','words':asr_words,'recognizedText':' '.join(w['word'] for w in asr_words)})
    checkpoint()
    if norm(' '.join(w['word'] for w in asr_words))==norm(transcript):observed.append(asr_words)
    # Never treat arbitrary substitutions, e.g. PCE/PCI, as equivalent.
    aliases={'Fed':'Phét'}
    active={canonical:spoken for canonical,spoken in aliases.items() if re.search(r'\b'+re.escape(canonical)+r'\b',transcript,re.I) and spoken.casefold() in norm(' '.join(w['word'] for w in asr_words))}
    attempts_file=evidence.with_name(evidence.name.replace('-recovery.json','-attempts.json'))
    if attempts_file.exists():
        prior=json.loads(attempts_file.read_text())
        for item in prior.get('attempts',[]):
            base=item.get('words',[])
            if not base or norm(' '.join(w['word'] for w in base))!=norm(transcript):continue
            candidate=anchored_candidate(base,asr_words,active)
            records.append({'kind':'ASR-anchored-canonical-candidate','aliases':active,'words':candidate})
            observed.append(candidate);checkpoint()
            if select_monotonic_path(observed):return observed
    if active:
        phonetic=transcript
        for canonical,spoken in active.items():phonetic=re.sub(r'\b'+re.escape(canonical)+r'\b',spoken,phonetic,flags=re.I)
        result=model.align(str(file),phonetic,language='vi',regroup=False,verbose=None,original_split=True,suppress_silence=True,fast_mode=True,token_step=442)
        if result is not None:
            words=flattened(result)
            for w in words:
                for canonical,spoken in active.items():
                    if re.search(r'\b'+re.escape(spoken)+r'\b',w['word'],re.I):
                        w['alignmentText']=w['word'];w['word']=re.sub(r'\b'+re.escape(spoken)+r'\b',canonical,w['word'],flags=re.I)
                        w['pronunciationAliasEvidence']='recognized in actual audio without a supplied transcript'
            records.append({'kind':'ASR-confirmed-pronunciation-alignment','aliases':active,'phoneticTranscript':phonetic,'words':words});checkpoint()
            if norm(' '.join(w['word'] for w in words))==norm(transcript):
                observed.append(words)
                if select_monotonic_path(observed):return observed
    raw=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(file),'-ac','1','-ar','16000','-f','f32le','-'],check=True,capture_output=True).stdout,dtype='<f4').copy()
    for pad in [.5,1.0]:
        result=model.align(np.pad(raw,(round(pad*16000),round(.5*16000))),transcript,language='vi',regroup=False,verbose=None,original_split=True,suppress_silence=False,fast_mode=True,token_step=442)
        if result is None:continue
        words=flattened(result)
        for w in words:w['start']=round(w['start']-pad,6);w['end']=round(w['end']-pad,6)
        records.append({'kind':'padded-actual-audio','inferencePaddingSeconds':pad,'words':words})
        if norm(' '.join(w['word'] for w in words))==norm(transcript):observed.append(words)
        checkpoint()
    return observed
