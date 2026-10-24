# KCI — Four daily article/video review slots

Owner instruction: 24 October 2026. Effective for scheduled editions from 25 October 2026, Asia/Seoul.

## Scope and priority

The daily target is FOUR DISTINCT ARTICLES = FOUR DISTINCT VIDEOS, not one compilation of four articles. Each production run owns exactly one slot and produces one source-backed Vietnamese article, one adapted spoken script, and one MP4 for review. This cadence supersedes the old 3-AM + 2-PM written-only target and the separate one-video-at-21:00 cadence for these KCI automations. Do not keep those old outputs as additional daily production.

This file is an operating contract, not an executable scheduler. ChatGPT automations start the editorial work; owner-authored GitHub issues start the existing verified video workflow. Nothing here authorizes social publication, trades, account changes, secrets access, or external recipients.

Read SKILL.md, EDITORIAL_BRIEF.md, HOOK_CTA.md, PRODUCTION.md and QC.md on each scheduled execution. Preserve their source, privacy, cost and review gates.

## Four slots

| Slot | Production start in KST | Editorial scope | Article length |
| --- | --- | --- | --- |
| V01 | 08:00, existing exact schedule retained | Before the KRX main session: last completed US session, macro and Korean implications | 220–320 Vietnamese words |
| V02 | Around 12:00, flexible within one hour | One macro/industry mechanism affecting Korean stocks; not a repeat of V01 | 200–300 words |
| V03 | Around 17:00, flexible within one hour | After the KRX main session: index, breadth, flows and drivers; NXT/other after-hours data only to actual cutoff | 250–350 words |
| V04 | 21:00, existing exact schedule retained | One material company disclosure/earnings/funding/contract event, prioritizing changes since earlier slots | 180–280 words |

These times start production. They are NOT guaranteed MP4 completion times or posting times. Flexible runs can start within one hour of the stated time. Do not backdate data cutoffs to the nominal hour.

On weekends/holidays keep the same four slots but substitute clearly labeled weekly context, sector explainers, company profiles or disclosure lessons. Do not fabricate a new trading session or relabel old news. If evidence remains inadequate, mark the slot BLOCKED rather than manufacturing a fourth story. Do not automatically backfill missed slots or produce extra episodes to compensate.

## Identity and persistent handoff

Derive the actual edition date in Asia/Seoul. Each task has an explicit slot code; never guess it from a delayed run's wall clock.

- Article ID: `KCI-YYYYMMDD-V01` through `KCI-YYYYMMDD-V04`.
- Job: `jobs/kci-YYYY-MM-DD-v01.json` through `jobs/kci-YYYY-MM-DD-v04.json`.
- Article and editorial ledger: `editorial/YYYY-MM-DD/v01.md` through `editorial/YYYY-MM-DD/v04.md`.
- Issue title: `[KCI VIDEO] YYYY-MM-DD V01 <short topic>` (corresponding slot for others).
- Issue body must remain ONLY runner-compatible JSON: `{"job":"jobs/<actual-file>.json"}`. Store article linkage and event keys in job metadata/markdown, NOT extra prose in the issue body.
- Add `articleId`, `slot`, `articlePath`, `eventKeys` as metadata to schemaVersion 2 jobs; keep required fields valid and template `KciNewsDaily`.
- Event identity: company/ticker or macro topic + event type + original publication date. A new edit is not a new event.

Read accessible jobs/articles/issues from the current date and preceding seven days before choosing a topic. These repository files, not assumed shared chat memory, are the cross-run record. Reject same-event repetition unless material new information or a genuinely different explanatory angle is identified. State the actual comparison scope.

Before creating a job or trigger, check the exact date+slot path, matching issues and workflow runs. If queued/running/successful, reuse or report the existing run; do not synthesize a second voice track. A failed run must be diagnosed first; preserve audio and retry only a safe non-billable phase when possible. Never blindly rerun a paid Vbee synthesis after timeout. Read a file and its current SHA before any update; do not overwrite unrelated or approved work.

## Editorial and production gates

1. Search the web afresh; open original sources, inspect amendments, record URLs, publication date, event date, reporting period, observed session and KST cutoff. Prefer DART/KIND, KRX/NXT, company IR, BOK and other issuing agencies. Clearly distinguish facts, estimates and KCI analysis. Do not reuse historical example prices as current data.
2. Write the single complete article, with citations and a source ledger. Score source/data 35, analysis 25, freshness 15, Vietnamese 15, distinctness 10. Minimum 85/100 and no material error to proceed. Unresolved material evidence = BLOCKED before paid voice generation. No private portfolio information, target-price invention, trade instructions or guaranteed returns.
3. Adapt—not simply read—the article into one 60–110-second Vietnamese video. Choose one angle and 3–5 strongest facts. Draft and score at least three truthful hooks. Use one meaningful comment question plus a restrained follow invitation. CTA must be spoken once and match screen copy. Keep the disclaimer.
4. Validate schemaVersion 2 and source references before TTS. Use the approved Vbee Tuấn Anh News code `n_hanoi_male_tuananhnews_news_vc`; existing GitHub Secrets only. Never print or request tokens. Reuse unchanged audio for visual-only revisions. Do not use historical hardcoded KciNewsV2 graphics.
5. Save the article and job to main, then create ONE owner-authored trigger issue for this slot. Read live workflow state. Staggered slots reduce normal load overlap, but are not a hard technical mutex: do not claim render serialization unless verified in workflow configuration.
6. Inspect actual artifact: H.264/AAC, 1080×1920, 30 FPS, audible correct voice, visible current date and sources, opening/middle/CTA/outro frames, no overflow, no fictional price curves or unsupported claims. Captions based on word-count timing are estimated; disclose and review alignment. Never call a silent preview a finished video.

## Delivery, deferred completion and notification deduplication

If rendering completes within the task, download and inspect the actual MP4, return the verified file or authenticated GitHub artifact link, article, source ledger, script and QC summary. Status stays REVIEW_REQUIRED / CHỜ DUYỆT. No auto-posting.

If rendering is still queued/running, record the exact issue/run URL and state; do not promise the MP4 is finished. The separately configured completion watcher inspects pending runs and handles delivery. It is not a fifth video producer and must never call paid TTS, create trigger issues or start extra renders.

For completion messages, both producer and watcher use the exact issue-comment marker `KCI_VIDEO_NOTIFIED:<run-id>`. Read comments before delivery and skip completed runs already reported. After the artifact/QC has been verified, write this marker as part of the same delivery attempt, including slot, article ID, artifact ID, source of verification and review status. A marker is an at-most-once deduplication aid, NOT proof a push notification was received. No marker for failed, in-progress or silent outputs. If comment writes or file inspection are unavailable, state the specific limitation rather than inventing a passed gate.

The pre-cadence manual preview run `40072923254`, issue `17`, was already delivered to the owner on 24 October 2026. Exclude it and earlier demo/archival runs from automatic completion notifications. Never count them as one of a new day's four videos.

Completion message format: `KCI VIDEO V0N ĐÃ HOÀN THÀNH — DD/MM/YYYY`, topic, actual duration, verified voice, MP4/artifact link, compact QC caveats, `CHỜ DUYỆT — CHƯA ĐĂNG`.

Only count verified playable MP4s as completed. Article-only, job-created, queued, rendering, failed and BLOCKED states must remain distinct. Four is a production target, not permission to conceal a missing or failed slot.
