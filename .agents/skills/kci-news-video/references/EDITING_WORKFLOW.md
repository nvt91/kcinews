# KCI — Nine-stage editing workflow and preview approval

Owner request: 26 October 2026. Profile ID: `KCI_EDIT_20261026_V1`.

## Owner override — render full MP4 BEFORE approval, all KCI streams (27 October 2026)

For EVERY scheduled KCI video (KR_AM, KR_MID when news gate passes, KR_CLOSE, MACRO21, GLOBAL_US/US_AM), the owner wants **one fully rendered, watchable and audible MP4 before any review request**. The previous two-step approval of a preview before an additional identical final render is **superseded**. Proceed with fact-checking, Vietnamese Anh Khôi narration, motion graphics, hook, CTA, encoded MP4 and actual file QC, then send that completed render to the owner for **one video-level decision** (approve for publication, request changes, or reject). Filename `output/preview.mp4` is acceptable for a full-quality review copy; `output/final.mp4` is optional only if a separate artifact is actually needed and created. **Render complete ≠ approved/published.** User approval governs publication, not starting or completing the MP4 render. No automatic publishing.

This instruction supersedes any contrary legacy paragraph later in this file. Do not halt the whole production merely because an optional advanced editor feature (exact ±2-frame synchronization, face tracking without footage, true-peak meter, etc.) is not yet implemented. Produce a truthful best-available voiced MP4 when feasible; annotate remaining QA `NOT_VERIFIED` or `MP4 — CẦN RÀ SOÁT` without fabricating a PASS. Stop only for truly blocking issues (unverified/false market facts, Vbee voice failure, no audio, unplayable/broken render, serious clipping or financial misrepresentation). A material edit requires a revised rendered video for review. Sheet records actual MP4 creation timestamp, retains `CHỜ DUYỆT` and `CHƯA ĐĂNG`, and never interprets approvals as commands to post.

This is the owner's editing specification and an execution/acceptance contract, NOT proof that Whisper, face tracking or rendering modules have been installed or tested. Read this after SKILL.md, DAILY_CADENCE.md, PRODUCTION.md, QC.md, VOICE_PROFILE.md and SHEET_TRACKING.md. It overrides older conflicting editing defaults for NEW work: full-sentence burned-in captions, former colors/safe-zone dimensions, word-count-only timing accepted as finished, automatic final export, and audio/export targets. It does not change any schedule, timezone, news quota, independent stream, source verification, voice selection, caption-copy preference, secret or publishing permission. Historical/in-flight assets retain their actual provenance and must not be regenerated just for this migration.

## Applicability and capability gate

- `recorded_takes`: actual user-authorized camera/audio clips with retakes. Apply all relevant steps, including take selection, waveform editing, color matching and eye-centered reframing.
- `tts_motion`: source-verified KCI narration using Vbee Anh Khôi Tin tức (`n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`) plus Remotion. Align the actual generated audio; no imaginary retakes, faces, skin correction or glances. These operations are N/A, not successfully performed. Preserve original generated audio and reuse it for visual-only edits. Never synthesize multiple paid takes just to simulate camera retakes.
- `hybrid`: apply the appropriate branch per real segment. Retain footage speaker audio unless replacement was authorized. Do not assume a generated face or news image is real source footage.
- Before paid synthesis/render, inspect the current runner and available tools for word-level timing, waveform review, safe-zone/theme support, per-beat cues and preview-only output. Run the applicable work when supported. Missing capabilities must be recorded as `NOT_VERIFIED`, `TIMING_UNVERIFIED` or `QC CẦN RÀ SOÁT` without silently claiming PASS. Continue to render and deliver a real voiced MP4 if the deficits do not jeopardize factual correctness, actual audio presence or playable video. Truly blocking failures are `BLOCKED_PIPELINE`; an incomplete silent layout demonstration does not satisfy the owner's rendered-video request.
- Snapshot actually inspected on 26 October: `scripts/run-job.mjs` blob `5cb7feb0610a392a5d678324271f0a25248fb350` uses fixed FPS30, proportional seven-word caption groups, and validate/preview/voice-test/video modes; the preview mode does not synthesize voice. It does not implement this complete nine-stage contract. `.github/workflows/kci-video.yml` blob `d942e28940cf8e07d98d5556794dd4cc9ad5062c` invokes that runner. Re-read live code before execution. Documentation and a successful legacy run do not establish compliance.
- An existing full-video render path may be used when it yields a real narrated H.264/AAC MP4. Do not pretend proportional word timing equals measured alignment; disclose such precision gaps clearly, fix critical errors when possible, and never mislabel a silent/corrupt MP4 complete. Do not change API credentials, install an unapproved paid service or upload private raw footage to an unapproved destination. If there is a genuine factual/audio/render blocker, preserve prepared material and report its exact cause.

