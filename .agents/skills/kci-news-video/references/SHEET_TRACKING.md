# KCI News — Google Sheets production ledger

## GLOBAL_US render-first instruction, 27 October 2026

Beginning with the next GLOBAL_US/US_AM edition, the owner wants a fully rendered voiced MP4 delivered first, then owner review (no pre-render preview approval). Do not equate a finished technical render with approval or publication. In Trang tính1 write C=verified actual MP4 completion time KST, E=real playable video/run/artifact link, G=honest QC state, H=CHỜ DUYỆT and I=CHƯA ĐĂNG; if no actual MP4 leave C empty. Record technical limitations without inventing QC PASS. Preserve owner edits, articleId idempotency, history and the separate stream schedules. Lịch tác vụ row15 is for recording this configuration, never controlling the scheduler. Caption remains 50–100 total characters including hashtags.


Owner requests: 25 October 2026 — use the existing KCI News Sheet as a logging/approval surface; 26 October 2026 — explicitly include the separate Global/US morning video task and switch NEW KCI narration to Anh Khôi Tin tức. The Sheet is NOT a publisher or a scheduler. Logging never changes schedules, production quotas, Vbee configuration, secrets, or permissions by itself; the new voice is configured separately in VOICE_PROFILE.md and the video workflow.

## Verified destination

- Native spreadsheet ID: `1ZBtYv3sW20VZUpQXeA8o9BguGm-Dx7jyJ2U56bH1ur0`
- URL: https://docs.google.com/spreadsheets/d/1ZBtYv3sW20VZUpQXeA8o9BguGm-Dx7jyJ2U56bH1ur0/edit
- Time zone: Asia/Seoul; locale vi_VN.
- Video ledger: sheetId `0`, title `Trang tính1` at initialization; headers row2, records from row3, columns B:O.
- Existing native table: tableId `376391657`, name `Bảng_1`. Preserve its native structure, styles and dropdowns; extend its range when adding a row. Its initial authored range is B2:O3; do not assume this remains the populated end.
- Schedule inventory: sheetId25001, `Lịch tác vụ`, table header B9:K9, existing tasks rows10–16; the GLOBAL_US / US_AM task is row15, schedule 09:00 Asia/Seoul Monday–Saturday. The task row is for oversight, not the scheduler.
- Usage notes: sheetId25002, `Hướng dẫn`.

Read metadata and bounded cell data through the connected Google Drive/Sheets tools before every write. The mounted Excel attachment is not the live destination. If access fails, do not create another spreadsheet, infer successful writes, replace credentials or change sharing.

## Scope

Log KR_NEWS editions KR_AM, KR_MID, KR_CLOSE; independent MACRO/MACRO21; and — by separate owner request on 26 October — GLOBAL_US / US_AM (Global & US Morning Video, 09:00 KST Monday–Saturday). The producer for that independent US task must create at most one unique job/articleId `KCI-YYYYMMDD-US-AM` and upsert video status into Trang tính1 using the same read/upsert/verify and owner-approval restrictions. KCI Sheet Sync reconciles GLOBAL_US only when real source job/run/video evidence exists. Sheet recording does not change another task's time or content. No personal portfolio, email or other-brand data belongs here.

One canonical articleId = one row. Use the existing IDs from DAILY_CADENCE.md. Visual revisions/reruns update that row, not a duplicate. A rendered video awaiting correction remains a recorded MP4, not approved or published. Optional KR_MID checks that fail the news materiality gate may record BỎ QUA without creating a video, invoking TTS or sending a routine no-news notification.

## Render completion vs owner approval — 27 October 2026

For a new fully rendered, playable narrated MP4, write its real completion timestamp in C and its verified accessible link in E even when it is a review copy awaiting user approval. G reflects QC honestly; H remains CHỜ DUYỆT, I remains CHƯA ĐĂNG. This replaces any former "C stays blank until a second post-approval final render" instruction for new editions. Video rendering is not publication; don't treat an approved caption or Sheet selection as an instruction to upload automatically. Don't overwrite edits, duplicate rows or invent output links.

## Column contract

