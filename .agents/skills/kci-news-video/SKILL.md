---
name: kci-news-video
description: Produce Korea Capital Insight Vietnamese Korea-stock and macro news, from a verified brief and strong truthful hook to script, follow/comment/save CTA, Vbee Anh Khôi Tin tức narration, Remotion motion graphics, and MP4 quality control. Use for "bản tin KCI", "video chứng khoán Hàn Quốc", "brief vĩ mô", "kịch bản hook và CTA" and recurring news-video requests.
---

# KCI News Video — Production Skill v2.0

## CHỈ ĐẠO VẬN HÀNH 27/11/2026 — GITHUB HANDOFF FIRST (ưu tiên cao nhất về trình tự sản xuất)

Mọi lượt KR_AM, KR_CLOSE, KR_MID đủ gate, MACRO21 và GLOBAL_US/US_AM phải đọc [GITHUB_HANDOFF.md](references/GITHUB_HANDOFF.md) trước khi nghiên cứu dài hoặc trình bày báo cáo. **Tin đủ căn cứ → chống trùng đúng ngày/edition → commit job JSON thật lên main → readback SHA → exact-job preflight xanh → mở đúng một [KCI VIDEO] issue → lấy run ID.** Đây là đầu ra bắt buộc của tác vụ sản xuất đủ điều kiện; không dừng ở kịch bản chat. 404 job ngày mới = chưa tạo, không mặc định mất GitHub. Không yêu cầu duyệt preview trước render, không biến lỗi Sheet/thiếu lịch sử tùy chọn/căn lời nâng cao thành chặn việc commit. Giữ nguồn trọng yếu, gate KR_MID, an toàn dữ liệu, chống trùng paid TTS, quy chuẩn Newsroom cá nhân và CTA đa dạng. Nếu chưa có issue/run, báo rõ trạng thái chưa bàn giao, bước cụ thể, lỗi thực tế và SHA/URL nếu có. Sheet và báo cáo chi tiết xử lý SAU khi bàn giao GitHub; không dùng run success làm bằng chứng MP4/duyệt/đăng. Không tự thay lịch, secrets hoặc phát hành.

## CHỐNG LẶP GIỌNG DẪN VÀ CTA — V1 (23/11/2026)

**BẮT BUỘC trên KR_AM, KR_MID khi đủ tin, KR_CLOSE, MACRO21 và GLOBAL_US/US_AM**: đọc [VARIATION_LIBRARY_V1.md](references/VARIATION_LIBRARY_V1.md) TRƯỚC mỗi job mới. Thư viện gồm **12 mạch kể, 18 kiểu hook, 24 câu chuyển ý, 35 câu hỏi mở, 10 cách mời theo dõi**. Các mẫu chỉ là biện pháp kể chuyện, KHÔNG phải câu rập khuôn hay dữ kiện mới. Đối chiếu 7 job gần nhất cùng edition + 12 job toàn stream gần nhất, tự kiểm tra sự trùng góc kể, câu hỏi và lời mời; ghi `variationReview` vào brief. Chạy `node scripts/check-editorial-variety.mjs jobs/<episode>.json` trước paid TTS nếu có công cụ. Cảnh báo lặp câu chỉ là **WARN**, không được chặn pipeline/đòi render lại bản cũ chỉ vì phong cách. Mọi luồng giữ câu hỏi MỞ sát chủ đề + lời mời bình luận và theo dõi kênh cá nhân, không spoken brand sign-off, không khuyên mua/bán. US_AM phải có mắt xích Mỹ → Hàn. Giữ nguyên giờ chạy, source/safety, giọng Anh Khôi, captions, chủ kênh duyệt MP4, không auto-post.

## CHỈ ĐẠO BIÊN TẬP MỚI 23/11/2026 — PERSONAL FINANCIAL NEWSROOM V1 (ưu tiên cao nhất cho văn phong và CTA)

