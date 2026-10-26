# Word-aligned voiced preview runtime

Implementation introduced 26 October 2026. This supplements EDITING_WORKFLOW.md; an implementation or a passing unit test is not proof of acoustic QC on a specific video.

## Ordinary new episodes

`scripts/run-job.mjs --mode=preview --job=jobs/<reviewed>.json` is now a voiced-preview route. The legacy `video` mode and owner `[KCI VIDEO]` issue route alias PREVIEW, never automatic final. `validate` remains no-TTS; `voice-test` remains a separate short trial. Existing archived media are not changed.

A schemaVersion2 job needs an `editingPlan` object or `editingPlanPath` pointing to a checked-in JSON under jobs/ or editorial/:

```json
{
  "inputKind": "tts_motion",
  "technicalPreview": false,
  "beats": [{
    "sceneId": "hook",
    "trigger": "exact words present in narration",
    "occurrence": 0,
    "keyword": "Two to four words",
    "label": "Source-backed label",
    "value": "Verified display value",
    "context": "Required unit, date, session and estimate qualifier",
    "kind": "fact"
  }]
}
```

Every beat needs an actual spoken trigger. Editors choose and verify the display text and source linkage; the renderer does not invent news or automatically validate a displayed financial claim. `kind: cta` gives a comment icon; CTA speech remains exactly once in the last scene. Plan validation/capability checks happen before Vbee. Missing plan -> BLOCKED_BEAT_PLAN, not a silent fallback to old captions.

The current executable path supports TTS/motion. Camera takes, eye tracking, color matching and mixed/VFR footage require a dedicated media path; they must not be marked passed here. Pure graphics retains30fps. The lower-level preview renderer accepts an established FPS, but does not establish a camera's FPS itself.

## Reuse existing audio, no Vbee

```bash
bash scripts/install-alignment.sh
node scripts/run-voiced-preview.mjs --mode=preview \
  --props=source/out/props.json --audio-root=source/public \
  --plan=jobs/<reviewed-effects-plan>.json --output=output \
  --id=<unique-preview-id> --model=small --fps=30 --version=v1
```

Source props must include the exact narration used in every audio segment, including the once-only CTA when already appended. Do not append it again. Original source/date labels remain unchanged for technical archival re-edits.

## Evidence

- Actual Whisper cross-attention/DTW alignment of each original and edited audio, stored with audio hash/model/package versions. No evenly spaced word-count timestamps.
- Waveform silence candidates over0.15s, protected word intervals and two-frame speech handles; five-millisecond join fades. Exceptions retained and logged. Re-alignment after editing.
- `output/words.json`, `alignment/`, `takes.md`, `edit-decisions.json`, `source-inventory.json`, `effects-map.json/md`, `metrics.json`.
- Actual voiced `output/preview.mp4`, one settled still and onset-neighbor stills for every effects-map beat, `beat-stills.json` and `frame-index.json`.
- DOM safe-bound/overflow checks on rendered frames, full decode, encoded loudness/true-peak and black-frame checks. Applied master target-14LUFS; pre-encode peak margin-1.5dBTP to protect the encoded<=-1dBTP limit. No music/SFX by default.
- Camera retakes/face overlap/skin grading are N/A for TTS/motion. Decoded raw duration differs from MP3 container duration; both are reported. Rejected camera takes is null/N/A, not invented zero.

A renderer quantization error under0.5frame relative to model timestamps is NOT independently verified word-onset accuracy. Pronunciation, natural joins/clicks and the owner's two-frame acoustic requirement need listening/waveform review. The automated output is PREVIEW_QA_REQUIRED until those checks actually pass. Inspect/correct every beat before claiming full QC. A complete technical preview is not approval to publish its archival news.

## Final gate

No final on normal issue/scheduled path. After explicit owner approval of the identified cut and completed listening/factual/sync QA, retain approval provenance and matching preview/props/audio hashes in approval.json. Invoke the lower-level `--mode=final --approval=<path>` on the same retained assets only. It rejects missing/mismatched approval. Output `output/final.mp4`,1080x1920,H.264 target18Mbps,AAC320k. Do not manufacture approval, mark tests as owner approval or call final during preview review. Preserve the original narration and all source/approval records.

## Cost/retry controls

Vbee narration uses the selected Anh Khôi Tin tức voice, with a local exact-text+voice content-addressed cache and receipt. Pending/unknown requests block a repeat. Preserve the artifact and restore appropriate cache before any retry on a fresh runner; local cache alone is not cross-run dedup. Producers still check exact edition/issues/runs before triggering. Test workflow uses the existing2026-10-26 audio artifact and NO Vbee secrets or requests. Never include font binaries in deliverables.
