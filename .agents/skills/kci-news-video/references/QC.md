# KCI editorial and video quality gates

**All these checks are release gates, not just a score.** Failure yields `REVIEW_REQUIRED` or `BLOCKED`, never `READY_TO_PUBLISH`.

## A. Newsroom and fact checks
- [ ] Every quantitative headline/statement has specific HTTPS evidence in sourceLedger and sourceIds in the scene.
- [ ] Market session and instrument match: KRX main close versus intraday, US last complete session versus open/futures, KOSPI versus NXT, USD/KRW spot versus fix, interest rate versus yield.
- [ ] Date of source, event and observation date/time are explicit; KST data cutoff displayed; archival data never misrepresented as live.
- [ ] Numbers in voice, overlays, ticker and source article agree; never fabricate missing candle/time series.
- [ ] Korean equity effect is labeled interpretation when appropriate; a price swing is not automatically thesis weakening/strengthening.
- [ ] Company and sector/ticker names are correct; speculative judgments are not masquerading as official disclosures.

## B. Hook and engagement
- [ ] Three hook candidates considered; chosen hook verified and answered by video.
- [ ] First three seconds convey a relevant hook, no bait-and-switch or promise of extraordinary return.
- [ ] Video maintains a clear editorial lead and sensible transitions; digest editions may contain distinct stories without inventing a causal link.
- [ ] CTA follows the informative substance; one meaningful ask, not multiple competing commands.
- [ ] Spoken CTA and screen CTA match; neutral question for comment (not personalized portfolio advice); follow request offers a reason.
- [ ] CTA overlay sits within mobile safe area, does not cover or fight with the captions.

## C. Voice / audio
- [ ] New narration uses Vbee Anh Khôi Tin tức (code `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`), selected by the owner on 26 October 2026; no eSpeak / generic English voice. Read [VOICE_PROFILE.md](VOICE_PROFILE.md). Verify actual job/run voice evidence and the short-trial/listening gate; a configuration change alone is not successful synthesis or listening approval.
- [ ] Historical/in-flight artifacts retain their actual original voice. Do not relabel old Tuấn Anh News audio as Anh Khôi, fail historical output merely because the default changed, or regenerate paid narration without authorization.
- [ ] All scenes have audible audio, no missing/cut sentence, sudden clipping, or duplicated outro CTA.
- [ ] Correct pronunciation of KOSPI, SK hynix, BOK, USD/KRW, won, dates, percentages and intraday high.
- [ ] Background music legally usable and well below spoken volume. Correct final integrated loudness if an audio processing pass was done.
- [ ] Voice length drives scene duration. MP4 has real AAC stream and decodable packets.
- [ ] Layout-only revisions retain the existing approved voice/timing. Do not call Vbee again unless the spoken script changes or the owner explicitly requests replacing that clip's voice.

## D. Motion graphics and typography
- [ ] 1080×1920, 30 fps, readable font with Vietnamese diacritics; no clipped letters, overlap or extreme density.
- [ ] Differentiated scene layouts: animated facts, data cards/charts and transitions. Not identical slides. A bottom ticker is NOT required for Reels.
- [ ] All graphics reference this episode's data. Historical V2 hardcoded 23/10 values never appear in a current edition.
- [ ] Scale/axis/unit labels consistent. Distinct open/low/close points are NOT connected into a false intraday curve.
- [ ] Visual assets original/licensed; generative footage clearly illustrative, no fake official footage.
- [ ] Inspect multiple extracted frames and listen beginning/middle/outro, including CTA; report the actual inspection scope.

### D1. Full-width middle layout — revised owner feedback, 24 October 2026

The owner's first screenshot showed app/status controls over the old top branding/date, and account/description controls over the bottom subtitle/source/ticker. The initial fix was too narrow. The owner then requested use of the WHOLE MIDDLE AREA rather than boxing everything into a small central block. This revision supersedes the former x96–884 global safe column.

The production composition ID remains `KciNewsDaily`; `src/Root.tsx` routes it to `KciNewsReels` in `src/KciNewsReels.tsx`. The old `KciNewsDaily.tsx`, `KciNewsV2` and `KciNews` remain archival references. This visual change applies to KR_NEWS and MACRO. It does NOT change independent schedules, story quotas, data, narration, source requirements or publication permission.

Internal profile on 1080×1920:
- Main content: x56–1024 (width968). Branding starts y268; headline/summary and visuals use the wide middle down to y1192. No narrow outer card or global right-side blank strip.
- Lower overlays only: x56–914 (width858), preserving166px on the right for the lower action rail. Captions y1220–1332; sources y1347–1395; disclaimer ends by y1440.
- Top264px and bottom480px stay free of essential content. Background decoration may fill the canvas.

