# Korea Capital Insight — Daily News Video Engine

Video newsroom for **Korean equities and macroeconomic news in Vietnamese**. Converts a freshly sourced KCI news brief into a verified hook/script, an engagement CTA, **Vbee Anh Khôi Tin tức** narration and data-driven **Remotion / FFmpeg** motion graphics.

## The complete skill

**Name:** `kci-news-video`  
**Source:** [`.agents/skills/kci-news-video/SKILL.md`](.agents/skills/kci-news-video/SKILL.md)

Selected voice for NEW videos (26/10/2026): `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc`. Older videos retain their original narration; selection must be confirmed with a real Vbee voice sample before audio quality can be approved.

Inside the skill:
- `references/EDITORIAL_BRIEF.md` — freshness, data cutoff, filings, Korean impact and source ledger
- `references/HOOK_CTA.md` — three fact-based hooks, voice script and a meaningful comment/follow/save CTA
- `references/PRODUCTION.md` — Vbee + Remotion + GitHub Actions runbook
- `references/QC.md` — editorial, audio, motion, subtitle and publication release gates
- `templates/DAILY_BRIEF.md` — narrative brief template

The historical 23 October 2026 video is the approved V2.1 design reference; new episodes use the **`KciNewsDaily`** template, not historical hard-coded stock prices.

## Request it from ChatGPT

Say, for example:

> Dùng quy trình kci-news-video, tạo bản tin KCI tối nay. Kiểm chứng tin mới, chọn hook mạnh, viết kịch bản tiếng Việt, có lời mời bình luận và theo dõi, dựng video 9:16 bằng giọng Anh Khôi Tin tức. Xuất bản nháp cho tôi duyệt, chưa đăng.

This is a **repository-local Agent Skill**, not an automatically installed ChatGPT @ plugin. A connected GitHub workflow can be operated from ChatGPT without a separate Codex prompt per video.

## Required publication safeguards

No fabricated prices, chart paths or fake news footage. Quote verified market-session timestamps. Always produce a *spoken* and on-screen CTA after delivering informational value. Do not release without Vbee audio, inspected MP4 and the owner's approval.

Secrets `VBEE_APP_ID` and `VBEE_API_TOKEN` remain only in GitHub Actions Secrets.

## Render first — owner reviews the video (27 October 2026)

Every scheduled KCI producer creates the **complete MP4 with Vietnamese Anh Khôi voice, motion graphics, hook and CTA** before delivery to the owner. The owner reviews the actual encoded video for content and quality; there is no requirement to pre-approve a storyboard or render the unchanged video a second time after approval. Rendering is not permission to post. If a supported technique such as word-alignment precision hasn't been executed, report the QA limitation honestly without claiming a pass or silently withholding an otherwise playable sourced MP4. See [EDITING_WORKFLOW.md](.agents/skills/kci-news-video/references/EDITING_WORKFLOW.md) and [QC.md](.agents/skills/kci-news-video/references/QC.md). All existing schedules and Vbee credentials remain unchanged.

## New daily episode workflow

1. Research new KST news and assemble a verified brief with precise source URLs.
2. Write three hooks, choose and validate one, write scene voiceText + one job-level CTA.
3. Create `jobs/kci-YYYY-MM-DD-topic.json` based on `jobs/kci-schema-v2-example.json` (archived demonstration, **not** live data).
4. Validate the job: `node scripts/validate-kci-job.mjs jobs/<filename>.json`.
5. Test or approve the voice. The workflow appends `cta.spoken` to the final Vbee narration segment exactly once.
6. Render with `KciNewsDaily`. Estimate captions initially; human-check sync.
7. Inspect the actual H.264/AAC video, all source labels, CTA and typography; deliver for approval, **not for automatic posting**.

New jobs use schema v2 and KST `dataAsOf`. An archival 2026 video must never be treated as today's quote.

## Development

`npm ci`  
`npm run dev`  
`npm run lint`  
`node scripts/test-kci-editorial.mjs`  
`node scripts/create-daily-preview-props.mjs`  
`npx remotion still src/index.ts KciNewsDaily out/daily-preview.png --props=out/kci-daily-preview-props.json --frame=1830`

GitHub Actions runs a safe PR check (lint, editorial validation, hook/CTA, rendered frames). A production issue `[KCI VIDEO]` with body `{"job":"jobs/kci-YYYY-MM-DD-topic.json"}` starts review-only generation from the default branch.

**No publishing automation is enabled by this repository.** A separate daily brief at 22:00 KST may supply editorial input, but the skill itself does not automatically turn scheduled briefs into uploaded videos.