**Áp dụng cho tất cả video MỚI KR_AM, KR_MID khi đủ tin, KR_CLOSE, MACRO21, GLOBAL_US/US_AM**, không trừ tin Mỹ 09h. BẮT BUỘC đọc và làm theo **[PERSONAL_NEWSROOM_V1.md](references/PERSONAL_NEWSROOM_V1.md)** mỗi lượt trước khi viết hook, scenes[].voiceText, CTA và caption. Các tác vụ đang chạy đều đọc LIVE SKILL.md từ repo này; không cần thay lịch để nhận quy chuẩn biên tập. Hướng dẫn này có ưu tiên hơn những ví dụ/lời văn cũ trong HOOK_CTA.md hoặc SCRIPT_FORMAT.md (nhất là "mỗi cảnh kết bằng Đây là...", CTA hai lựa chọn ép buộc, câu "theo dõi Korea Capital Insight"). Không thay đổi nghĩa vụ kiểm chứng nguồn và luật an toàn tài chính.

- **Dẫn như bản tin tài chính của kênh cá nhân**: diễn biến bất thường → dữ kiện được xác minh → động lực/cơ chế ảnh hưởng → phản ứng chính sách/ngành hoặc Hàn Quốc → chỉ báo có thể theo dõi. Ít số đọc lặp trên hình, không câu đệm/máy móc. Nói rõ khi cơ chế chỉ là khả năng, không quy một sự kiện là nguyên nhân duy nhất nếu thiếu căn cứ.
- **CTA**: một câu hỏi MỞ, sát nội dung, không ép người xem chọn 2 đáp án hoặc dự báo giá; lời mời bình luận + theo dõi kênh nhẹ nhàng, ví dụ: "Hãy chia sẻ góc nhìn tại phần bình luận và theo dõi kênh để cùng cập nhật những diễn biến mới nhất về thị trường nhé!" Không đọc tên thương hiệu ở cuối; logo vẫn có thể hiển thị. CTA trong cta.spoken một lần, KHÔNG lặp scenes[last].voiceText.
- **GLOBAL_US/US_AM bắt buộc** nối dữ kiện Phố Wall/Fed/SOX/lợi suất/USD với tác động có cơ sở tới Hàn Quốc; không chỉ đọc bảng chỉ số Mỹ. US_AM caption vẫn **50–100 KÝ TỰ tổng**, còn lời CTA không bị giới hạn caption. KR/MACRO caption vẫn dưới 50 từ.
- **Thực thi:** kịch bản mới gắn newsroomStyle=PERSONAL_FINANCIAL_NEWSROOM_V1 trong hồ sơ biên tập, ưu tiên cả trong job metadata nếu tiện; tự rà checklist trước Vbee để tránh mất phí render lại. Đây là quy chuẩn văn phong, không phải một bộ chặn regex. KHÔNG re-render video cũ, KHÔNG chuyển repo, đổi giờ hoặc tự đăng; render MP4 thật → QC → anh duyệt.

## Owner directive 17/11/2026 — KHÔNG CHẶN sản xuất + kịch bản thân thiện (ưu tiên cao nhất)

- **Validator chỉ cảnh báo** (không chặn) khi: thiếu nguồn `primary`, chỉ có 1 nguồn, hook không khớp candidate / ít hơn 3 candidate, cảnh 1 không bắt đầu bằng hook, CTA lặp trong cảnh cuối (runner tự bỏ lần lặp). Preflight vẫn **xanh** với các cảnh báo vàng; producer cứ tiếp tục mở `[KCI VIDEO]` issue. Mọi câu “stop/HARD GATE/never open an issue” về nguồn primary bên dưới đã bị thay bằng quy định này.
- **Vẫn chặn** (giữ an toàn): job sai cấu trúc khiến không render được, URL nguồn không phải HTTPS, scene trỏ tới nguồn không có trong ledger, câu hứa lợi nhuận/thúc giục mua bán. Không bịa số liệu hay nguồn.
- **CẤM khi viết kịch bản (kể cả câu phủ định):** “chắc chắn tăng/giảm/thắng”, “cam kết lãi/lợi nhuận”, “lãi 100/200/300%”, “mua ngay để”, “không mua sẽ tiếc”. Thay bằng “chưa thể kết luận … sẽ giảm”, “không bảo đảm … sẽ tăng” (bảng thay thế trong SCRIPT_FORMAT.md). Tự rà lại toàn bộ hook, voiceText, CTA trước khi commit job; nếu preflight hiện cảnh báo “tránh cụm…” thì sửa rồi mới mở issue.
- **Bài chữ tin doanh nghiệp (từ 26/11):** viết theo [TEXT_POSTS.md](references/TEXT_POSTS.md) và commit file `posts/YYYY-MM-DD-HHMM-<slug>.txt`; GitHub tự đăng lên kênh Telegram @koreacapitalinsight.
- **Khi render lỗi (từ 17/11):** đọc dòng “Lý do” trong comment RENDER LỖI của bot, sửa job trên main, chờ preflight xanh, rồi **Đóng → Mở lại chính issue đó** để render lại trên code mới nhất. Không tạo issue mới cho cùng bản tin; workflow tự từ chối mở lại issue đã có MP4. Câu cảnh báo có phủ định (“không thể suy ra … chắc chắn giảm”) không còn bị chặn.
- **Kịch bản gửi anh duyệt và giọng văn lời dẫn** theo [SCRIPT_FORMAT.md](references/SCRIPT_FORMAT.md): `KCI | <tiêu đề>` → `Cảnh N — <tiêu đề>` / `Text màn hình:` / `Lời dẫn:` → `Cảnh kết — CTA`. Điền `scenes[].title`, `scenes[].screenText` (và `scriptTitle` nếu cần) trong job; xuất bằng `node scripts/export-kci-script.mjs <job>` (preflight tự in vào Job Summary).

