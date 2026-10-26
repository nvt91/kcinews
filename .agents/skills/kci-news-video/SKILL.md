---
name: kci-news-video
description: Produce Korea Capital Insight Vietnamese Korea-stock and macro news, from a verified brief and strong truthful hook to script, follow/comment/save CTA, Vbee Anh Khôi Tin tức narration, Remotion motion graphics, and MP4 quality control. Use for "bản tin KCI", "video chứng khoán Hàn Quốc", "brief vĩ mô", "kịch bản hook và CTA" and recurring news-video requests.
---

# KCI News Video — Production Skill v2.0

The owner approved Korea Capital Insight financial-news styling, selected the Vbee voice `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức) on 26 October 2026, and approved the Remotion V2.1 design direction. Preserve those decisions. The purpose of this skill is a **repeatable source-backed Vietnamese financial newsroom**, not a static slideshow. Read [VOICE_PROFILE.md](references/VOICE_PROFILE.md) for the current selection, trial/listening gate and preservation of historical narration; a saved voice code is not proof of successful synthesis or listening approval.

## Mandatory new-edit override — owner request, 26 October 2026

Read [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md) on every new production or revision. Profile `KCI_EDIT_20261026_V1` incorporates the owner's nine editing stages: take selection/Whisper word timing, waveform-protected trimming, footage-only grading/eye zoom, keyword-only graphics, measured effects map, first-three-second hook, audio mastering, and **voiced PREVIEW → explicit owner approval of that cut → FINAL**. The scheduled producer stops at preview, not final. Do not confuse preview approval with permission to publish.

This profile takes precedence over conflicting historical editing defaults below and in references: use Inter Bold around68px, white/navy#1c2c58/blue#365daa, keyword cues2–4words (not full-sentence burned-in captions), owner safe zone top220/bottom420/right140 at1080x1920, master-14LUFS/true peak<=-1dBTP, and approval-gated final H.264 around18Mbps/AAC320kbps. Recorded footage retains its established source FPS; graphics-only keeps30fps. Preserve source/date/unit qualifiers and full-width use of the AVAILABLE middle, without an enclosing cramped card.

Classify real recorded-takes versus TTS/motion first. Do not invent camera takes, faces, glances, color before/after or edit statistics for generated narration. Word timing must be measured/reviewed on actual edited audio; proportional estimates cannot pass the two-frame effect gate. Read current code/capabilities before paid TTS or a legacy trigger: storing this specification does not install Whisper/face tracking or prove end-to-end support. Report missing stages honestly and never bypass the preview gate. Keep schedules, stream separation, quota, source verification, current Anh Khôi voice, caption-copy preferences, credentials and all historical output unchanged. Preview/final stage labels, notification dedup and Sheet handling are specified in EDITING_WORKFLOW.md.

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

The validator checks source references, the hook beginning, CTA completion and job structure; it cannot itself establish that third-party facts are true. Never relabel the archived 23 October 2026 news as today's news. Save the editing profile, capability assessment, effect map and preview stage in the editorial record; do not assume adding a JSON field changes renderer behavior.

### 5 — Vbee + Remotion + owner editing profile

- Voice: `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức); Cloudflare callback: `https://kcinews.golffashion-vn.workers.dev/api/vbee-callback`.
- First use or voice change: request a short trial and listen. After approval, generate Vbee MP3 for each scene with real durations and retain them. Follow [VOICE_PROFILE.md](references/VOICE_PROFILE.md); do not claim the new voice has already passed a live test, and do not regenerate old clips merely to change the default.
- New schema v2 jobs render via data-driven `KciNewsDaily`. The historical `KciNewsV2` is the **approved23/10 benchmark**, but contains some hard-coded numbers; don't reuse its historic charts for current jobs.
- Follow all applicable stages in [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md). Whisper each actual narration/source clip, review cuts against waveforms and align the edited audio. Show keyword/number cues, not full-sentence rolling captions. Word-count timing remains an estimate and cannot establish the required two-frame effects synchronization.
- Motion visuals must be sourced/parameterized.9:16 at1080×1920; pure graphics30fps, camera footage FPS per the editing profile. Preview first; final encoding only after owner approval.
- **Instagram/Facebook Reels viewing safety:** the active `KciNewsReels` is behind composition ID `KciNewsDaily`. The latest owner profile is top220px/bottom420px/right140px for essential content, with meaningful boxes at y220–1500,x<=940. Use the available middle width, not a narrow boxed column. The former x56–1024/top264/bottom480 layout in QC D1 is historical; EDITING_WORKFLOW step5 governs new work. Verify entry/exit states and actual app overlays rather than claiming universal platform safety.
- For visual-only revisions when scripts have not changed, reuse original preserved Vbee audio/artifact. No needless TTS calls.

### 6 — QA, preview approval and final export

Read [QC.md](references/QC.md) and the overriding [EDITING_WORKFLOW.md](references/EDITING_WORKFLOW.md). Inspect actual frame samples for EVERY mapped beat, opening/middle/CTA/outro, nearby onset frames, source/time labels and waveform/audio joins. Do not claim checks that were not performed.

Deliver the real voiced `output/preview.mp4`, beat stills, takes/edit log, source ledger, script, caption and measured QC metrics. Stop with `PREVIEW_READY — CHỜ ANH DUYỆT — CHƯA RENDER FINAL — CHƯA ĐĂNG`. Unresolved checks mean PREVIEW_QA_REQUIRED or BLOCKED, not a final-quality pass. Only explicit owner approval of that identified preview cut authorizes `output/final.mp4`; it does not authorize posting. Preserve approval provenance and recheck time-sensitive facts before a delayed final. An edited cut requires renewed approval.

If blocked, report the exact obstacle and preserve existing audio. Do not pretend ongoing GitHub jobs succeeded or a new document implements unsupported media tooling.

## Run from ChatGPT

This is a **repository-local Agent Skill** in `nvt91/kcinews`. It does **not** automatically become a selectable ChatGPT @ plugin. The owner may say "Dùng quy trình kci-news-video, tạo bản tin KCI tối nay"; the assistant follows the skill, researches current sources, prepares a reviewed job through connected GitHub tools, verifies that a preview-only route supports the applicable editing gates, inspects artifacts and returns a preview. No need to direct the owner to Codex for every edition when that supported route is available.

Existing owner-authored issue triggers are `[KCI VOICE TEST]` and `[KCI VIDEO]`; body uses `{"job":"jobs/kci-YYYY-MM-DD-topic.json"}`. These historical trigger names do NOT establish preview-stage compliance or permission to render final. Inspect the live workflow/runner first; missing required capability must be reported before paid synthesis. No credentials/workflow rewrite or new billed service is implied merely by this specification update.

Schedules and social publication are separate. **This skill does not silently enable auto-posting.**
