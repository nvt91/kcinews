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
- [ ] Video maintains one editorial thread and sensible causal sequence.
- [ ] CTA follows the informative substance; one meaningful ask, not multiple competing commands.
- [ ] Spoken CTA and screen CTA match; neutral question for comment (not personalized portfolio advice); follow request offers a reason.
- [ ] CTA overlay sits within mobile safe area, does not cover or fight with the captions.

## C. Voice / audio
- [ ] Vbee Tuấn Anh News (code `n_hanoi_male_tuananhnews_news_vc`), no eSpeak / generic English voice.
- [ ] All scenes have audible audio, no missing/cut sentence, sudden clipping, or duplicated outro CTA.
- [ ] Correct pronunciation of KOSPI, SK hynix, BOK, USD/KRW, won, dates, percentages and "intraday high".
- [ ] Background music legally usable and well below spoken volume. Correct final integrated loudness if an audio processing pass was done.
- [ ] Voice length drives scene duration. MP4 has real AAC stream and decodable packets.

## D. Motion graphics and typography
- [ ] 1080×1920, 30 fps, readable font with Vietnamese diacritics; no clipped letters, overlap or extreme density.
- [ ] V2.1-style differentiated scene layouts: animated facts, data cards/charts, finance ticker and dynamic transition. Not seven identical slides.
- [ ] All graphics reference this episode's data. Historical V2 hardcoded 23/10 values never appear in a current edition.
- [ ] Scale/axis/unit labels consistent. Distinct open/low/close points are NOT connected into a false intraday curve.
- [ ] Visual assets original/licensed; generative footage clearly illustrative, no fake official footage.
- [ ] Inspect multiple extracted frames and listen beginning/middle/outro, including CTA.

## E. Subtitle and technical artifact
- [ ] Captions are synchronized to natural speech, clean punctuation, <=2 lines when feasible and above Reels UI safe zone.
- [ ] If alignment is estimated, flag and correct before final publishing; no misleading "perfect sync" claim.
- [ ] MP4 H.264/AAC plays; no black frame, missing last frame, timestamp overlap or stretched footage.
- [ ] Retained job/source ledger, voice segments when permitted, MP4, preview frames and QC report.
- [ ] Owner has explicitly approved this cut for publication; scheduling without approval is forbidden.

## Internal performance loop (after publication, only with observed data)
Track 3-second view retention, average watch duration, percentage completed, comments per 1000 views, follows per 1000 views, and saves. Compare hook style and CTA kind on similar-topic cohorts. Do not invent metrics or attribute a good week to an untested hook.

## Suggested reporting
`Editorial: PASS/FAIL | Hook: PASS/FAIL | CTA: PASS/FAIL | Voice: PASS/FAIL | Motion: PASS/FAIL | Subtitle: PASS/FAIL | Render: PASS/FAIL | Release: REVIEW_REQUIRED / READY_TO_PUBLISH`, with 1-line reason for each failure.
