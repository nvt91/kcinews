# KCI — GITHUB HANDOFF FIRST (27/11/2026)

Owner-approved operational repair. Applies to every new KR_AM, KR_CLOSE, eligible KR_MID, MACRO21 and GLOBAL_US/US_AM episode. Keep existing clocks, quotas, credentials, voice, source verification, personal newsroom style and review authority. This document changes the order of work, not the publication permission. Read before producing every scheduled video.

## A. Critical path — complete the handoff before reporting

1. Determine the actual KST date and edition. Inspect the exact intended job path, recent issue bodies and run status for that edition. A 404 for a new dated job is normally NOT_CREATED, not a GitHub outage. Check the repository itself and matching issue/run before deciding. Existing queued/running/successful render must be reused; never spend Vbee twice. If the exact job already exists without an issue, inspect it and its exact preflight; resume that job rather than writing a duplicate.
2. Verify material facts, dates, sessions, units and sources. Use primary sources when obtainable and reliable independent reporting as corroboration. Omit unsupported optional statistics; do not turn lack of a nonessential primary-source URL into a universal stop when the material facts are adequately supported. If material facts cannot be resolved, mark BLOCKED_SOURCE. For conditional KR_MID, preserve the genuinely-new-material-event gate; if the morning job is absent, examine available briefs/issues and only proceed with a clearly material verified new event. Do not create a midday episode merely because the morning episode is missing.
3. Write the shortest complete schemaVersion=2 job using current scripts/validate-kci-job.mjs and a known successful example. Apply PERSONAL_NEWSROOM_V1 and VARIATION_LIBRARY_V1: causal explanation, open CTA, no formulaic phrases, appropriate caption. For available history, compare previous jobs; record missing history without inventing prior reviews. Use valid visuals (comparison requires 2–5 bars, reversal requires exactly 3 labeled observations). Format KST ISO timestamps to seconds, e.g. 2026-11-27T08:00:00+09:00, without milliseconds. Set REVIEW_REQUIRED. Preserve the original articleId and edition and use the normal job path. Save verified source ledger and voiceText in the job itself.
4. **WRITE THE JOB TO main via the connected GitHub write action now**, then read back the actual path and blob SHA. Do not spend the remainder of the scheduled turn composing a chat report, researching optional details, building cards, generating preview pictures, or attempting the Sheet. The brief can be committed before or after the job, but the brief must not become a substitute for the job. If there is an actual connector error, report the exact operation and error; do not label a merely unattempted write as a connection failure.
5. Inspect the KCI Job Preflight — no Vbee run for the exact job commit. Confirm the run actually validated that path, not an unrelated docs change or old run. A success with warnings is acceptable if no material factual/safety defect exists. If the schema fails, correct only the defective field and revalidate. Do not bypass validation or invoke a paid issue before the exact check is successful. If preflight is still running, report JOB_COMMITTED / PREFLIGHT_PENDING with the commit/run evidence; do not report production finished.
6. If the exact job preflight passes and no existing matching active/successful issue/run exists, open exactly ONE owner-authored issue: [KCI VIDEO] YYYY-MM-DD EDITION <topic>, with JSON body {"job":"jobs/kci-YYYY-MM-DD-<edition>.json"}. Check the issue URL and associated run. For an existing failed issue, use its documented repair/reopen route only after confirming no MP4 exists and avoiding duplicate billed synthesis. A prior successful job never gets reopened automatically. Do not use a new issue to bypass duplicate protection. This is the full voiced review MP4 route, not silent preview mode.
7. After the render is triggered, record ISSUE_CREATED / RENDER_QUEUED or RENDER_RUNNING and actual links. Inspect artifact when available; report RENDER_READY only when the MP4 is real with audio/video. Deliver actual MP4 for owner review where supported; otherwise mark DELIVERY_BLOCKED with the actual link. No false notification or approval markers. Never call Vbee again for Sheet, transfer, missing styling metadata, or delivery problems.

## B. What must not block job handoff

Google Sheet metadata/native-table/permission failures, unavailable nonessential comparison history, missing optional stills/beat maps, optional alignment and advanced polish, and long chat-format reports are not prerequisites to committing a source-verified job or opening a validated production issue. They are separate tasks or QC limitations. Preserve the factual/structural/financial safety gates, exact-episode duplicate checks, and the KR_MID eligibility gate. A genuine inability to establish exact episode identity or material facts is a blocker, not a reason to invent evidence.

The earlier instructions requiring preview approval BEFORE a full voiced MP4 are superseded by the owner's 27/10 render-first decision and 23/11 Newsroom review reference. Use the currently verified full video route; do not stop at script or silent preview. Do not confuse render success with approval to publish.

## C. Minimal receipt for every eligible run

Return these fields, using real evidence:
- date/edition/articleId
- job path + actual commit/blob SHA, or JOB_NOT_CREATED with reason
- exact preflight run ID/conclusion, or PREFLIGHT_PENDING/FAILED with reason
- issue number + actual URL, or ISSUE_NOT_CREATED with reason
- render run ID/status, artifact if present
- QC/delivery status and owner approval (never infer from a generic success marker)
- Sheet status as independent follow-up

Use precise statuses: BLOCKED_SOURCE, BLOCKED_CONNECTOR, JOB_COMMITTED, PREFLIGHT_PENDING, PREFLIGHT_FAILED, ISSUE_CREATED, RENDER_RUNNING, RENDER_FAILED, RENDER_READY, DELIVERY_BLOCKED, DELIVERED_FOR_REVIEW. Completed scheduled conversation is not evidence of production completion. Don't claim the scheduling service has changed or a subsequent run has succeeded just because this file is on main.

## D. Scope and recovery

No new schedules, no new automatic paid triggers, no historical rerender, no changing secrets. Do not trigger public publication merely to test a producer handoff. Existing Telegram delivery/publication configuration is a separate policy surface; do not use a delivery test to publish an unapproved review video. Existing text-post and market-mover workflows are separate from these video instructions. If actual publication permission is ambiguous, do not invoke a run that would publish as a side effect; report the conflict for the owner.

This repo guide is a live producer instruction. It is not an independent scheduler and cannot force ChatGPT to execute a tool write when a scheduled run stops before it. Direct automation prompt updates may require resolving the current account's active-task limit. Verify the next real dated job/issue/run before declaring the recurring handoff restored.
