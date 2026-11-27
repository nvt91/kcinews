# KCI voice profile — owner selection, 27 November 2026

## Active selection upon verified merge

- Provider: **VieNeu-TTS v3 Turbo** (official pnnbao97/VieNeu-TTS, Apache-2.0).
- Model: pnnbao-ump/VieNeu-TTS-v3-Turbo, Apache-2.0.
- Exact preset ID: **Thùy Dung** (nữ miền Nam · phong cách tin tức). Do not clone or substitute another speaker.
- Native speech tempo **1.0x**: no speed/pitch transformation. v3 Turbo infer does not implement a distinct speed argument; 1x means original generated cadence.
- ONNX CPU, fp32, 48 kHz source. Pinned SDK source: `scripts/requirements-vieneu.txt`. Model weights fetched from upstream on runner; do not label them installed until a successful real test.
- Applies to all new KR_AM, eligible KR_MID, KR_CLOSE, MACRO21, GLOBAL_US/US_AM (and other new KCI voiced editions). No schedule or publishing-policy changes.
- For new job metadata use `voiceProvider: "vieneu"`, `voiceName: "Thùy Dung"`, `voiceSpeed: 1`. Legacy Vbee metadata in older jobs/prompt templates does not change the actual active default. QC records the actual provider and requested preset from the runner.

## Runtime and QA

`scripts/run-job.mjs` invokes `scripts/vieneu-voice.py` once per voiced job, generating all segments in one process; no Vbee requests for the default. The final CTA stays appended exactly once. Keep alignment based on actual audio, 1080x1920 MP4, source/QC/anti-duplication gates and review rules. Audio export has a −14 LUFS target, not an automatic guarantee; report measured loudness and pronunciation limitations. Smoke workflow uses one real news sentence and exports the audio/probe, no external delivery or publication.

Vbee Anh Khôi Tin tức (code `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`) is retained only as explicitly requested fallback via workflow dispatch tts_provider=vbee or KCI_TTS_PROVIDER=vbee. **No automatic fallback** if VieNeu installation/model/preset/synthesis fails. Report failure and preserve existing artifacts. No extra paid Vbee request without authorization.

Do not regenerate/relabel earlier or in-flight video/audio. Existing jobs must retain truthful actual provider evidence. A successful configuration change alone does not prove listening quality; inspect test artifacts before activation. Completion Watch must read actual run QC, not infer the speaker from the old job title, and not reject a valid earlier Vbee MP4 solely because the default changes. Preserve all existing schedules, source verification, personal newsroom and open CTA standards, job handoff and publication authority.

Upstream sources: https://github.com/pnnbao97/VieNeu-TTS and https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo . Retain upstream attribution/license if redistributing model or SDK assets.
