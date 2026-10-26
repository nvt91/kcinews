# KCI nine-step post-production — owner brief, 26 October 2026

**Purpose.** Extend the existing verified-brief → hook/script → Vbee → Remotion → review pipeline with disciplined editing, sound, word-aligned motion and a real preview gate. This reference applies to every NEW KCI video producer (KR_AM, conditional KR_MID, KR_CLOSE, MACRO21, GLOBAL_US/US_AM) whenever its task reads \`SKILL.md\`, plus the QC/completion watcher. **It does not change any actual clock schedules, edition quotas, data sourcing, the selected Anh Khôi voice code, GitHub Secrets or publication permissions.** Neither this document nor an automation prompt installs Whisper, face tracking, new effects or changes the executable renderer by itself. State which stages have actually run on each video.

## First classify the media

A. **NEWS_GRAPHICS** — the default KCI daily video: original verified finance brief, Vbee Anh Khôi Tin tức audio, numerical/typographic Remotion motion graphics and possibly licensed stills/B-roll. **No filmed presenter, no repeated spoken takes, no human face to track.** Apply mandatory stages 5–9, and practical audio/QC handling of stages 1–2. Mark stages 3–4 as \`N/A (no live-action footage)\` except optional legitimately sourced B-roll.

B. **TALKING_HEAD / RAW_FOOTAGE** — enabled only when user supplies or explicitly approves actual camera source clips/recorded takes. Then stages 1–4 apply fully, including take inventory, edit-aware cut points, consistent grading and face-aware zoom. Preserve evidence and editing choices. Never fabricate takes, a person, a face, a before/after image, a count or an observation.

C. **MIXED** — apply 1–4 to real camera/B-roll portions only; to Vbee/graphics use the NEWS_GRAPHICS path. Preserve actual provenance in the episode QC report.

Check tools first. Whisper word timestamps, forced alignment, face tracking, loudness/true-peak measurement, scene stills and rendering are capabilities **only when available and successfully executed**. If a critical tool is absent, mark the related precision check \`NOT_VERIFIED\`, do not invent a \`PASS\`. Use a simpler safe presentation or report a blocker rather than fake word-level timing/face tracking.

## 1. CHỌN TAKE TỐT NHẤT — conditional

For each real recorded clip, extract timestamped transcription with Whisper word timestamps (or a verified alignment tool). Match each script sentence to all observed attempts. Normally select the **last complete attempt**, except when it noticeably stumbles, swallows words, lacks energy, contains errors, or mismatches verified data; then pick the next-best complete take. Review against actual waveform and sound, not speech-to-text alone. Save \`takes.md\` with: script sentence, chosen source clip, source in/out timestamps, candidate take IDs, choice rationale, excluded attempts and listening verification.

For Vbee (the normal KCI workflow), a separately synthesized narration segment is **one segment, not many human takes**; do not infer retries or claim \`last take is best\`. If several authorized Vbee alternatives genuinely exist, select by pronunciation, energy and correctness; use only a verified version. Record \`takes.md: N/A — TTS single rendition\` rather than inventing takes. Avoid repeated billable TTS simply to create pseudo-takes; retain and reuse approved audio.

## 2. CẮT GỌN — speech-faithful

Join the genuinely selected camera takes in script order. Remove unwanted pauses **longer than 0.15 s**, obvious filler words ("ờ", "ừm"), retakes and distracting between-sentence breaths **when removing them does not harm cadence or meaning**. For Vbee, trim excessive leading/trailing blank regions and audible defects, but **keep intentional prosodic pauses**, especially around numbers, dates, ticker names and cause/effect analysis. Never force every pause above 0.15 s to zero.

Set cuts against actual waveforms/zero crossings and audition: don't cut mid-word. When footage supports the cut, leave ~2 frame handles on each side and use very short audio fades/crossfades to prevent clicks. 2 frames at 30 fps ≈ 67 ms. Preserve enough space before plosives and after consonants; waveform verification overrides naive Whisper timestamp boundaries. Do not trim/accelerate narration solely to satisfy a target duration. Store exact cut ranges/counts only when actually measured.

## 3. CHỈNH MÀU — footage/B-roll only

For real footage and licensed video B-roll: consistent exposure and white balance across adjacent takes; subtle cinematic S-curve, healthy natural slightly warm skin, gently warm highlights, mildly cooler shadows, slightly reduced saturation, soft vignette. Preserve a non-graded original for before/after comparison. Check for flashing at each cut and avoid face/skin distortion. **Do not apply skin LUTs, vignette or faux before/after claims to pure charts, index numbers or static KCI branding.** A graphics-only video marks \`color correction = N/A\` unless underlying image/video footage actually needs it.

## 4. ZOOM / CROP — footage conditional; graphics adapt

Where there is a real presenter, locate eyes and keep eye position/crop safe through the zoom. Alternate wide 100% and tight ~120% at intentional jump cuts **only when source resolution allows**; at 1080p source cap at **115%** per the owner's sharper-footage rule. Favor 100%/115% on 1080p over blindly applying 120%. For meaningful emphasis use a smooth 0.4 s ease-in/out push-in without shake/bounce, respecting Instagram/Facebook Reels UI coverage.

For NEWS_GRAPHICS with no face, never claim face detection. Instead apply precise camera-style motion to **verified number/graphic groups**, protecting the safe-zone title, source qualifier and CTA from cropping. Do not animate decorative zooms just to fill time.

## 5. CHỮ VÀ THIẾT KẾ — mandatory, with data integrity

**Primary animated callouts:** show only **2–4 keywords** or one meaningful metric at a time, timed to the narration. Prefer short keyword highlights, avoid duplicating a full paragraph of voice on screen. A complete SRT/transcript can still be generated for accessibility/offline correction; distinguish it from burn-in keyword animation. Do not remove context/units, session qualifier or source attribution needed for investment-data honesty simply to comply with the 2–4-word callout aesthetic.

Typography: Inter Bold where available/licensed (fallback capable of Vietnamese accents), roughly 68 px for wide 1080 frames **only when legible in the specific layout**; apply subtle shadow, place lower-middle of readable content but **never over a face, a key number, the CTA or Reels UI**. Active keyword color \`#365daa\` with adequate contrast (e.g., as a highlighted background with white label); white, navy \`#1c2c58\`, blue \`#365daa\` for scene accents. Preserve already approved KCI logo/brand treatments where a global palette replacement would be a substantive redesign. Soft-corner information cards, coherent \`expo-out\` animations, ~80 ms fade-in, **no bounce**.

**Platform-safe zone:** at minimum leave top 220 px, bottom 420 px, right 140 px free of critical elements; these numbers are a floor, **not a downgrade** of the stricter active KCI Reels layout. The screenshot-reviewed current template generally reserves **top 264 px / bottom 480 px**; its main charts/headlines use the full middle width and its lower CTA/captions additionally reserve the right interaction rail (see \`QC.md\` D1). Use whichever restriction is safer on each element. Avoid uniformly narrowing the entire graphic into a small box.

## 6. BẢN ĐỒ HIỆU ỨNG — mandatory

Before render, create \`effects-map.md\` (or machine-readable equivalent) with each **actual** effect: scene, exact spoken word/phrase, verified audio timestamp/frame, visual trigger frame, visual name and evidence. Target onset **within 2 frames** of the matching word **only when reliable word-level timing exists**. Whisper timestamps can be a starting point but must be checked/audited against audio; pure proportional word-count subtitle times DO NOT establish two-frame precision. If word timing is missing, use honest scene-level timing or mark exact sync \`NOT_VERIFIED\` and **do not claim the 2-frame requirement passed**.

Event-driven mappings, only where grounded:
- Spoken market number → that exact number/counter, **never animate an unknown intraday series**.
- Named company/product/app → verified label, official mark only if permitted, or illustrative interface explicitly labeled.
- Spoken step → \`Bước 1/2/3\` badge, not if the narration has no steps.
- Verified "trước/sau" → factual, like-for-like comparison; graded/raw before/after only if original footage exists; never construct a fictitious financial before/after.
- "zoom", "chỉnh màu", "motion", "phụ đề" → show the matching effect only when the video actually teaches that operation.
- Filmed speaker looks off-screen → use approved cutaway/graphic until look returns; N/A on TTS-only content.
- Closing CTA comment/save/follow → animated short words + matching icon, within Reels-safe region. Loop-end should visually relate to opening when editorially suitable and without creating an artificial factual continuity.

Aim for **one meaningful change every 2–4 seconds** (cut, reframing or data graphic), with a varied pace. Do not stack **two high-salience foreground effects** on a single moment. Subtle independent background grid motion is not counted as a competing headline effect. Prioritize clarity over effect quantity.

## 7. HOOK 3 GIÂY ĐẦU — mandatory

Frame zero shows a strong actual financial fact, close-up when a real speaker exists, or a large data-driven graphic. Do not begin with an idle wide/static card or a logo-only title. Within 0–3 s, introduce a new **meaningful** change about every 1–1.5 s, without conflicting overlays. The hook must be legible with sound off during the **first second**; verify spelling and contrast on a mobile-sized render. The factual promise must be explained by the video. No clickbait, guaranteed returns or invented movement.

## 8. ÂM THANH — mandatory, measure not assume

Use approved Vbee **Anh Khôi Tin tức** for NEW KCI episodes, never eSpeak/English fallback. Apply only needed noise reduction and a gentle 80 Hz high-pass and compression to real voice captures/recordings; **don't aggressively reprocess clean Vbee audio**. Target delivered integrated loudness approximately **−14 LUFS** and true peak **≤ −1 dBTP**, but claim a pass only if a real loudness/true-peak measurement and, when necessary, correction were performed. If absent, state \`NOT_MEASURED\` rather than inventing LUFS/peak.

If music is licensed and actually included, it should sit roughly **18–22 dB below spoken voice**, duck during speech and end cleanly with final words. Add SFX only at deliberate effect-map events/small zooms; keep subtle, don't create a meme-like mix, and ensure licensing. Check actual final H.264/AAC playback for clicks/cut phonemes, missing words, ducking, incorrect company pronunciation, audio continuity and CTA spoken **exactly once**.

## 9. PREVIEW → QC → FINAL — mandatory two-stage approval gate

1. Produce a **review MP4** with the existing GitHub Actions/Remotion pipeline plus representative stills for the beginning, every major effect beat, mid-scene and closing CTA. Label status \`PREVIEW / REVIEW_REQUIRED / CHỜ DUYỆT\`. A working preview MP4 can be encoded in H.264/AAC and distributed privately for review; it is **NOT** a public post or approved final.
2. Audit: effects trigger at the spoken terms when word timing is actually available, safe zone with current Instagram UI, captions/callouts don't cover faces or values, no clipped Vietnamese or black frames, clean edits/audio, faithful sourced financial facts, no fake time series/footage and CTA visual+spoken matching. If the check fails, document and correct the specific problem, reusing audio when the script is unchanged. Do not re-bill Vbee on motion-only changes.
3. **Send preview to the owner before claiming final approval.** Never auto-publish or label the review MP4 as a signed-off \`final.mp4\`. Owner approval (or an unambiguous explicit instruction to finalize a specific preview) unlocks the final export. Production automation may generate previews daily independently; it should NOT wait to create tomorrow's preview for today's approval.
4. After approval, target \`output/final.mp4\` if supported by the current renderer; the actual existing project may instead save \`out/<job-id>.mp4\`. **Don't invent paths or claim \`output/final.mp4\` exists when the exporter has not created it.** Final standard: 1080×1920; retain actual original footage FPS when technically feasible, while graphics-only KCI composition continues its established 30 fps; H.264 target around 18 Mbps and AAC target 320 kbps when the encoding settings have been implemented and measured. Never state bitrate was met without ffprobe.
5. Deliver measured **raw footage duration, finished duration, count of excluded takes and number/total length of removed silences**. If no raw footage, explicitly report \`raw footage: N/A\`, \`excluded takes: N/A (Vbee)\`, \`silences removed: 0 / not measured\` as appropriate — **never manufacture impressive statistics**. Include selected take rationale if there were genuine takes, effect map, quality notes, artifact/run link, and remaining user sign-off.
6. Log the actual preview/run ID, review status and final approval in existing KCI News Sheet (stable articleId), without overwriting owner-edited caption, approval/posted fields. The completion watcher should announce a **verified preview ready for review** and only announce an approved final after the final exists, avoiding duplicate run notices. No new schedule or public upload is authorized by this requirement.

## Implementation and quality-truth matrix

| Item | Current stock Vbee/Remotion automation | Required evidence before claiming full implementation |
|---|---|---|
| News source/CTA and narrated MP4 | Implemented in existing workflow | Source ledger, actual MP4 and audio stream |
| Strong hook and data-driven visuals | Partially implemented; inspect per-video | Frame-0/1/3 second stills and QC |
| Word-level Whisper/forced alignment | **Not established** by existing approx. word-length captions | Tool output with per-word timestamps checked against voice |
| Word-synchronous effects (±2 frames) | **Not automatically guaranteed** | effects-map plus measured sync check |
| Selected human takes, skin grade, eye zoom | **N/A** without human/raw footage | Real source clips, \`takes.md\`, waveform/face/grading QC |
| −14 LUFS, −1 dBTP, 18Mbps/320kbps | Targets, not guaranteed current encoder output | Loudness/true-peak scan and ffprobe |
| Preview before final | Existing output is review-only by policy | Owner receives artifact and approves a specific cut; final export separately verified |

**Rule of evidence:** updating skill text/instructions or scheduled-task prompts is an editorial/QC policy change. It is NOT proof a renderer was modified, a new effect ran, Whisper was executed, a final video was produced, or notification delivery occurred. Report gaps openly.
