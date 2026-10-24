---
name: kci-news-video
description: Produce Korea Capital Insight Vietnamese Korea-stock and macro news, from a verified brief and strong truthful hook to script, follow/comment/save CTA, Vbee Tuấn Anh News narration, Remotion motion graphics, and MP4 quality control. Use for "bản tin KCI", "video chứng khoán Hàn Quốc", "brief vĩ mô", "kịch bản hook và CTA" and recurring news-video requests.
---

# KCI News Video — Production Skill v2.0

The owner approved Korea Capital Insight financial-news styling, the Vbee voice `n_hanoi_male_tuananhnews_news_vc` (Tuấn Anh News), and the Remotion V2.1 design direction. Preserve those decisions. The purpose of this skill is a **repeatable source-backed Vietnamese financial newsroom**, not a static slideshow.

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

For a 60–110-second video, choose **one central news angle and three to five strongest facts**, not the entire long brief. Record sources and exact claim IDs, KST cutoff, market sessions, units and uncertainty in the job.

### 2 — Honest hooks and narrative

Read [HOOK_CTA.md](references/HOOK_CTA.md). Generate three evidence-backed hooks (reversal/contrast, investor impact, and a precise question); score specificity, factuality, relevance, curiosity and spoken length. Pick one. Explain the hook promptly; don't hide crucial facts behind artificial suspense.

Script: **HOOK → WHAT HAPPENED → WHY → KOREA IMPACT → WHAT'S NEXT → CTA**. Write natural short Vietnamese sentences suited to the selected voice. Separate on-screen numeric notation from clear voice pronunciation. Every number or company claim requires a source.

### 3 — One meaningful CTA

Pick one primary purpose: `comment` (balanced, answerable question), `follow` (specific news value), or `save` (evergreen analysis/checklist). A subtle follow request may accompany a primary comment invitation, but not a stack of three commands.

Place CTA near the closing 10–20% after the core value. New schema v2 stores `cta.spoken` once outside `scenes[].voiceText`. The production runner **appends that CTA to the final Vbee narration segment**; the video template displays corresponding on-screen language. Do not duplicate spoken CTA in the outro script.

Example for an index reversal: "Theo anh chị, đây là hồi phục bền vững hay chỉ là nhịp hồi kỹ thuật? Bình luận góc nhìn và theo dõi Korea Capital Insight để cập nhật các phiên tiếp theo."

### 4 — Reviewed JSON job

Use [jobs/kci-schema-v2-example.json](../../../jobs/kci-schema-v2-example.json) as the schema example. New jobs use `schemaVersion: 2`, `sourceLedger`, `hook`, `cta` and source-linked scenes with visuals. Validate **before** calling paid TTS:

`node scripts/validate-kci-job.mjs jobs/kci-YYYY-MM-DD-topic.json`

The validator checks source references, the hook beginning, CTA completion and job structure; it cannot itself establish that third-party facts are true. Never relabel the archived 23 October 2026 news as today's news.

### 5 — Vbee + Remotion

- Voice: `n_hanoi_male_tuananhnews_news_vc`; Cloudflare callback: `https://kcinews.golffashion-vn.workers.dev/api/vbee-callback`.
- First use or voice change: request a short trial and listen. After approval, generate Vbee MP3 for each scene with real durations and retain them.
- New schema v2 jobs render via data-driven `KciNewsDaily`. The historical `KciNewsV2` is the **approved 23/10 benchmark**, but contains some hard-coded numbers; don't reuse its historic charts for current jobs.
- Generate captions from narration; word-count timing is **estimated**, never claim it is forced aligned. Review and correct before publishing.
- Motion visuals must be sourced/parameterized. 9:16 at 1080×1920, 30 FPS, H.264/AAC.
- **Mandatory Reels-safe composition**: the real Instagram screenshot showed the masthead obscured by top controls and subtitles, ticker, account overlay obscuring the lower region. Use `src/KciReelsSafe.tsx` constants; keep essential brand, hook, verified numbers, legends, subtitles and CTA within the central editorial safe zone (on 1080×1920: x=70–862 and y=260–1455). Reserve the right 218px interaction rail, top 260px, bottom 465px for platform UI; animation/background can fill the frame. For the daily template, safe captions sit near y=1284–1409 and CTA near y=1068–1225 with no overlap. Avoid important tickers or legal/source labels in bottom UI area. QC with safe-guide frame previews; do not render the guides in publication files.
- For visual-only revisions when scripts have not changed, reuse the original preserved Vbee audio/artifact. No needless TTS calls.

### 6 — QA and release

Read [QC.md](references/QC.md). Inspect actual frame samples from opening, middle, CTA and outro; check no black frames, overflowing Vietnamese, improper session labels or faulty source footnotes; ensure voice audio exists and CTA is spoken. Status remains `REVIEW_REQUIRED` until explicitly accepted.

Deliver MP4 (or a verified authenticated GitHub artifact), a source ledger, script, optional thumbnail/caption, and a concise QC summary. If blocked, report exact obstacle and preserve existing audio. Don't pretend ongoing GitHub jobs succeeded.

## Run from ChatGPT

This is a **repository-local Agent Skill** in `nvt91/kcinews`. It does **not** automatically become a selectable ChatGPT @ plugin. The owner may simply say "Dùng quy trình kci-news-video, tạo bản tin KCI tối nay"; then the assistant can follow the skill, research current sources, create/update a reviewed job through connected GitHub tools, start the verified workflow, inspect artifacts and return a video. No need to direct the owner to Codex for each edition.

Existing owner-authored GitHub issue triggers: `[KCI VOICE TEST]` and `[KCI VIDEO]`; issue body uses `{"job":"jobs/kci-YYYY-MM-DD-topic.json"}`. Run modes do not confer permission to publish.

Schedules for morning/evening written briefs and any social-media publication are separate automations. **This skill does not silently enable auto-posting.**
