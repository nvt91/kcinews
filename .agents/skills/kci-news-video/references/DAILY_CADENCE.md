# KCI — Separate macro coverage and Korean economic/market digests

## Mandatory Sheet handoff — owner request, 25 October 2026

Every KR_NEWS/MACRO producer and KCI Video Completion Watch must also read [SHEET_TRACKING.md](SHEET_TRACKING.md) and update the owner's existing **KCI News** Google Sheet through connected Google Drive tools at meaningful checkpoints and before returning a result. Spreadsheet ID: `1ZBtYv3sW20VZUpQXeA8o9BguGm-Dx7jyJ2U56bH1ur0`; sheetId0, `Trang tính1`, headers row2, records from row3, exact articleId key in columnK. Preserve the original B:E fields, native table, owner approval/publication choices and feedback. Upsert one row per edition, read back writes, and report actual sync failures. The completion-notification marker suppresses duplicate chat delivery, NOT reconciliation of a missing/stale Sheet row. Do not recreate audio/video to fix a Sheet failure. This is agent-mediated logging, not a GitHub webhook. It changes no schedules, quotas, billing, unrelated workflows or publishing authorization. The separate Global/US task is inventory-only unless the owner separately asks to integrate it.

Owner clarification: 24 October 2026. This REPLACES the mistaken four-article/four-video cadence. Korean digest schedules start 25 October 2026. The independent macro task is restored to its existing 21:00 Asia/Seoul slot, including 24 October. This document is an operating contract, not an executable scheduler.

## Two independent streams

**MACRO — Theo dõi vĩ mô, 21:00 KST daily.** Preserve the separately approved macro-monitoring and one-video review workflow. Cover material monetary policy, growth, inflation, rates, FX, energy, trade and global risks, explaining transmission to Korea. Do not repurpose this task into a fourth Korean-news slot, a company-disclosure slot or an extra market recap. Its video is NOT counted in the Korean-news target.

**KR_NEWS — Korean economic and market news, Content K-Stock.** Target TWO regular digest videos daily, plus a THIRD only when material fresh news warrants it. Cover significant Korean economic releases/policy, KOSPI/KOSDAQ developments, industries and verified corporate disclosures. International news is supporting context only where Korean impact is clear. This is public editorial coverage, not personal portfolio management.

Do not combine the streams or move the macro clock. FOUR ARTICLES = FOUR VIDEOS is obsolete. Neither stream authorizes social posting, trades, external recipients, secrets access or account changes. Preserve unrelated tasks.

## Korean digest cadence

| Edition | Production start KST | Purpose | Policy |
| --- | --- | --- | --- |
| KR_AM | 08:00, existing schedule retained | Morning Korean economic/market digest, company/industry developments and domestic agenda | One regular digest MP4 |
| KR_MID | Around 12:00 | Important new domestic developments since the morning digest | Optional third MP4, subject to materiality gate |
| KR_CLOSE | Around 17:00, flexible within one hour | After-KRX-main-session digest: market story plus significant economic, industry and company developments | One regular digest MP4 |

These start processing; they are NOT promised completion or posting times. Keep edition identity when late and use the real KST cutoff. Verify current venue hours, holidays and US DST each news run. Do not describe 08:00 as before all trading or ongoing afternoon NXT data as a final close.

KR_MID requires either one newly verified event materially changing the Korean policy/market/industry/company outlook, or two independently meaningful new developments not already covered. Price fluctuation alone, repeated headlines, rumors or cosmetic updates do not qualify. Record why the gate passed. Otherwise do not call paid TTS, create a render issue, send a routine no-news notification or recycle content. At most one KR_MID video per date. No automatic fourth Korean video or catch-up videos.

Weekends/holidays: use clearly labeled economic/industry news, weekly context or next-week previews with current verification. No imaginary trading sessions. If distinct supported content is inadequate, report the limitation rather than force the target. The optional third digest retains the materiality gate.

## Digest format

KR_NEWS uses digest mode, NOT one video per written article. The written brief can rank 3–5 developments; each video selects the 2–3 most important items and explains their Korean relevance. Lead with the strongest verified story, transition clearly, and end with what to watch. Do not imply unrelated items have one causal explanation. One edition = one MP4, not multiple paid jobs.

Target 90–110 seconds within the approved 60–110-second range; reduce items rather than rush narration. Single-story format remains available for the separate macro video or an exceptionally dominant story. Draft three truthful hooks and select one. Use one meaningful comment invitation plus a restrained follow request, spoken once and displayed. Retain a short information-only disclaimer.

Read SKILL.md, EDITORIAL_BRIEF.md, HOOK_CTA.md, PRODUCTION.md, QC.md and VOICE_PROFILE.md. This document controls stream/count/digest format; their source, security, voice and QA gates remain binding.

## Identity and persistent handoff

Use actual Asia/Seoul edition date and the code assigned by the triggering task. Never infer stream from wall-clock time.