## Universal KCI MP4 + caption handoff — all recurring video streams

**Mandatory for KR_AM, conditional KR_MID, KR_CLOSE, MACRO21 and GLOBAL_US/US_AM:** read and apply [DELIVERY_HANDOFF.md](references/DELIVERY_HANDOFF.md) on every new video production and Completion Watch check. For a verified real complete Vbee-voiced MP4, priority is **a playable MP4 attachment in ChatGPT plus a ready-to-post Vietnamese caption**, not only a GitHub artifact/ZIP, issue link or static preview. KR_NEWS/MACRO captions <50 words including hashtags; GLOBAL_US 50–100 Unicode characters total including hashtags. No material QC falsification, unverified attachment claims or auto-posting. GitHub Actions does not itself upload attachments to ChatGPT; the Watch/producer must make and verify the handoff where tooling supports it. Do not treat `KCI_RENDER_READY` as `KCI_VIDEO_NOTIFIED`.

## Operational override — 3 November 2026: restore the working voiced-render pipeline

The user wants to APPROVE THE ACTUAL RENDERED VIDEO, accompanied by a caption. Follow the confirmed working `mode=video` path rather than treating an unimplemented nine-step editor as a precondition. Preserve source/voice/MP4 integrity gates and all existing schedules, streams, quotas, secrets, no-post restrictions.

- **PRE-TTS:** Verify facts, cutoff, source ledger, real `schemaVersion:2` job and existing run/artifact dedup. Fix any invalid/unsupported claims before Vbee. Stop only for real false facts, broken prerequisites or duplicate paid requests; thin or secondary-only sourcing is a warning, not a stop (17/11 directive).
- **EXECUTE:** Commit the reviewed real `jobs/kci-YYYY-MM-DD-<edition>.json` to default branch. Open exactly one repository-owner issue titled `[KCI VIDEO] YYYY-MM-DD <EDITION>` with raw JSON body `{"job":"jobs/kci-YYYY-MM-DD-<edition>.json"}` OR explicitly dispatch `.github/workflows/kci-video.yml` with `mode=video`, the real job path. Repo has NO cron; saving job/brief alone is not a render. The current `scripts/run-job.mjs --mode=preview` produces **SILENT** graphics; it is NOT the narrated owner-review file. `mode=video` makes real Vbee Anh Khôi narration plus Remotion H.264/AAC MP4; `validate` and `voice-test` are not video deliveries. No duplicate issue/run/TTS.
- **RENDER → QC → SEND:** First complete voiced MP4; verify actual artifact, decoding, audible voice, date/numbers, hook and CTA. AFTER rendering, evaluate advanced 9-step criteria (Whisper word sync ±2frames, 18Mbps, -14LUFS, face/take edits only if footage, beat stills). If not implemented/measured, mark `MP4 — CẦN RÀ SOÁT` / `NOT_MEASURED` / `TIMING_UNVERIFIED` and **still deliver** a usable complete video; never fabricate PASS. Only facts/voice/render integrity defects block delivery.
- **OWNER DELIVERY:** Completion Watch (or producer if actual file is accessible) posts the playable MP4 itself in ChatGPT for review; a private GitHub ZIP or issue comment is NOT the same as an inline MP4. Supply real artifact/run link and a short friendly Vietnamese caption under 50 total words including hashtags; GLOBAL_US caption is 50–100 TOTAL characters. Label `VIDEO ĐÃ RENDER — CHỜ ANH DUYỆT — CHƯA ĐĂNG`. Record real MP4 completion in original Sheet C, link E, truthful QC G; new row H=CHỜ DUYỆT/I=CHƯA ĐĂNG. Do not require approval to start video or generate a redundant identical final after approval; no auto-posting or trading.
- **FAILURE:** Preserve already synthesized voice/audio, identify the exact failing run/step and retry only with authorization after checking previous cost/status. Do not silently stop because optional features or a `preview-before-final` prose gate do not match the current code. The 27 October user directive and this clarification outrank archival preview-first instructions.

