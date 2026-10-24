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
- [ ] Vbee Tuấn Anh News (code `n_hanoi_male_tuananhnews_news_vc`), no eSpeak / generic English voice.
- [ ] All scenes have audible audio, no missing/cut sentence, sudden clipping, or duplicated outro CTA.
- [ ] Correct pronunciation of KOSPI, SK hynix, BOK, USD/KRW, won, dates, percentages and intraday high.
- [ ] Background music legally usable and well below spoken volume. Correct final integrated loudness if an audio processing pass was done.
- [ ] Voice length drives scene duration. MP4 has real AAC stream and decodable packets.
- [ ] Layout-only revisions retain the existing approved voice/timing. Do not call Vbee again unless the spoken script changes.

## D. Motion graphics and typography
- [ ] 1080×1920, 30 fps, readable font with Vietnamese diacritics; no clipped letters, overlap or extreme density.
- [ ] Differentiated scene layouts: animated facts, data cards/charts and transitions. Not identical slides. A bottom ticker is NOT required for Reels.
- [ ] All graphics reference this episode's data. Historical V2 hardcoded 23/10 values never appear in a current edition.
- [ ] Scale/axis/unit labels consistent. Distinct open/low/close points are NOT connected into a false intraday curve.
- [ ] Visual assets original/licensed; generative footage clearly illustrative, no fake official footage.
- [ ] Inspect multiple extracted frames and listen beginning/middle/outro, including CTA; report the actual inspection scope.

### D1. Reels-safe central layout — owner feedback, 24 October 2026

The owner's screenshot shows the app/status controls covering the old top branding/date, while account/caption controls cover the bottom subtitle/source/ticker. The right-side action rail is also reserved. Correct the composition, not just the export resolution or a uniform downscale of the entire frame.

The production composition ID remains `KciNewsDaily`; `src/Root.tsx` now routes it to `KciNewsReels` in `src/KciNewsReels.tsx`. The old `KciNewsDaily.tsx`, `KciNewsV2` and `KciNews` remain archival references, not the safe template for new mobile editions. This presentation change applies to both KR_NEWS and MACRO. It does NOT change their independent schedules, story quotas, source requirements, narration or publication permissions.

Internal conservative profile on 1080×1920: left margin96px, right margin196px, top264px, bottom480px. Essential content occupies x96–884, y264–1440. These coordinates are KCI's design choice based on the supplied screenshot, NOT a claimed official Meta specification or a guarantee across devices, app versions, expanded descriptions or open comment panels.

- [ ] Compact masthead and edition date are below the top control zone; not at the canvas edge.
- [ ] Headline, summary and chart occupy the central block. Keep meaningful font sizes; shorten copy or split a scene rather than shrink everything.
- [ ] Captions occupy y1220–1332, normally <=2 lines, above account/description overlays. Check every cue, not only the opening frame.
- [ ] Sources occupy y1347–1395 and disclaimer ends by y1440. Keep source/time/venue context visible; full URLs stay in the source ledger. Do not clip required labels with ellipsis.
- [ ] Closing CTA remains inside the central visual block and ends above captions. Preserve the once-only spoken CTA.
- [ ] No essential text, numerical label or logo is placed in the right action rail. All motion entrance/end states are checked, not just settled positions.
- [ ] The Reels cut omits the redundant bottom finance ticker. Its meaningful facts remain in scene graphics/voice/ledger; do not erase the source or disclaimer to save room.
- [ ] Keep scenes concise: normally <=3 comparison bars, <=3 generic stat cards, <=3 closing bullets, <=2 company callouts. Do not silently discard extra facts; re-edit/split and validate the scene when needed.
- [ ] Inspect headline, reversal, company, generic and closing/CTA frames with simulated top/bottom/right UI masks, then review a real-device preview when available. Mark simulation as simulation; don't claim an actual Facebook preview test unless performed.
- [ ] Check text bounding boxes and scroll overflow; check at mobile display scale. If app chrome changes, revise the shared safe profile rather than moving one episode ad hoc.

A layout-only re-edit of archived news must retain its original market/report date. It is not a new fact-checked daily bulletin. Disclose if validation used a browser DOM preview rather than the complete Remotion/GitHub Actions runtime.

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