| Stream/edition | Article ID | Article path | Job path | Issue title prefix |
| --- | --- | --- | --- | --- |
| KR_NEWS/KR_AM | KCI-YYYYMMDD-KR-AM | editorial/YYYY-MM-DD/kr-am.md | jobs/kci-YYYY-MM-DD-kr-am.json | [KCI VIDEO] YYYY-MM-DD KR_AM |
| KR_NEWS/KR_MID | KCI-YYYYMMDD-KR-MID | editorial/YYYY-MM-DD/kr-mid.md | jobs/kci-YYYY-MM-DD-kr-mid.json | [KCI VIDEO] YYYY-MM-DD KR_MID |
| KR_NEWS/KR_CLOSE | KCI-YYYYMMDD-KR-CLOSE | editorial/YYYY-MM-DD/kr-close.md | jobs/kci-YYYY-MM-DD-kr-close.json | [KCI VIDEO] YYYY-MM-DD KR_CLOSE |
| MACRO/MACRO21 | KCI-YYYYMMDD-MACRO21 | editorial/YYYY-MM-DD/macro21.md | jobs/kci-YYYY-MM-DD-macro21.json | [KCI VIDEO] YYYY-MM-DD MACRO21 |

Issue body stays ONLY runner-compatible JSON: {"job":"jobs/<actual-file>.json"}. Keep stream, slot, format, articleId, articlePath, eventKeys in job metadata/markdown. New jobs: schemaVersion2, KciNewsDaily. Event_key = company/topic + event type + original publication date; an edit is not a new event.

Read accessible jobs/articles/issues for today and the preceding seven days. These files, not assumed shared chat memory, are the record. Compare both streams: a repeated event requires material new information or a clearly distinct angle, not the same script twice. State actual comparison scope. Preserve existing automation identities; do not claim cross-chat delivery routing unsupported by tools.

Before job/trigger creation, check exact date+stream+edition, issues/runs and legacy v01/v02/v03/v04 paths during migration. Reuse/report queued/running/successful jobs, never duplicate Vbee. Read current file SHA before edits; preserve approved work. Diagnose failures first, preserve audio, reuse unchanged audio for visual-only revisions. Never blindly repeat paid synthesis on timeout. Staggering is not a global technical mutex.

## Source and production gates

1. Research the web anew; open sources/amendments. Prefer DART/KIND, KRX/NXT, company IR, BOK/ECOS, issuing Korean agencies, Fed/BLS/BEA/Treasury. Reuters/Yonhap support discovery/context/corroboration. Record real URLs, publication/event dates, reporting period, units, venue/session and KST cutoff. Old chat numbers and snippets are not fresh evidence.
2. Separate facts/estimates/analysis. Resolve conflicting figures or omit them. Score source/data35+analysis25+freshness15+Vietnamese15+distinctness10. Require85+ and no material error before paid voice; score is not probability. Critical evidence missing=BLOCKED. No private portfolio details, invented targets, trading instructions or promises.
3. Save brief, source ledger, selected hooks, script, source-linked scenes, event keys and reviewed JSON. Validate schema before TTS. Structural validation is not factual verification.
4. Use the owner-selected Vbee Anh Khôi Tin tức `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` for new narration, following [VOICE_PROFILE.md](VOICE_PROFILE.md) and its trial/listening gate. Preserve existing Secrets/callback, Remotion KciNewsDaily, 1080x1920,30fps,H.264/AAC. No archived hard-coded charts, fictitious intraday curves, silent-video substitution or unapproved voice. Never print/request credentials. Do not regenerate or relabel older audio when changing this default.
5. Save valid files on main, then create ONE owner-authored [KCI VIDEO] issue for the edition, using .github/workflows/kci-video.yml. Production runs do not modify workflows, Secrets, schedules or billing settings.
6. Inspect actual MP4: source/date/venue labels, opening/middle/CTA/outro, Vietnamese overflow, audible correct narration, CTA, audio streams and captions. Word-count timing is estimated. Never claim listening/visual inspection not performed.

## Completion and notifications

Only verified playable MP4s count as completed. Draft, job-created, queued, rendering, failed, QA_REQUIRED and BLOCKED remain distinct. All outputs stay REVIEW_REQUIRED / CHỜ DUYỆT — CHƯA ĐĂNG.

If finished within the producer run, deliver inspected MP4 or verified authenticated artifact, script, sources and QC. Otherwise record actual issue/run URL and state for KCI Video Completion Watch. The watcher serves BOTH streams and only checks/QCs/delivers: no paid TTS, new trigger or rerun.

Producer/watcher read issue comments and use KCI_VIDEO_NOTIFIED:<run-id> to avoid repeat delivery. Write only after actual MP4/QC verification in the same delivery attempt, including stream/edition/articleId/artifactId/verified scope. A marker does not prove push receipt. No completion markers for failed/in-progress/silent outputs. Failed run: at most one accurate alert with KCI_VIDEO_FAILURE_NOTIFIED:<run-id>; no blind retry.

Completion message identifies KINH TẾ & THỊ TRƯỜNG HÀN QUỐC or VĨ MÔ21H, edition/date/topic, actual duration, verified voice, real MP4/artifact link, QC caveats, CHỜ DUYỆT — CHƯA ĐĂNG. Push/email settings are separate and must not be claimed enabled without verification.

Exclude already-delivered manual demo run40072923254/issue17 on24October2026 and earlier archival previews from notifications/counts. Never change other brands' or investment-monitoring tasks. No auto-posting.
