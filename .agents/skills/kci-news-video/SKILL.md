---
name: kci-news-video
description: Convert verified Korean financial news into professional Vietnamese-voiced short videos using Vbee TTS, Remotion and FFmpeg, with human QC.
---

# KCI News Video

## Mandatory release rules
- A video is NOT finished unless it contains tested and approved Vietnamese narration.
- Do not fall back to English-language voices, eSpeak or silent publishing.
- Every number must match a dated and traceable source; distinguish session closes, intraday highs, and forecasts.
- Never invent price-chart points between reported prices.
- Protect Vbee App ID and Token: GitHub Actions secrets only, not files or ChatGPT messages.
- Do not auto-post. Subtitle alignment here is only an estimate based on word lengths; manual listening and review are required before publishing.

## Use
- The official Remotion skills are installed in the .agents/skills folder and are the technical foundation.
- Create reviewed JSON files in jobs/ using the example. Each scene should contain a newsworthy headline, short summary, source and a natural Vietnamese voiceText.
- Locally or via GitHub Actions, run validate before any Vbee request:
  `node scripts/run-job.mjs --mode=validate --job=jobs/kci-2026-10-23.json`
- In the GitHub Actions workflow **KCI News Video**, first select mode **voice-test**. Listen and approve the resulting MP3.
- Only after the voice is approved, select mode **video**. The pipeline must stop if audio fails or if exported MP4 has no audio stream.
- Mode **preview** can render a silent, prominently marked internal demo but must never be called complete.

## Configuration
GitHub Actions Secrets: `VBEE_APP_ID`, `VBEE_API_TOKEN`.
GitHub Actions Variables: `VBEE_VOICE_CODE`, `VBEE_WEBHOOK_URL`, optionally `VBEE_AUDIO_HOSTS` for an exact verified external audio CDN hostname.

The adapter uses Vbee async API `POST https://api.vbee.vn/v1/tts`, then requests audio by request ID. **The actual polling route, response keys and callback requirements must be tested against the account's specific Vbee API documentation before invoking any chargeable work.** Do not use a dummy callback. If the account requires callback-only delivery, update the architecture to use a real authenticated HTTPS callback and job storage instead of assuming polling.

## Output and approval
- `out/*-preview.mp4` — silent test, not publishable.
- `out/vbee-voice-test.mp3` — voice audition.
- `out/<job-id>.mp4` — rendered MP4 with required audio, still review-only.
- `out/qc.json` — release gate status.
- Review source labels, Vietnamese diacritics, actual spoken names, scene timing, volume and subtitle sync.
- Keep all content as review-only until owner explicitly approves publication.