| Column | Header / purpose | Ownership and rule |
| --- | --- | --- |
| B | Tên video | Clear Vietnamese title; identify archival/weekend editions. Preserve an owner's edited title. |
| C | Ngày giờ sản xuất | Actual evidenced MP4 completion time in KST; blank until produced. Use native date-time and note whether based on artifact creation or workflow completion. Never use scheduled start as completion. |
| D | Caption đăng bài Viral kèm hastag | Short, plain, friendly Vietnamese caption: normally 30–60 words / 2–3 sentences, excluding disclaimer and 2–3 relevant hashtags. Follow the caption and trend-verification rules in HOOK_CTA.md. No promise of virality. Preserve existing owner edits; only seed when blank/new or explicitly authorized to revise. |
| E | Link có thể mở video nếu có | Verified MP4/Drive link, or verified authenticated GitHub run/artifact link with note explaining access and expiry. No imaginary public URLs or sandbox paths as external links. Blank when unavailable. |
| F | Luồng / bản tin | KR_NEWS / KR_AM, KR_NEWS / KR_MID, KR_NEWS / KR_CLOSE, MACRO / MACRO21, or GLOBAL_US / US_AM. |
| G | Sản xuất & QC | Machine-observed production state, from the vocabulary below. |
| H | Anh duyệt | OWNER-CONTROLLED. Initialize CHỜ DUYỆT for a new output; never infer approval. |
| I | Xuất bản | OWNER-CONTROLLED. Initialize CHƯA ĐĂNG; no auto-posting or inference from approval. |
| J | Ghi chú / cần sửa | Preserve all owner notes. Add concise timestamped machine QC/failure notes without deleting prior feedback. Do not repeatedly append unchanged notes. |
| K | Mã bản tin | Exact unique articleId; search this field before write. |
| L | Brief / kịch bản / nguồn | Verified canonical repository/Drive location, not guessed. |
| M | Run / hồ sơ kỹ thuật | Verified current workflow run or issue URL. Keep meaningful previous-run history in cell notes or the repository ledger, not extra video rows. |
| N | Cập nhật KST | Actual last successful observation/write timestamp, native date-time. |
| O | Link bài đã đăng | OWNER-CONTROLLED; only confirmed published-post URL. Blank does not authorize publishing. |

### Global/US (US_AM) caption standard — owner's update, 26 October 2026

