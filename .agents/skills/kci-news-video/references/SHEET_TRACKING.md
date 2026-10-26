# KCI News — Google Sheets production ledger

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

## Column contract

| Column | Header / purpose | Ownership and rule |
| --- | --- | --- |
| B | Tên video | Clear Vietnamese title; identify archival/weekend editions. Preserve an owner's edited title. |
| C | Ngày giờ sản xuất | Actual evidenced MP4 completion time in KST; blank until produced. Use native date-time and note whether based on artifact creation or workflow completion. Never use scheduled start as completion. |
| D | Caption đăng bài Viral kèm hastag | For NEW captions, follow [CAPTION_STYLE.md](CAPTION_STYLE.md): usually 30–65 Vietnamese words, plain/friendly/non-corporate Vietnamese, one relevant insight or gentle question and 3–5 topic-matched/trend-aware hashtags. Only claim a tag is trending if current evidence supports it; no irrelevant trend-chasing or guaranteed virality. No Markdown bold in FB/IG copy. Always preserve owner-edited text in D; seed only if blank/new or owner explicitly requests an update. |
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

G allowed values: `CHỜ NGHIÊN CỨU`, `ĐANG BIÊN TẬP`, `ĐANG DỰNG`, `MP4 — CẦN RÀ SOÁT`, `MP4 — QC ĐẠT`, `LỖI`, `BLOCKED`, `BỎ QUA`.
H allowed values: `CHỜ DUYỆT`, `CẦN SỬA`, `ĐÃ DUYỆT`, `KHÔNG DÙNG`.
I allowed values: `CHƯA ĐĂNG`, `ĐÃ ĐĂNG`, `KHÔNG ĐĂNG`.

Map queued/in-progress to ĐANG DỰNG only when a real job exists. A success flag alone cannot yield MP4 — QC ĐẠT. A verified playable MP4 with outstanding duration/subtitle/factual/audio checks is MP4 — CẦN RÀ SOÁT. Use MP4 — QC ĐẠT only after the required QC scope is evidenced and state remaining qualifications. Lack of a critical source is BLOCKED, not a completed video. A failed run is LỖI and must preserve audio/artifacts. Do not regress a newer completed row because an older run failed.

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
