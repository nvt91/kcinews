# KCI voice profile — owner selection, 26 October 2026

## Current selection

- Provider: Vbee.
- Display name supplied by the owner: **Anh Khôi Tin tức**.
- Exact voice code: `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`.
- Applies to NEW KCI voice generation: Korean news (KR_AM/KR_MID/KR_CLOSE/KR_SPECIAL), macro, and the separate Global/US KCI workflow. Their schedules and editorial scopes remain independent and unchanged.
- This selection supersedes the previous Tuấn Anh News default. No unapproved fallback to a different voice when Vbee rejects the requested code.

## Implementation and QA

`.github/workflows/kci-video.yml` passes this exact code through `VBEE_VOICE_CODE`. The existing `scripts/vbee.mjs` reads that environment value and sends it as `voiceCode`. Keep App ID, token, callback, allowlisted audio hosts, layout, timing settings and publishing restrictions unchanged.

The owner has selected the name/code. This is NOT evidence that Vbee has accepted a request, that the account has access to this voice, or that a human has listened and approved its output. At the next authorized production or voice-test execution, follow the existing short-trial/listening gate for a changed speaker before producing the full narration. Reuse the same verified trial rather than repeatedly purchasing tests. If verification cannot be completed, report the exact status; do not claim audio quality was checked.

Record the requested voice name/code in new job metadata and report the actual voice evidence in QC. A configuration change alone is not a rendered MP4 or a successful synthesis test.

## Migration and cost boundaries

- Do not regenerate, relabel or replace previously rendered MP4/audio, archived jobs, source ledgers or Sheet QC history just because the default has changed.
- Existing/in-flight jobs may have read their original workflow configuration. Inspect the actual run/voice evidence before labeling them; do not restart or purchase replacement narration without a separate authorized production/revision request.
- Visual-only revisions of an existing approved clip continue to reuse its original voice unless the owner explicitly requests replacing that clip's narration.
- This configuration update does not itself trigger Vbee, render jobs, publication or extra schedules.
- Completion Watch must compare each artifact with its own job/run configuration, not retroactively require Anh Khôi for older Tuấn Anh clips. It must never mislabel old audio as the new voice.
- Preserve `CHỜ DUYỆT — CHƯA ĐĂNG` and the existing KCI News Sheet reconciliation rules.
