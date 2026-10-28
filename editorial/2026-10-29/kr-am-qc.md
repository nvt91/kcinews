# KR_AM 29/10/2026 — Render and QC evidence

ArticleId KCI-20261029-KR-AM; GitHub issue #46; run 40784162880 SUCCESS; artifact 12858244591 created **29/10/2026 08:08:38 KST**, expires **05/11/2026 08:08:36 KST**. Full voiced MP4 `out/kci-2026-10-29-kr-am.mp4` with 7 Vbee Anh Khôi MP3s, Remotion KciNewsDaily schema2. **CHỜ ANH DUYỆT — CHƯA ĐĂNG.**

## Independent local QC (source artifact downloaded and extracted)

- Source MP4 **108.500 seconds**, **3,255 frames**, **1080×1920 30fps H.264**, video ~**1.455 Mbps**; AAC 48kHz stereo ~**317.4 kbps**; 24,162,387 bytes; SHA256 `bb734cd27777e6c642ec6ba07bcdcdff28ae0bb57a121c5c6c579312bd8117ce`.
- Original source 7 Vbee MP3s **106.056 seconds total** (13.416+15.048+13.824+17.136+15.576+13.824+17.232). Camera takes/rejected takes **N/A**; seven distinct scripted TTS scenes, not seven camera takes.
- Original MP4 full FFmpeg audio/video decode **PASS**. Blackdetect >0.08s: **0 detected**. Seven scene stills and a contact sheet inspected; numbers in frame CBSI 104.2, KOSPI 6012.44, Samsung preliminary 107.4 trillion KRW match source-ledger, no obvious cropped labels in sampled frames.
- Original encoded loudness **−20.25 LUFS**, true peak **−3.39 dBTP**. A separate review copy was made **29/10 08:11:15 KST** with unchanged H.264 video bitstream, 80Hz high-pass and AAC loudness normalization; mastered encoded **−14.59 LUFS / −1.40 dBTP**, AAC measured ~**236.5 kbps** (target 320kbps not met), video remains ~1.455Mbps (target ~18Mbps not met). Mastered review copy 23,064,889 bytes, SHA256 `75f5b16b94fff346c4a5e88bb61770dfa14d9751594a20c10f52397b536b8382`; full decode PASS. It is delivered as an MP4 attachment in ChatGPT, not stored in GitHub artifact.
- Silence detector −45dB >0.4s found **7** segments of roughly 0.55–0.72 seconds. **0 intervals actually cut**, no waveform-protected EDL; no audio retakes or repeated paid synthesis. TTS/graphics-only: face tracking, skin grade and camera take selection N/A.

## QC limits — NOT PASS

- Full listening of Vietnamese pronunciation, clicks/pops and CTA not independently completed; Vbee Anh Khôi based on workflow voiceCode and actual 7 MP3 segments, not speaker identification by listening.
- Word timing uses proportional seven-word captions, not Whisper. Exact effects onset ±2 frames and keyword-only 2–4 words **TIMING_UNVERIFIED**. Seven scene stills do NOT cover every individual effect. Dynamic safe-zone QA NOT_VERIFIED; upper-right scene counter may be within excluded right 140px.
- Hook frame0 has branded dark background before title appears; title visible by 0.5s. Required motion change every 1–1.5s NOT_VERIFIED.
- The **KR_CLOSE 28/10** prior video/brief cited **KOSPI 5997.27 (+6.37%)** from secondary data, conflicting with crosschecked **6012.44 (+6.63%)** [Newsis](https://mobile.newsis.com/view/NISX20261028_0003845065) and [Hankyung](https://markets.hankyung.com/indices/kospi). **Do not publish old KR_CLOSE cut without correction**; this new KR_AM uses crosschecked value.
- Samsung Q3 detailed earnings are still FUTURE at cutoff **07:57:30 KST**; before later publishing, recheck whether 29/10 results have since appeared.

## Scene timing map (from actual Remotion props, NOT word effects map)

| Scene | Time seconds | Source MP3 seconds |
|---|---|---|
| hook | 0.000–13.767 | 13.416 |
| cbsi | 13.767–29.167 | 15.048 |
| spread | 29.167–43.333 | 13.824 |
| samsung | 43.333–60.833 | 17.136 |
| market | 60.833–76.767 | 15.576 |
| outlook | 76.767–90.933 | 13.824 |
| outro + CTA | 90.933–108.500 | 17.232 |

**QC: MP4 — CẦN RÀ SOÁT. H: CHỜ DUYỆT. I: CHƯA ĐĂNG.** No publication or extra TTS.