Read the concrete command/mode details in [PRODUCTION.md](references/PRODUCTION.md) and [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md).


## Production regression prevention — 2 November 2026

Before opening any paid [KCI VIDEO] issue or workflow_dispatch, validate the ACTUAL new episode job with scripts/validate-kci-job.mjs (not an archived demonstration job). A literal investment-promise regex can flag phrases such as 'không đồng nghĩa cổ phiếu chip chắc chắn tăng' despite the negation. Reword that warning truthfully to 'không bảo đảm cổ phiếu chip sẽ tăng' while retaining the investor-safety validator. Do not disable the safety checks. If a pipeline fails, read the EXACT failing command and exception in GitHub Actions, distinguish job validation from TTS/Remotion/host-video playback, and correct/retry only after confirming no prior successful MP4 or paid voice segment would be duplicated. Reference incident: 2026-11-02 KR_AM issue #60 failed during validation; issue #61 succeeded after the job and actual-target preflight fixes. Do not create duplicate content or auto-post.


## Latest owner instruction — ALL KCI production streams (27 October 2026)

**Render first, owner reviews the actual video afterward.** This owner directive replaces the prior GLOBAL_US-only exception and all conflicting "approve preview first, then render final" instructions for KR_AM, conditional KR_MID, KR_CLOSE, MACRO21 and GLOBAL_US/US_AM. After verifying fresh source facts and script, produce the fully rendered, playable **H.264/AAC MP4 with Anh Khôi Vbee narration, motion graphics, sound-off first-three-second hook and spoken/visual CTA**, inspect the file, then send its actual link to the owner to judge content, voice, graphics and readiness to publish. Do **not** stop at brief, storyboards, stills or a muted/incomplete preview; do **not** request an additional user command to render. A "review" file may retain a technical filename like `preview.mp4` or `out/<job-id>.mp4`, but must be a real complete MP4, not a render plan. It is not owner-approved or posted. If the owner approves this cut, no mandatory second identical render is needed; modifications require re-rendering a revised review MP4 before a new approval. **Never automatically publish.**

Required factual correctness, real Vbee voice, functioning encoded MP4 and safety/QC still apply. Missing optional advanced alignment, unimplemented effects or unmeasured loudness targets are clearly reported as `NOT_VERIFIED` / `MP4 — CẦN RÀ SOÁT` where appropriate; they are **not** a reason to withhold an otherwise usable narrated MP4. Do not claim those steps passed, invent a file, retry chargeable TTS blindly or hide a material fault. For a genuine blocker (unsupported voice, false/unsourced financial claims, invalid/missing audio, corrupt render), report `BLOCKED` with the actual cause and run link. Save actual rendered MP4 completion time in KCI News Sheet and leave owner decision `CHỜ DUYỆT`, publication `CHƯA ĐĂNG`. Keep existing schedules, quotas, Secrets, voice and historical video files unchanged.

