"""Acoustic recovery candidates; never fill missing intervals by equal-word spacing."""
from __future__ import annotations
import json
import re
import unicodedata
from pathlib import Path
import subprocess


def norm(text):
    return re.findall(r'\w+',unicodedata.normalize('NFC',text).casefold())


def flattened(result):
    return [{'word':w['word'].strip(),'start':float(w['start']),'end':float(w['end']),'probability':w.get('probability')} for s in result.to_dict()['segments'] for w in s.get('words',[])]


def recover(model, file:Path, transcript:str, evidence:Path):
    """Observe ASR, explicit pronunciation aliases and padded actual audio.

    Alias text is used for alignment only. Canonical transcript and source audio never change.
    An alias is used only when actually recognized in this audio; all evidence is retained.
    """
    import numpy as np
    observed=[];records=[]
    def checkpoint():
        evidence.parent.mkdir(parents=True,exist_ok=True)
        evidence.write_text(json.dumps({'transcript':transcript,'candidates':records},ensure_ascii=False,indent=2),encoding='utf-8')
    asr=model.transcribe(str(file),language='vi',word_timestamps=True,regroup=False,verbose=None,condition_on_previous_text=False)
    asr_words=flattened(asr)
    records.append({'kind':'independent-ASR','words':asr_words,'recognizedText':' '.join(w['word'] for w in asr_words)})
    checkpoint()
    if norm(' '.join(w['word'] for w in asr_words))==norm(transcript):observed.append(asr_words)
    # The observed Vietnamese pronunciation of the acronym Fed is not a missing word.
    # Do not treat arbitrary ASR substitutions (e.g. PCE/PCI) as equivalent.
    aliases={'Fed':'Phét'}
    active={canonical:spoken for canonical,spoken in aliases.items() if re.search(r'\b'+re.escape(canonical)+r'\b',transcript,re.I) and spoken.casefold() in norm(' '.join(w['word'] for w in asr_words))}
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
                        w['pronunciationAliasEvidence']='recognized in actual audio by independent Whisper ASR'
            records.append({'kind':'ASR-confirmed-pronunciation-alignment','aliases':active,'phoneticTranscript':phonetic,'words':words})
            checkpoint()
            if norm(' '.join(w['word'] for w in words))==norm(transcript):
                observed.append(words)
                if all(w['end']>w['start']>=0 for w in words):return observed
    raw=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(file),'-ac','1','-ar','16000','-f','f32le','-'],check=True,capture_output=True).stdout,dtype='<f4').copy()
    for pad in [.5,1.0]:
        data=np.pad(raw,(round(pad*16000),round(.5*16000)))
        result=model.align(data,transcript,language='vi',regroup=False,verbose=None,original_split=True,suppress_silence=False,fast_mode=True,token_step=442)
        if result is None:continue
        words=flattened(result)
        for w in words:w['start']=round(w['start']-pad,6);w['end']=round(w['end']-pad,6)
        records.append({'kind':'padded-actual-audio','inferencePaddingSeconds':pad,'words':words})
        if norm(' '.join(w['word'] for w in words))==norm(transcript):observed.append(words)
        checkpoint()
    return observed
