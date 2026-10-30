# KR_MID 30/10/2026 — Rendered review QC receipt

**ArticleId:** KCI-20261030-KR-MID · **Run:** https://github.com/nvt91/kcinews/actions/runs/40992576444 · **Artifact:** https://github.com/nvt91/kcinews/actions/runs/40992576444/artifacts/12950675333 · **Issue:** https://github.com/nvt91/kcinews/issues/57

## Confirmed from live GitHub Actions and artifact metadata

- GitHub Actions `render` completed **success** at 11:42:47 KST on 30 Oct 2026. Artifact `kci-40992576444` ID **12950675333** created **11:42:42 KST**; 23,323,807-byte ZIP, expires **06 Nov 2026 11:42:41 KST**; GitHub login required.
- Actual runner log: validated `kci-2026-10-30-kr-mid`, seven scenes; Cloudflare Worker readiness HTTP200 before Vbee; Remotion encoded **3166 frames** at nominal **30 FPS** = **105.533 s**; output `out/kci-2026-10-30-kr-mid.mp4`, log size ~24 MB.
- Runner `ffprobe` audio stream presence check passed; `out/qc.json` status REVIEW_REQUIRED, `voicePresent=true`, `ctaIncluded=true`, `published=false`. Vbee Anh Khôi voice code from workflow. H.264 requested by render command; AAC is expected from renderer but **codec, bitrate, exact dimensions and audio properties not independently re-probed in this QC pass**.
- Artifact download exists; independent MP4 extraction, full FFmpeg decode, audio listening, sampled frame visual inspection and direct inline playback could not be completed in this environment. Do not claim these passed.

## Required editing profile status

- **TTS/motion:** no camera takes, no face/eye tracking, no live-footage color grade: **N/A**. Takes rejected: **N/A**, not fabricated zero.
- Source-audio raw duration: **NOT_MEASURED**. Finished duration from encoded frame count: **105.533s**. Silence removed / filler / breaths / take removals: **NOT_MEASURED**; legacy runner does not implement verified waveform cut log.
- Whisper actual word timestamps, two-frame timing, per-word effects map, keyword-only 2–4-word layer, per-beat stills, safe zones at all frames, visual design, audio pops: **NOT_VERIFIED**. Runner's subtitles are estimated from word count and cannot pass measured sync.
- Loudness −14 LUFS, true peak ≤−1 dBTP, AAC 320kbps, video ~18Mbps: **NOT_MEASURED**; do not claim pass.
- Editorial source check **PASS** for one new market event after 07:58 KR_AM: KRX sidecar 10:04:55 KST. Original event-specific KRX KIND filing not retrieved; two Korean sources cite KRX and KRX official rule consulted. Market numbers are labeled 09:03, 10:04:55 and 10:15, not 30 Oct close; no NXT blending.

## Review status and Sheet

**PREVIEW_QA_REQUIRED / MP4 — CẦN RÀ SOÁT / CHỜ DUYỆT / CHƯA ĐĂNG.** This is a complete rendered review MP4, not an approved post. No automatic publication. Google Sheet `Trang tính1` row31 exact articleId; C actual artifact timestamp 11:42:42 KST; E real artifact URL; G MP4 — CẦN RÀ SOÁT; H CHỜ DUYỆT; I CHƯA ĐĂNG. Readback verified 11:43 KST. Caption <50 Vietnamese words including hashtags. Do not rerun paid Vbee to resolve Sheet/QA metadata.