These are KCI's design choices based on the supplied screenshot and owner feedback, NOT official Meta specifications or guarantees across devices, app versions, expanded descriptions or open comment panels. Check the actual positions of the action rail; if it overlaps a lower visual label, move that label locally rather than narrowing the entire scene again.

- [ ] Main title, summary, numbers and charts use the full middle width with modest equal side margins. Never uniformly stretch typography or scale the old narrow video as a substitute for re-layout.
- [ ] Prefer open news graphics, large numbers, columns and thin rules. Remove redundant rounded outer chart panels and excessive nested cards. Background remains edge-to-edge.
- [ ] Compact masthead and date remain below the top control zone. New title sizes are meaningful, normally65px, not reduced to fit a small central box.
- [ ] Captions normally use no more than2 lines, above account/description overlays. Check every cue. Lower subtitle/source clearance must not become a global width restriction for the main content.
- [ ] Source/time/venue context and the disclaimer remain readable. Full URLs stay in the ledger; no ellipsis hiding essential labels.
- [ ] Closing CTA stays in the visual band, above captions, using a separator rather than a rounded card. Preserve the once-only spoken CTA.
- [ ] Check all text and animation entry/end states against simulated top/bottom/local-right controls, not only settled positions. Do not claim a real-device Facebook test unless performed.
- [ ] Omit the redundant bottom ticker. Keep its meaningful facts in graphics/voice/ledger rather than erasing sources or disclaimer.
- [ ] Normally limit to3 comparison bars,3 generic stat cards,3 closing bullets and2 company callouts. Two generic facts may sit side by side to use the middle width. Never silently discard extra facts; re-edit/split instead.
- [ ] Check company names and numerical labels for overflow after widening/enlarging. Long data must be reflowed, not cut off. Decorative circles may be clipped to their own visual region; meaningful text may not.
- [ ] Inspect opening, reversal, company, generic and closing/CTA frames at mobile display scale; measure text bounding boxes and scroll overflow. Check geometry for every caption and important motion phase.

A layout-only re-edit of archived news retains the original market/report date. It is not a freshly verified daily bulletin. Disclose whether validation used a browser DOM preview versus a complete Remotion/GitHub Actions runtime. A successful TSX transpile is a syntax check, not a dependency-aware typecheck. Stream-copying and matching audio hashes verifies unchanged audio, not a new pronunciation or listening review.

## D2. Facebook/Instagram caption QA — owner update 26 October 2026
- [ ] Caption is short (aim 30–65 Vietnamese words before hashtags), natural, approachable and readable to Vietnamese retail-investor audiences; no generic AI phrasing, inflated promises or excessive emoji.
- [ ] Opening/takeaway is tied to the actual verified event; no false market timestamp or overconfident investment recommendation.
- [ ] Use 3–5 genuine topic-specific discovery hashtags. Check trend evidence near publishing when accessible; if trend status is unavailable, never claim the tags are verified trending.
- [ ] At most one light CTA, avoid recycling stock copy and do not repeat the whole voiceover. Plain Facebook/Instagram text has no Markdown bold.
- [ ] In KCI News Sheet, preserve caption cells the owner edited; update only when blank or revision is expressly authorized.

## E. Subtitle and technical artifact
- [ ] Captions are synchronized to natural speech, clean punctuation, <=2 lines when feasible and above Reels UI safe zone.
- [ ] If alignment is estimated, flag and correct before final publishing; no misleading perfect-sync claim.
- [ ] MP4 H.264/AAC plays; no black frame, missing last frame, timestamp overlap or stretched footage.
- [ ] Retained job/source ledger, voice segments when permitted, MP4, preview frames and QC report.
- [ ] Owner has explicitly approved this cut for publication; scheduling without approval is forbidden.

## Internal performance loop (after publication, only with observed data)
Track 3-second view retention, average watch duration, percentage completed, comments per1000views, follows per1000views, and saves. Compare hook style and CTA kind on similar-topic cohorts. Do not invent metrics or attribute a good week to an untested hook.

## Suggested reporting
`Editorial: PASS/FAIL | Hook: PASS/FAIL | CTA: PASS/FAIL | Voice: PASS/FAIL | Motion: PASS/FAIL | Safe area: PASS/FAIL | Subtitle: PASS/FAIL | Render: PASS/FAIL | Release: REVIEW_REQUIRED / READY_TO_PUBLISH`, with the actual test method, scope and one-line reason for each failure.
