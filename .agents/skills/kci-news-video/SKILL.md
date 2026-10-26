---
name: kci-news-video
description: Produce Korea Capital Insight Vietnamese Korea-stock and macro news, from a verified brief and strong truthful hook to script, follow/comment/save CTA, Vbee Anh Khôi Tin tức narration, Remotion motion graphics, and MP4 quality control. Use for "bản tin KCI", "video chứng khoán Hàn Quốc", "brief vĩ mô", "kịch bản hook và CTA" and recurring news-video requests.
---

# KCI News Video — Production Skill v2.0

The owner approved Korea Capital Insight financial-news styling, selected the Vbee voice `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức) on 26 October 2026, and approved the Remotion V2.1 design direction. Preserve those decisions. The purpose of this skill is a **repeatable source-backed Vietnamese financial newsroom**, not a static slideshow. Read [VOICE_PROFILE.md](references/VOICE_PROFILE.md) for the current selection, trial/listening gate and preservation of historical narration; a saved voice code is not proof of successful synthesis or listening approval.

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
6. [Nine-step post-production and review-before-final gates](references/POST_PRODUCTION.md)

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

- Voice: `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức); Cloudflare callback: `https://kcinews.golffashion-vn.workers.dev/api/vbee-callback`.
- First use or voice change: request a short trial and listen. After approval, generate Vbee MP3 for each scene with real durations and retain them. Follow [VOICE_PROFILE.md](references/VOICE_PROFILE.md); do not claim the new voice has already passed a live test, and do not regenerate old clips merely to change the default.
- New schema v2 jobs render via data-driven `KciNewsDaily`. The historical `KciNewsV2` is the **approved 23/10 benchmark**, but contains some hard-coded numbers; don't reuse its historic charts for current jobs.
- Generate captions from narration; word-count timing is **estimated**, never claim it is forced aligned. Review and correct before publishing.
- Motion visuals must be sourced/parameterized. 9:16 at 1080×1920, 30 FPS, H.264/AAC.
- **Instagram/Facebook Reels viewing safety:** use the active `KciNewsReels` behind composition ID `KciNewsDaily`. Follow the owner's *latest* full-width middle layout in [QC D1](references/QC.md#d1-full-width-middle-layout--revised-owner-feedback-24-october-2026): title/charts can use x56–1024 in the middle; only lower caption/source/CTA areas reserve a right-side interaction rail (x56–914); leave top 264px and bottom 480px free of critical text. Check actual app overlays and do not narrow the whole canvas into a boxed column.
- For visual-only revisions when scripts have not changed, reuse the original preserved Vbee audio/artifact. No needless TTS calls.

### 5B — Nine-stage visual/audio post-production (adaptive to media)

Read [POST_PRODUCTION.md](references/POST_PRODUCTION.md) on **every video run**, including all scheduled KCI editions. Source class is `NEWS_GRAPHICS` (default Vbee/Remotion), `TALKING_HEAD` (only actual supplied raw footage) or `MIXED`. For the normal TTS/graphics news, prioritize readable 0–3s hook, dynamic 2–4-word keyword/data callouts, event-driven effects, Reels-safe full middle, cleaned natural voice, effects-map timing and measured QC. **Do not invent human takes, face tracking, skin grading or before/after footage.** Whisper word timing, two-frame effect sync, loudness/true peak and encoder targets are only PASS when actually run/measured. Keep the stricter existing KCI Reels overlay safe area where it exceeds the owner's generic 220px top / 420px bottom / 140px right.

Generate a review MP4 and representative effect-map frame stills first; obtain owner feedback **before a separately approved final/export**. Keep daily automatic preview production running, but never mislabel a review file as `output/final.mp4`. Report measured values only; raw-footage/takes counters = N/A for graphics-only Vbee.

### 6 — QA and release

Read [QC.md](references/QC.md). Inspect actual frame samples from opening, middle, CTA and outro; check no black frames, overflowing Vietnamese, improper session labels or faulty source footnotes; ensure voice audio exists and CTA is spoken. Status remains `REVIEW_REQUIRED` until explicitly accepted.

Deliver a VERIFIED **review/preview** MP4 (or authenticated GitHub artifact), effect-map and per-scene review stills when available, a source ledger, script, optional thumbnail/caption, and concise QC summary. Export/label FINAL only after the owner approves that specific cut. Include source/edited durations and counts of actually removed silences/takes; report N/A or not measured, not invented values. If blocked, report exact obstacle and preserve existing audio. Don't pretend ongoing GitHub jobs succeeded.

## Run from ChatGPT

This is a **repository-local Agent Skill** in `nvt91/kcinews`. It does **not** automatically become a selectable ChatGPT @ plugin. The owner may simply say "Dùng quy trình kci-news-video, tạo bản tin KCI tối nay"; then the assistant can follow the skill, research current sources, create/update a reviewed job through connected GitHub tools, start the verified workflow, inspect artifacts and return a video. No need to direct the owner to Codex for each edition.

Existing owner-authored GitHub issue triggers: `[KCI VOICE TEST]` and `[KCI VIDEO]`; issue body uses `{"job":"jobs/kci-YYYY-MM-DD-topic.json"}`. Run modes do not confer permission to publish.

Schedules for morning/evening written briefs and any social-media publication are separate automations. **This skill does not silently enable auto-posting.**
