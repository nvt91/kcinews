# KCI | PERSONAL FINANCIAL NEWSROOM V1 — OWNER EDITORIAL STYLE, 23/11/2026

**Priority:** This instruction supersedes older scripted-news/CTA style in SCRIPT_FORMAT.md and HOOK_CTA.md, without replacing source verification, investment safety, Vbee/MP4 QC, scheduling, or owner approval.

**Applies to ALL new scheduled KCI videos:** KR_AM 08:00, GLOBAL_US/US_AM 09:00 Mon–Sat, conditional KR_MID 12:00, KR_CLOSE 17:00, MACRO21 21:00 (Asia/Seoul). Also applies to producer briefs, JSON scenes[].voiceText, hook, cta.spoken, export-to-script and reviewer of new scripts. Existing rendered videos are historical and should NOT be revoiced or rerendered solely for a style update.

## 1. Editorial identity

A **personal Vietnamese finance-news channel**: informed, objective, conversational, professional, never corporate-sounding or robotic. Korea Capital Insight appears in graphic identity/logo, but NOT as a spoken brand-signoff or a mandatory "follow Korea Capital Insight" call. Avoid self-praise, stock-buy prompts, and guaranteed forecasts.

Voice should deliver value like a financial TV bulletin while providing one or two **clear causal mechanisms**: not only "what fell" but **why it may have fallen, through which channel it matters to Korean assets, and which observable development might alter that reading**.

## 2. Reusable story beats

1. **Hook (first 3 seconds):** the most compelling VERIFIED unusual move/new policy/report/contrast, not automatically the day's index close. Strong by specificity and truth, not sensational adjectives. Be precise about intraday vs close, actual vs expectation.
2. **What happened:** concise verified outcome with day, market/session, units. Show supporting numbers on screen instead of speaking an entire table.
3. **Why it matters:** link events to risk sentiment, foreign flows, earnings expectations, AI demand, FX, funding cost, oil, yields or export demand, as supported. State "one contributing factor"/"the market is concerned about" when causality is not established. Distinguish fact, market interpretation, and forward-looking possibility.
4. **Response / Korea read-through:** companies, industry/financial channels, policymakers; for policy: when effective, how mechanism may work, not a promise of recovery; preparation of a stabilization fund is not evidence of disbursement.
5. **What to monitor:** 1–3 specific verifiable signals (next capital flows, SOX chip performance, macro release, central-bank decision, actual buybacks, USD/KRW, etc.) and conditions that could shift expectations.
6. **CTA:** a single topic-specific **OPEN question**, then a warm invitation to comment and follow this personal channel.

Each scene MUST add a distinct fact, causal link or next checkpoint. Avoid two consecutive scenes that only repeat "bán ròng", "giảm mạnh", "rủi ro lớn". If multiple unrelated stories are selected for a digest, transition clearly without asserting they share a single cause. Keep voice naturally paced: user reviews a fully rendered MP4 after production, not a silent preview before rendering.

## 3. Voice delivery — concise, natural, analytical

Prefer natural transitions: "Kết thúc phiên…", "Điểm đáng chú ý hơn nằm ở…", "Áp lực này truyền sang nhóm … qua …", "Ở chiều ngược lại…", "Biện pháp mới giúp … nhưng …", "Trong các phiên tới, yếu tố cần theo dõi là…".

AVOID filler and mechanically repeated sentences: "Đây là…", "Đây là những con số…", "Một phiên giảm mạnh không tự xác nhận xu hướng…", "Trong bối cảnh…" and "Điều này cho thấy…" without new support. It is fine to use a short technical qualifier such as "đây là dữ liệu KRX, không phải NXT" WHEN materially necessary, but visual source/session labels are often better. No mandatory conclusion at the end of every scene.

Use spoken Vietnamese naturally for critical numbers and company names; don't narrate every number already overlaid. On-screen typography can contain exact 4,708.54 or -3.31% while speech explains a move and its economic relevance. Retain qualifiers for dates, high/low, KRX vs NXT, forecast vs actual, and uncertain claims.

## 4. Personal-channel CTA — OPEN QUESTION plus invitation

**Default format:** [one open-ended question directly arising from the main news and an observable driver] + [one friendly, brief invitation to comment and follow]. The owner's preferred closing rhythm:

"Theo mọi người, tín hiệu nào sẽ cho thấy thị trường bắt đầu ổn định trở lại? Hãy chia sẻ góc nhìn tại phần bình luận và theo dõi kênh để cùng cập nhật những diễn biến mới nhất về thị trường nhé!"

Adapt the OPEN question to the story instead of reciting this identical question in every video. Rotate brief natural follow-up phrases:
- "Mọi người đang theo dõi chỉ báo nào nhất? Chia sẻ ở phần bình luận và theo dõi kênh để cập nhật các diễn biến tiếp theo nhé."
- "Theo anh chị, điều kiện nào cần thay đổi để áp lực này dịu bớt? Để lại góc nhìn bên dưới và theo dõi kênh nhé."
- "Mọi người muốn theo dõi diễn biến nào trong kỳ báo cáo tới? Cùng trao đổi trong phần bình luận và theo dõi kênh nhé."