## 1. CHỌN TAKE TỐT NHẤT

Run Whisper on EACH real source clip/audio segment, requesting word timestamps and recording engine/model/version/settings and original filename. Match each script sentence with every occurrence, including incomplete/repeated attempts. Prefer the LAST complete take, unless it clearly contains a stumble, swallowed word or loss of energy; then choose the next-best complete take and explain the exception. Do not infer delivery quality from text alone: listen to the candidates.

Save `takes.md`: sentence ID/text; every candidate's clip ID, source start/end timestamps and completeness; selected take and range; reason; rejected candidates; review method and limitations. Preserve originals. Whisper text is a timing aid, not permission to alter verified financial figures, negation, dates or the speaker's meaning. Reconcile recognition errors against actual audio and the approved script.

For TTS, transcribe/align each actual narration clip, but record take selection as N/A when there were no repeated takes. Report zero rejected takes only if the inventory establishes zero; otherwise N/A or unknown. No fabricated take log.

## 2. CẮT GỌN

Assemble selected takes in script order. Detect every silence longer than 0.15 seconds, between-phrase breaths, 'ờ/ừm' fillers and repeated speech; remove the excess while protecting actual words. Set cuts using the waveform and listening, NOT Whisper timestamps alone. Never cut a syllable/word; retain TWO frames of handles on each side of kept speech at the project's actual FPS and apply a very short audio fade to avoid clicks. If 0.15-second trimming conflicts with word/handle protection, preserve the word and document that specific exception rather than silently changing the threshold or mutilating speech. Silence detection is a candidate list, not a destructive blanket filter on quiet consonants.

Save an edit decision list with source/output ranges, detected/removed silence durations, breath/filler/repeat removals and protected exceptions. Keep A/V in sync, with no invented duplicate frames or arbitrary speed-up. Recompute/remap word timings AFTER edits; verify them on the edited audio. Duration targets must be achieved through editorial selection, not rushed narration or removal of meaningful words.

## 3. CHỈNH MÀU

For actual footage: a restrained cinematic grade — gentle S-curve contrast, natural slightly warm skin, subtly warm highlights and cool shadows, slightly reduced saturation, soft vignette. Match exposure and white balance between selected takes so a cut does not flash. Do not apply a skin/footage grade to charts, source screenshots or brand colors.

Keep a clearly named ungraded version using the SAME selected takes/edit/timing, alongside the graded version for before/after. This is an editing demonstration, not an invented historical/news before-after. TTS-only motion with no live footage: color grading and skin/exposure matching are N/A; use the graphic palette in step5.

## 4. ZOOM

Detect/track face and eye positions on real footage; center reframing around the eyes, smoothing movement. Do not identify the person or invent tracking results. Alternate wide100% and close120% at jump cuts; for 1080p footage the higher-priority sharpness cap is115%, so use100%/115%. Check effective cropped resolution rather than assuming a 4K source guarantees unlimited zoom.

Emphasis push-in:0.4seconds, ease-in-out, no shake or overshoot/bounce. This is the SPECIFIC exception to the general expo-out motion rule in step5. Verify crop and text/face clearance throughout the movement. When face tracking is unreliable, use a visually verified/manual anchor and disclose it; never claim automated eye tracking passed. Graphics-only videos use a purposeful graphic emphasis instead of an imaginary face zoom. Do not zoom data labels off-screen.

## 5. CHỮ VÀ THIẾT KẾ

Burn in KEYWORDS and numbers only,2–4 words per cue, synchronized to the spoken words. Do not display full-sentence rolling subtitles. Retain a full corrected transcript/optional sidecar subtitles for accessibility and review, separate from the keyword layer. Financial units, plus/minus signs, dates, 'ước tính', source and session qualifiers remain mandatory where their removal would mislead; place these as compact contextual labels, not a full spoken-sentence subtitle or an isolated misleading number.

Font Inter Bold, approximately68px at1080px width; light shadow; lower-middle placement, never over a face. Reflow a long proper name/number into readable cues instead of clipping or silently abbreviating it. Do not distribute font binaries with deliverables. Highlight the spoken keyword with blue `#365daa`; fade-in80ms, no bounce. Quantize milliseconds to actual frames and record the realized duration where relevant.

Palette: white, navy `#1c2c58`, blue `#365daa`. General motion uses expo-out with consistent parameters; the0.4s camera push-in retains the explicit ease-in-out exception. Graphic cards have rounded corners, but do not wrap the whole canvas into a cramped central card.

Owner safe zone at1080x1920: no meaningful text/number/logo/CTA/source within TOP220px, BOTTOM420px or RIGHT140px. Thus essential bounding boxes stay at y>=220,y<=1500,x<=940; keep a modest left inset, normally56px. Background decoration/footage may fill the frame. This REPLACES older top264/bottom480/full-width-right1024 defaults for new work; it is an owner profile, not a claimed official universal platform specification. Use the available middle width rather than shrinking the whole video. Check animation entry/exit positions and real/simulated UI overlays. Wider app overlays must not be ignored.