For **GLOBAL_US / US_AM only**, the owner requests a plain, warm, conversational Vietnamese Facebook/Instagram caption with **50–100 Unicode characters total including whitespace, punctuation, and hashtags**. Aim for one factual, interesting sentence and optionally one natural, answerable question; use **1–2 relevant hashtags** (e.g. #KoreaCapitalInsight plus topic). Count code points before save: `[...caption].length` must be within 50–100. Do not make it verbose, formulaic, heavily promotional, sensational, bold-formatted, or multi-paragraph. Avoid adding a long disclaimer, a source list, or a link that breaks the character cap: preserve sources, nuance, and investment disclaimer in the full brief/video and QC records. Never trade factual correctness for the length. This new instruction **overrides the generic 2–3 hashtag / full-caption disclaimer guideline in column D for GLOBAL_US only**, not for other KCI streams.

For existing video `KCI-20261026-US-AM`, the owner explicitly requested revising its previously long caption; replace that one caption with a 50–100-character version. Subsequent sync must preserve the revised caption and any further owner edits, never expand it back to the old long form. For future editions, set the caption when the row is created or when blank; owner edits always take precedence.

G allowed values: `CHỜ NGHIÊN CỨU`, `ĐANG BIÊN TẬP`, `ĐANG DỰNG`, `MP4 — CẦN RÀ SOÁT`, `MP4 — QC ĐẠT`, `LỖI`, `BLOCKED`, `BỎ QUA`.
H allowed values: `CHỜ DUYỆT`, `CẦN SỬA`, `ĐÃ DUYỆT`, `KHÔNG DÙNG`.
I allowed values: `CHƯA ĐĂNG`, `ĐÃ ĐĂNG`, `KHÔNG ĐĂNG`.

Map queued/in-progress to ĐANG DỰNG only when a real job exists. A success flag alone cannot yield MP4 — QC ĐẠT. A verified playable MP4 with outstanding duration/subtitle/factual/audio checks is MP4 — CẦN RÀ SOÁT. Use MP4 — QC ĐẠT only after the required QC scope is evidenced and state remaining qualifications. Lack of a critical source is BLOCKED, not a completed video. A failed run is LỖI and must preserve audio/artifacts. Do not regress a newer completed row because an older run failed.

## Caption style update — owner request, 26 October 2026

Before drafting a NEW caption for column D, read the caption section of [HOOK_CTA.md](HOOK_CTA.md). Use short, mộc mạc, friendly language for Vietnamese viewers, one main idea and a light relevant invitation rather than a long analytical report. Default 30–60 words / 2–3 sentences, excluding a short investment disclaimer and 2–3 hashtags. Preserve material source/date/estimate qualifications; do not compress them into misleading claims. Plain text only, no markdown bold, at most one suitable emoji. The existing header word "Viral" does not authorize sensational wording, irrelevant hashtags or promises of reach.

Use a brand hashtag plus relevant topic tags; add a topical trend only when supported by fresh evidence for the intended platform/audience. Trend evidence and checking time belong in the editorial record, not a long caption. If trend verification is unavailable, use relevant tags without calling them trending. The sync/watcher must not invent trend status, current market facts or a fresh news story to fill a cell. It may reuse the source-backed producer caption and evidence; otherwise record the limitation.

This preference applies to future caption drafting, not an authorization to overwrite existing D cells, owner edits or historical publication text. Do not bulk-edit old rows, regenerate voice/video, change schedules, alter approval/publication selections or rename the native table/header for this style change. Only claim actual Sheet writes after the normal write/readback process.

## Read / upsert / verify procedure

1. Read spreadsheet metadata, then header and finite ID range. Ground sheetId/title, bounds, table range and validation. Start with the used table range; do not scan private unrelated tabs. Prefer get_spreadsheet_cells with userEnteredValue,formattedValue,effectiveValue,dataValidation,chipRuns,userEnteredFormat,note. If metadata omits tables, use the documented no-match batchUpdate metadata probe.
2. Find exact articleId in columnK. Zero matches: read the intended new row and adjacent exemplar before adding. One match: read B:O of that row including owner controls and notes. Multiple matches: stop with SHEET_SYNC_CONFLICT; do not arbitrarily merge/delete.
3. Plan a minimal update. On existing rows do NOT rewrite H/I/O, existing owner-edited B/D or the entire row. Preserve J text; append only a new verified machine observation. Do not copy another video's content/chips/approval state. Do not overwrite a later timestamp with a stale observation.
4. On a new row, preserve native formatting/validation intentionally (format-only copy when safe), write the complete intended record, and extend existing table376391657 to cover all authored rows/columns B:O using updateTable.fields=range. Use exact native header names/column types; do not replace the table or apply a conflicting standalone basic filter. Validate against existing dropdown choices. Use narrow updateCells field masks.
5. Re-read the written row and the table metadata. Confirm unique key, title, status, actual timestamp, exact URLs and all preserved owner fields. Record SHEET_SYNC_OK only after successful readback; store a brief audit receipt with articleId, sheet/range, observation time, run and cells changed in the job's editorial record or an existing issue comment where possible. Do not add completion-notification markers merely for a Sheet write.
6. If the API times out after a write, read first before retry to avoid duplicate records. A Sheet outage must never trigger paid TTS, a video rerun or a new production issue. Preserve the video and report SHEET_SYNC_FAILED with the exact blocker; do not claim real-time synchronization.

The connector does not supply a cross-system transaction/lock. Read immediately before writing, use minimal field/range updates, and read back. If a concurrent edit creates a conflict, preserve the owner's changes and surface the conflict rather than silently resolve it.

## When to write

- Producer: at a meaningful stage/checkpoint and before returning the result, upsert the same row with current evidence and URLs. No new time-based automation is created for logging. A gate-failed midday check may create/update BỎ QUA with a reason and no completion timestamp.
- Completion Watch: reconcile rows for actual known jobs in its existing scope, including ones already delivered in ChatGPT if their Sheet row is absent/stale. The KCI_VIDEO_NOTIFIED marker suppresses duplicate CHAT delivery, not this Sheet reconciliation. Do not download/render again merely to refresh a timestamp. If state is unchanged, do not churn cells.
- Approval/publication: leave the owner's selections intact. Reading ĐÃ DUYỆT may record approval in the workflow but NEVER executes a post, schedules a post or implies publication. Requests in feedback cells are review input, not unlimited authorization to run code, access secrets or incur paid synthesis.
- Schedule tab: read-only snapshot of verified automation configuration. A checkbox/clock edit there is NOT a scheduling command. Only update the matching task's observed status/last-run/logging note when verified, preserving IDs and unrelated tasks. Initial inventory is not proof of completed output.

## Initial migration record

KCI-20261025-KR-AM was seeded from the existing editorial file and completed Actions run40141745682, with real mounted MP4 metadata: 63.0seconds,1080x1920,30fps,H.264/AAC. State MP4 — CẦN RÀ SOÁT / CHỜ DUYỆT / CHƯA ĐĂNG: duration is below the90–110second digest target and caption timing remains estimated. This storage pass is not a fresh market-fact or full voice review.

Its artifact12578834545 (kci-40141745682) expires 2026-11-01T08:18:21+09:00 and requires GitHub access. Do not present this as a permanent streaming link. No bulk import of old clips or hypothetical future rows was performed.

This reference configures agent-mediated logging through Google Drive tools. It does not install a Google API credential into GitHub Actions, create a webhook, guarantee immediate delivery, or change push/email settings. Never report a future automatic update as tested until an actual scheduled run has successfully written and been read back.