DO NOT force binary choices ("tăng hay giảm?", "mua hay bán?", "dòng vốn hay chính sách?"), frame investment advice as a vote, demand personal portfolio/holdings, or stack like/comment/save/subscribe/bell requests. DO NOT say "theo dõi Korea Capital Insight" in spoken CTA. For comment-first episodes: cta.type=comment, cta.question contains the open question ending in ?, cta.spoken contains the question and invitation, cta.screenHeadline is the succinct question, cta.screenSubline can read "Bình luận góc nhìn · Theo dõi kênh". The runner appends cta.spoken to final voice audio ONCE; never duplicate its text in final scene voiceText.

CTA is a spoken script segment, NOT a post caption. **Post caption remains KR_NEWS/MACRO <50 Vietnamese words including hashtags; US_AM 50–100 Unicode characters including spaces/hashtags**. No hashtag limit is imposed on spoken lines; do not add hashtags to voice.

## 5. Mandatory specific adaptation by stream

| Stream (KST) | Opening and causal mechanism | Example OPEN question (do not use if not relevant) |
|---|---|---|
| KR_AM 08:00 | Verified new Korean policy/data/companies and last completed KRX session (never pretend yesterday's close is live); identify the catalyst and what might change at today's session | "Trong phiên hôm nay, mọi người quan tâm tín hiệu nào nhất để đánh giá tâm lý thị trường?" |
| GLOBAL_US/US_AM 09:00 Mon–Sat | Lead with important verified LAST COMPLETED US session data; trace US SOX/AI, Fed, yields or USD -> Korean chips, export demand, funding costs or KRX sentiment. Note DST and session date. Do not read index percentages without Korea impact. | "Theo mọi người, tín hiệu nào từ Phố Wall sẽ tác động rõ nhất tới thị trường Hàn Quốc trong phiên tới?" |
| KR_MID 12:00 conditional | Produce ONLY after material NEW information since KR_AM. State precisely what changed and why assumptions/sector expectations shifted. No material event = no video. | "Thông tin mới này khiến mọi người chú ý đến yếu tố nào trong phần còn lại của phiên?" |
| KR_CLOSE 17:00 | Lead with actual unusual KRX close/intraday low/sidecar/flows and then explain global drivers, chip weakness, flows or policy as the evidence permits | "Điều gì sẽ là tín hiệu rõ nhất cho thấy thị trường đang dần ổn định?" |
| MACRO21 21:00 | Lead with fresh macro data/policy and transmission BOK/Fed -> yields, borrowing cost, USD/KRW, firms/households; not a KR_CLOSE rehash. Actual vs forecast, lag, date matter | "Theo anh chị, số liệu nào ở kỳ công bố tới sẽ giúp đánh giá rõ hơn tác động của chính sách?" |

These are STYLE EXAMPLES ONLY, never market facts ready for today's script. Cross-check exact source/time/units before speaking. The US morning bulletin is NOT exempt from personal-channel CTA, causal analysis or evidence checks.

## 6. Pre-voice editorial self-QC (not a new hard validator)

Before creating paid Vbee job, the producer checks:
- Is the hook concrete, truthful, and interesting from the first seconds?
- Does the story explain WHY and at least one financial/industrial transmission channel?
- Is the cause qualified correctly, separate from interpretation and predictions?
- Is scene 2 not a restatement of scene 3? Does each beat add genuine value?
- Are government policy decided vs planned vs funded stages differentiated?
- Is "what to watch" specific and falsifiable rather than a generic admonition?
- Is CTA a genuine topic-specific open question with one friendly follow invite?
- Does speech sound like a PERSONAL finance-news narrator (not corporate KCI PR), with no repeated filler or spoken spreadsheet?
- Are critical numbers/date/session/market sources correct?

Store editorial evidence in brief as newsroomStyle=PERSONAL_FINANCIAL_NEWSROOM_V1, with a short causalMechanism, koreaReadThrough, watchSignals, and openQuestionCTA. Optionally also store newsroomStyle on job JSON; this flag does not auto-edit actual voiceText. If copy is weak, fix SCRIPT BEFORE paid Vbee; keep existing safety/source/technical validations, avoid adding brittle "AI-like phrase" regex blocks.

## 7. Non-negotiable operations

The existing schedules, stream quotas, conditional midday gate, Vbee Anh Khôi voice code, job schema, original KCI News Sheet, no duplicate paid TTS, render first then owner reviews playable MP4, TRUE QC and CHỜ DUYỆT / CHƯA ĐĂNG remain unchanged. This style migration does NOT regenerate or publish previously produced MP4s, add new schedules, switch repo, bypass securities-source checks, or make GitHub ZIP count as ChatGPT video delivery.