## 6. BẢN ĐỒ HIỆU ỨNG

Save `effects-map.md` (or machine-readable JSON plus the readable table): beat ID, exact trigger word/token, original audio reference, edited word-onset time, output trigger frame, first visible effect frame, measured deltaFrames, effect/duration, source claim IDs, text bounds and QC evidence. For EVERY mapped effect, absolute onset error <=TWO frames relative to the corresponding spoken word. At30fps this acceptance window is2/30seconds. Whisper timestamps are not proof that this target was met; verify audio/waveform and adjacent rendered frames, correct alignment, record unresolved uncertainty.

Mappings:
- Spoken number -> exact number or count-up. A count-up is presentation animation, not a false price/time series; preserve signs/units and the verified terminal value.
- Tool/app/product name -> correct name card or sourced/authorized illustrative interface; no fabricated official screen.
- Procedural step -> 'Bước1/2/3…' label, only when the script actually describes a procedure, not to reframe ordinary news as instructions.
- 'Trước/sau' or 'thay đổi' -> matched ungraded/graded footage when referring to the edit. In a financial story use only genuinely sourced before/after observations and retain dates; never substitute a color-grade demo for evidence of economic change.
- 'Zoom/phụ đề/chỉnh màu/motion' -> the matching effect at that utterance, when the story actually concerns that effect.
- A real presenter's glance toward a screen -> full-frame graphic cover from the first verified look-away frame through return-to-camera. Do not infer intent from eye geometry alone or fake a glance interval; manually verify ambiguous ranges. Essential labels remain in the safe zone.
- Final CTA -> large animated words and corresponding icon, spoken once. Do not stack separate comment/save/follow demands. Hold CTA long enough to read, then return visually to the first frame for a seamless loop without replaying narration or cutting the final word.

Change ONE thing every2–4seconds between beats: cut, zoom OR graphic. Never overlap two independent attention-grabbing effects. Synchronized parts of a single cue (its text/icon/highlight) count as one designed effect; do not add concurrent SFX/camera motion merely to fill a quota. If exact word onset and an anti-overlap rule conflict, simplify/replan the beat rather than drifting the cue beyond2frames or speeding speech. Keep every statistic truthful and readable.

## 7. HOOK 3 GIÂY ĐẦU

Frame0 must be strong: a close punch-in on real footage OR a large truthful graphic. No static wide shot or logo-only opening. In seconds0–3 change one visual element every1–1.5seconds, while retaining readability and the one-effect rule. The hook text must be readable muted within the FIRST second. Its2–4-word cards may be sequential; never omit a qualifier in a way that turns an estimate into fact. Retain three scored truthful hook candidates and the chosen explanation. A visual loop must not hide the actual news/reporting date.

## 8. ÂM THANH

Light denoising when needed, high-pass80Hz and gentle compression. Avoid overprocessing clean TTS or clipping speech transients; report the actual applied chain/bypass reason. MASTER target:-14LUFS integrated; true-peak ceiling:-1dBTP. Measure and retain before/after loudness and true-peak on the encoded output, not just the intended filter settings. A level target is not an achieved measurement.

Optional legally usable music:18–22dB below voice, duck during speech, end cleanly at the final word. Do not invent music or a mixing measurement when none is used. SFX only at selected mapped beats and a few zooms, restrained/non-meme-like; the animation exclusivity rule still applies. Inspect/listen for clicks, pops, abrupt joins, harsh noise reduction and duplicated CTA. Preserve the original voice before processing; a visual-only revision does not authorize paid resynthesis.

## 9. RENDER MP4 ĐẦY ĐỦ → KIỂM TRA → ANH CHỈ DUYỆT VIDEO

**From 27 October 2026 for all KCI streams:** the scheduled producer must complete an actual narrated video MP4 at review-worthy/full output resolution before asking the owner to approve anything. Prepare the effect map and stills, run the available audio/render path, then inspect actual opening 0–3s, critical financial graphics, mid-scene, CTA and final frames. Verify a playable H.264/AAC stream with Vbee Anh Khôi audio, correct source/date qualifiers and no material black frames, cut words, pop/click or unreadable critical values. Whenever a stage cannot be verified (word-accurate Whisper, ±2-frame trigger, loudness, exact bitrate), report it honestly in the QC sheet and do not claim that engineering work happened. Reuse existing audio for visual-only corrections to avoid unnecessary Vbee synthesis.