The owner approved Korea Capital Insight financial-news styling, selected the Vbee voice `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức) on 26 October 2026, and approved the Remotion V2.1 design direction. Preserve those decisions. The purpose of this skill is a **repeatable source-backed Vietnamese financial newsroom**, not a static slideshow. Read [VOICE_PROFILE.md](references/VOICE_PROFILE.md) for the current selection, trial/listening gate and preservation of historical narration; a saved voice code is not proof of successful synthesis or listening approval.

## Mandatory new-edit override — owner request, 26 October 2026

Read [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md) on every new production or revision. Profile `KCI_EDIT_20261026_V1` incorporates the owner's nine editing stages: take selection/Whisper word timing, waveform-protected trimming, footage-only grading/eye zoom, keyword-only graphics, measured effects map, first-three-second hook, audio mastering, and **fully narrated MP4 render → internal QC → owner reviews the rendered cut → corrections if requested → separate approval before posting**. The 27 October all-stream render-first directive above controls. A rendered MP4 is never permission to publish.

This profile takes precedence over conflicting historical editing defaults below and in references: use Inter Bold around68px, white/navy#1c2c58/blue#365daa, keyword cues2–4words (not full-sentence burned-in captions), owner safe zone top220/bottom420/right140 at1080x1920, master-14LUFS/true peak<=-1dBTP, and an H.264/AAC full video render before owner review (target around 18Mbps / AAC320kbps only after actual implementation and measurement). Recorded footage retains its established source FPS; graphics-only keeps30fps. Preserve source/date/unit qualifiers and full-width use of the AVAILABLE middle, without an enclosing cramped card.

Classify real recorded-takes versus TTS/motion first. Do not invent camera takes, faces, glances, color before/after or edit statistics for generated narration. Word timing must be measured/reviewed on actual edited audio; proportional estimates cannot pass the two-frame effect gate. Read current code/capabilities before paid TTS or a legacy trigger: storing this specification does not install Whisper/face tracking or prove end-to-end support. Report missing stages honestly; ALL FIVE KCI video streams deliver a real rendered review MP4 first under the 27 October instruction, with verified voice and clear QC caveats. Keep schedules, stream separation, quota, source verification, current Anh Khôi voice, caption-copy preferences, credentials and all historical output unchanged. Preview/final stage labels, notification dedup and Sheet handling are specified in EDITING_WORKFLOW.md.

## Invocation and references

- **"Brief KCI"**: verify fresh market/macro stories, deliver a dated brief and source ledger.
- **"Biến brief thành video"**: write the hook, news script, scene plan, spoken CTA and reviewed JSON.
- **"Tạo video KCI"**: perform the whole workflow; when allowed, run GitHub Actions, inspect the real MP4 artifact and deliver for approval.
- **"Chỉnh hook/CTA"**: change those components while keeping approved facts and brand voice.
- **"Đăng"**: a separate explicit authorization and a connected publisher; do not auto-publish.

Read the focused references at the matching stage:
1. [Verified brief and source ledger](references/EDITORIAL_BRIEF.md)
2. [Hook, script and engagement CTA](references/HOOK_CTA.md)
3. [Vbee, Remotion and GitHub workflow](references/PRODUCTION.md)
4. [Editorial/visual/voice QC and release](references/QC.md)
5. [Current voice selection and migration rules](references/VOICE_PROFILE.md)
6. [Nine-stage editing and preview-before-final — overrides older editing defaults](references/EDITING_WORKFLOW.md)

## Non-negotiable rules

- **Fresh web verification every news run.** Use a Korean-local (KST) data cutoff, actual source URLs and publication timestamps; distinguish KRX official close, intraday high, delayed quotes, premarket/futures, US session timing and forecasts. Unknown = unavailable, never invented.
- Explain causal links to Korean equities; price movement **alone** is not a change in investment thesis.
- No invented minute-by-minute price curves from two/three checkpoints, fake event footage, speculative exact prices, exaggerated clickbait or guaranteed-return claims.
- **No release without natural Vietnamese voice**. Never substitute eSpeak/English TTS. A no-voice output is labeled preview only.
- A CTA must provide value, invite one meaningful action, avoid stock-pump promises or pressuring users to trade.
- Keep Vbee App ID and token exclusively in GitHub Actions Secrets; never print them. No auto-posting or trading.
- Do not claim success until the actual MP4 has a voice/audio track and passed a visual and factual inspection.

## Canonical six-stage workflow

### 1 — Brief / Newsroom triage

Read [EDITORIAL_BRIEF.md](references/EDITORIAL_BRIEF.md). Verify material stories about KOSPI/KOSDAQ, individual Korean companies, BOK/Fed, US macro/tech, KRW, CPI, exports, China demand, interest rates, bond yields, energy, geopolitical risks. Select a maximum of 5–7 developments for the **written brief** and three opening highlights.

For a 60–110-second video, choose **one central news angle and three to five strongest facts**, not the entire long brief. Record sources and exact claim IDs, KST cutoff, market sessions, units and uncertainty in the job. For digest editions, the latest DAILY_CADENCE.md controls story count and duration.

### 2 — Honest hooks and narrative

Read [HOOK_CTA.md](references/HOOK_CTA.md). Generate three evidence-backed hooks (reversal/contrast, investor impact, and a precise question); score specificity, factuality, relevance, curiosity and spoken length. Pick one. Explain the hook promptly; don't hide crucial facts behind artificial suspense.

Script: **HOOK → WHAT HAPPENED → WHY → KOREA IMPACT → WHAT'S NEXT → CTA**. Write natural short Vietnamese sentences suited to the selected voice. Separate on-screen numeric notation from clear voice pronunciation. Every number or company claim requires a source.

### 3 — One meaningful CTA

Pick one primary purpose: `comment` (balanced, answerable question), `follow` (specific news value), or `save` (evergreen analysis/checklist). A subtle follow request may accompany a primary comment invitation, but not a stack of three commands.

Place CTA near the closing10–20% after the core value. New schema v2 stores `cta.spoken` once outside `scenes[].voiceText`. The production runner **appends that CTA to the final Vbee narration segment**; the video template displays corresponding on-screen language. Do not duplicate spoken CTA in the outro script.

Example for an index reversal: "Theo anh chị, đây là hồi phục bền vững hay chỉ là nhịp hồi kỹ thuật? Bình luận góc nhìn và theo dõi Korea Capital Insight để cập nhật các phiên tiếp theo."

### 4 — Reviewed JSON job

Use [jobs/kci-schema-v2-example.json](../../../jobs/kci-schema-v2-example.json) as the schema example. New jobs use `schemaVersion: 2`, `sourceLedger`, `hook`, `cta` and source-linked scenes with visuals. Validate **before** calling paid TTS:

`node scripts/validate-kci-job.mjs jobs/kci-YYYY-MM-DD-topic.json`

**HARD PRODUCER GATE:** For EVERY new `schemaVersion: 2` edition, validate the exact checked-in JSON on the commit that will be rendered. **PRIMARY-SOURCE CHECK:** Before filing a paid issue, prefer (not require — 17/11 directive) at least one independent original/official source relevant to the claims of this specific job; record its exact URL, publication date, actual check time and `kind: "primary"`, and link its `sourceLedger[].id` from the supporting scene(s) in `sourceIds`. Reuters/Yonhap articles or institutional commentary are `secondary` even if they quote a government official. An older government release must be dated as historical context, not presented as a new market close. If no primary source is available, continue production — the validator only warns (17/11 directive); never mislabel sources or reuse unrelated documents. Incident: 07/11 MACRO21 issue #84 / run 42370942236 failed with `at least one primary-source cross-check required` despite 3 secondary sources; verified repair and no-Vbee regression recorded in `editorial/2026-11-07/macro21.md`. If using GitHub rather than a shell, check `KCI Job Preflight — no Vbee` for that job/commit and require **completed/success**, not just a started run. Never open an owner `[KCI VIDEO]` issue while its push preflight is queued, running or failed (warnings are fine; after 17/11 a failure means a real structural/safety defect). A saved file, valid example fixture, or editor's review is not a passing preflight. If blocked, fix and validate before creating the issue; never use billable TTS as a validator. `sourceLedger[].kind` permits only `primary`/`secondary` (institutional market analysis such as MUFG belongs to `secondary`); put the spoken CTA only in `cta.spoken`, NOT `scenes[-1].voiceText` (runner appends it once). Verify the hook text also matches a candidate verbatim. This rule prevents the 07/11 US_AM kind+CTA failure; it does not validate the factual accuracy of source claims.

The validator checks source references, the hook beginning, CTA completion and job structure; it cannot itself establish that third-party facts are true. Never relabel the archived 23 October 2026 news as today's news. Save the editing profile, capability assessment, effect map and preview stage in the editorial record; do not assume adding a JSON field changes renderer behavior.

### 5 — Vbee + Remotion + owner editing profile

- Voice: `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức); Cloudflare callback: `https://kcinews.golffashion-vn.workers.dev/api/vbee-callback`.
- First use or voice change: request a short trial and listen. After approval, generate Vbee MP3 for each scene with real durations and retain them. Follow [VOICE_PROFILE.md](references/VOICE_PROFILE.md); do not claim the new voice has already passed a live test, and do not regenerate old clips merely to change the default.
- New schema v2 jobs render via data-driven `KciNewsDaily`. The historical `KciNewsV2` is the **approved23/10 benchmark**, but contains some hard-coded numbers; don't reuse its historic charts for current jobs.
- Follow all applicable stages in [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md). Whisper each actual narration/source clip, review cuts against waveforms and align the edited audio. Show keyword/number cues, not full-sentence rolling captions. Word-count timing remains an estimate and cannot establish the required two-frame effects synchronization.
- Motion visuals must be sourced/parameterized.9:16 at1080×1920; pure graphics30fps, camera footage FPS per the editing profile. Render the complete voiced review MP4 before owner approval; the owner's sign-off concerns distribution, not an additional identical rendering step.
- **Instagram/Facebook Reels viewing safety:** the active `KciNewsReels` is behind composition ID `KciNewsDaily`. The latest owner profile is top220px/bottom420px/right140px for essential content, with meaningful boxes at y220–1500,x<=940. Use the available middle width, not a narrow boxed column. The former x56–1024/top264/bottom480 layout in QC D1 is historical; EDITING_WORKFLOW step5 governs new work. Verify entry/exit states and actual app overlays rather than claiming universal platform safety.
- For visual-only revisions when scripts have not changed, reuse original preserved Vbee audio/artifact. No needless TTS calls.

