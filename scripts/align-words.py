#!/usr/bin/env python3
"""Word timing for KCI captions (17/11/2026, step 1 "video sinh động hơn").

Measures when each word of the KNOWN script is spoken in a real Vbee MP3:
faster-whisper (CPU, no torch) gives recognised words with timestamps, then the
script words are aligned onto them. The caption text is always the script text,
never Whisper's spelling. Words Whisper missed get times interpolated between
their aligned neighbours. If anything fails, the runner keeps the old
proportional captions, so this step can never block a render.

Usage: python3 scripts/align-words.py <audio.mp3> <script.txt> <out.json>
Env:   KCI_WHISPER_MODEL (default "small"), KCI_WHISPER_THREADS.
"""
from __future__ import annotations

import difflib
import json
import os
import re
import sys
import unicodedata


def norm(word: str) -> str:
    """Lowercase, strip punctuation and Vietnamese diacritics for matching only."""
    w = unicodedata.normalize("NFD", word.lower().replace("đ", "d"))
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^0-9a-z]", "", w)


def main() -> int:
    audio, script_path, out_path = sys.argv[1:4]
    script_words = open(script_path, encoding="utf-8").read().split()
    if not script_words:
        raise SystemExit("empty script")

    from faster_whisper import WhisperModel

    model = WhisperModel(
        os.environ.get("KCI_WHISPER_MODEL", "small"),
        device="cpu",
        compute_type="int8",
        cpu_threads=int(os.environ.get("KCI_WHISPER_THREADS", "4")),
    )
    # Decode with the ffmpeg already used by the runner (avoids PyAV version issues).
    import subprocess
    import numpy as np
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    samples = np.frombuffer(pcm, dtype="<f4").copy()
    segments, info = model.transcribe(
        samples,
        language="vi",
        word_timestamps=True,
        vad_filter=False,
        beam_size=5,
        initial_prompt=" ".join(script_words)[:800],
    )
    heard = [
        {"text": w.word.strip(), "start": float(w.start), "end": float(w.end)}
        for seg in segments for w in (seg.words or []) if w.word.strip()
    ]
    if not heard:
        raise SystemExit("whisper heard no words")
    total = float(info.duration)

    a = [norm(w) for w in script_words]
    b = [norm(w["text"]) for w in heard]
    times: list[tuple[float, float] | None] = [None] * len(script_words)
    matcher = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for block in matcher.get_matching_blocks():
        for k in range(block.size):
            h = heard[block.b + k]
            times[block.a + k] = (h["start"], h["end"])

    matched = sum(t is not None for t in times)
    ratio = matched / len(script_words)

    # Interpolate unmatched runs between their aligned neighbours.
    i = 0
    while i < len(times):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        left = times[i - 1][1] if i > 0 else 0.0
        right = times[j][0] if j < len(times) else total
        right = max(right, left)
        span = (right - left) / (j - i)
        for k in range(i, j):
            times[k] = (left + span * (k - i), left + span * (k - i + 1))
        i = j

    words = []
    last = 0.0
    for text, (start, end) in zip(script_words, times):
        start = max(start, last)
        end = max(end, start + 0.05)
        words.append({"text": text, "startMs": round(start * 1000), "endMs": round(end * 1000)})
        last = start
    json.dump({"matchedRatio": round(ratio, 3), "durationMs": round(total * 1000), "words": words},
              open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"aligned {matched}/{len(script_words)} script words ({ratio:.0%}) in {total:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