**User interaction is one stage, after rendering:** hand over the rendered MP4 with accurate link, script/source ledger, caption and actual QC metrics, labeled `MP4 ĐÃ RENDER — CHỜ ANH DUYỆT — CHƯA ĐĂNG`. The owner watches the MP4 and either approves publication, requests fixes, or rejects the cut. Do not require them to approve a separate storyboard, silent preview or prior intermediate encode. If changes are requested, render a corrected MP4 and send that for review. If the submitted full video cut is approved unchanged, do not render a redundant identical “final” solely to change its filename. Explicit publication is a separate permitted action and must use a connected publishing tool and user permission; never auto-post from a scheduled production run.

**Encoding/QC targets:** 1080×1920, H.264 around 18Mbps, AAC320kbps when implemented; pure Remotion/TTS 30fps, camera footage rational source FPS when verified. Master targets −14LUFS/≤−1dBTP only count as achieved after real measurement. `output/preview.mp4` or `out/<job-id>.mp4` is acceptable as the actual reviewed full-quality MP4; `output/final.mp4` is optional and exists only after a real render/verified copy with proper encoding and metadata. Filename cannot substitute for review/approval evidence. Do not alter financial facts or timestamps on a delayed publication without re-checking; substantive script changes require new narration/render and a new owner review.

If genuine production fails, state `BLOCKED` or `QA_REQUIRED` with artifact/run link and the remaining work, not “video finished.” Keep separate review notes for real and unverified QA, but do not withhold a usable complete narrated MP4 only because a cosmetic or optional advanced feature is pending.

## Evidence and real metrics

Per-episode output (within its own directory/artifact, not a shared overwritable global folder):
- `takes.md`, source inventory/transcripts and word timestamps; N/A sections clearly marked.
- Edit decision list with source/output mapping, removed silences/fillers/retakes and protected exceptions.
- `effects-map.md`/JSON with onset deltas and per-beat stills.
- Ungraded matched reference when applicable; never claim it exists when no camera footage exists.
- Actual completed voiced MP4 (file may be named `output/preview.mp4`, `out/<job-id>.mp4`, or truly produced `output/final.mp4`), with explicit `CHỜ DUYỆT` state; `approval.json` only after real owner approval and never inferred from rendering. Do not create an unnecessary identical second encode after approval.
- QC/metrics: raw source duration (state sum/all candidates versus selected source), edited preview/final duration, total/selected/rejected takes, number of silences detected/actually cut and total seconds removed, actual cut count, alignment method and unresolved words, maximum measured effect offset, FPS, loudness and true peak, measured encoded streams/bitrates, inspection scope and missing checks.
- For TTS, raw duration means the measured unedited generated audio, not an imaginary camera take. Takes/color/eye tracking are N/A when absent. Unknown values are null/NOT_MEASURED, not0. Never say all audio was listened to after metadata-only tests.

## Scheduled producers, Watch and Sheet integration

All five KCI video producers (KR_AM, optional KR_MID, KR_CLOSE, independent MACRO21 and GLOBAL_US/US_AM) read this profile on each new run; preserve current clocks, quotas, scope, job/article IDs, source/voice gates and dedup checks. Do not create an extra recurring task for this editing update. No production/paid trial is triggered just by saving these instructions.

For **all KCI streams**, after verifying the job facts and available render path, invoke a real complete MP4 build that contains approved/new Anh Khôi voice and motion graphics. Legacy `[KCI VIDEO]` may be used when it renders a playable voiced MP4; its completion does not prove advanced editing requirements, which remain measured separately. A review-quality MP4 is the desired scheduled output. Never stop merely because a separate preview-before-final workflow has not been implemented. Only a serious facts/audio/render issue blocks. Existing KCI Newsroom V3 design work is not presumed ready until actually built and checked.

Completion Watch checks and delivers each new actual MP4 to the owner for review with a real link and honest QC scope; no automatic posting and no second identical render after user approval. Retain historical dedup markers and identify run/version to avoid duplicate notifications. The watch never starts/reruns rendering or charges Vbee.

KCI Sheet Sync and producers upsert the same articleId row, preserving owner-edited title/caption, H/I/O and existing notes. For a verified rendered MP4, record C=actual video completion time KST, E=real MP4/artifact link, G=honest QC (use `MP4 — CẦN RÀ SOÁT` when some checks are pending), H=`CHỜ DUYỆT` on initial row, I=`CHƯA ĐĂNG`. Include review cut/version, measured/unverified QC and timestamp in J without overwriting the owner's comments. A video is not approved merely because C has a time or GitHub Actions says success. After actual owner publication decision, preserve the approval reference; do not auto-post or require an identical re-encode solely because the review file is named preview. Read/write/readback and conflict preservation remain mandatory.

Implementation status at adoption: requirements and automation instructions only. No assertion of a new end-to-end test, implemented Whisper/face pipeline, graded footage, sound pass, rendered preview or final. Each subsequent run must establish what was actually executed.