### 6 — QA, preview approval and final export

Read [QC.md](references/QC.md) and the overriding [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md). Inspect actual frame samples for EVERY mapped beat, opening/middle/CTA/outro, nearby onset frames, source/time labels and waveform/audio joins. Do not claim checks that were not performed.

For **all KCI streams**, generate and hand off the **actual full rendered MP4 with voice** first, along with review stills, effect map when available, source ledger, script, caption and measured QC evidence. Quality issues that do not make the news false or video unusable must be logged honestly as `QC CẦN RÀ SOÁT`; complete encoding/voice/data failures remain `BLOCKED`. The user's only routine approval stage is reviewing the finished video cut for publication or requesting revisions; an unchanged approved cut does not need a second identical export. Report `VIDEO MP4 ĐÃ RENDER — CHỜ ANH DUYỆT — CHƯA ĐĂNG` only after verifying the file. Record real render time in the KCI News Sheet. No video approval authorizes posting automatically.

If blocked, report the exact obstacle and preserve existing audio. Do not pretend ongoing GitHub jobs succeeded or a new document implements unsupported media tooling.

## Run from ChatGPT

This is a **repository-local Agent Skill** in `nvt91/kcinews`. It does **not** automatically become a selectable ChatGPT @ plugin. The owner may say "Dùng quy trình kci-news-video, tạo bản tin KCI tối nay"; the assistant follows the skill, researches current sources, prepares a reviewed job through connected GitHub tools, chooses a working route that actually renders a full voiced MP4, inspects the artifact and returns that video for the owner's review. No need to direct the owner to Codex for every edition when that supported route is available.

Existing owner-authored issue triggers are `[KCI VOICE TEST]` and `[KCI VIDEO]`; body uses `{"job":"jobs/kci-YYYY-MM-DD-topic.json"}`. These historical trigger names do NOT establish that audio, MP4, editorial QC or advanced editing targets passed, and never confer publication permission. Inspect the live workflow/runner first; missing required capability must be reported before paid synthesis. No credentials/workflow rewrite or new billed service is implied merely by this specification update.

Schedules and social publication are separate. **This skill does not silently enable auto-posting.**
