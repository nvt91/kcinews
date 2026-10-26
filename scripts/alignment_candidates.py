"""Choose observed word intervals; never synthesize/interpolate missing word timestamps."""
from __future__ import annotations
import unicodedata


def lexical(word: str) -> str:
    return unicodedata.normalize('NFC',word).strip()


def select_monotonic_path(candidates: list[list[dict]]) -> list[dict] | None:
    """Prefer the first acoustic pass; use later measured intervals only when required.

    Every returned start/end pair comes unchanged from an actual model alignment.
    Reject different tokenization, nonpositive duration, or any sequence with overlap.
    This produces a review candidate, not an independent acoustic-accuracy certificate.
    """
    if not candidates or not candidates[0]: return None
    words=[lexical(w['word']) for w in candidates[0]]
    usable=[(i,seq) for i,seq in enumerate(candidates) if [lexical(w['word']) for w in seq]==words]
    previous=[]
    for index in range(len(words)):
        current=[]
        for rank,seq in usable:
            w=seq[index]
            if w['start']<0 or w['end']<=w['start']: continue
            choices=[p for p in previous if p['word']['end']<=w['start']+1e-6]
            if index and not choices: continue
            best=min(choices,key=lambda p:p['cost']) if choices else None
            cost=(best['cost'] if best else 0)+rank
            current.append({'word':dict(w,acousticCandidateIndex=rank),'cost':cost,'previous':best})
        if not current: return None
        previous=current
    state=min(previous,key=lambda p:p['cost']); result=[]
    while state:
        result.append(state['word']);state=state['previous']
    return result[::-1]
