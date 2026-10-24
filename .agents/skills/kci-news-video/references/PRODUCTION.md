# KCI Production Contract: ChatGPT → GitHub → Vbee → Remotion

## Existing verified components
- Private repo: `nvt91/kcinews`
- Cloudflare health/callback: `https://kcinews.golffashion-vn.workers.dev/api/vbee-callback`
- Vbee voice code: `n_hanoi_male_tuananhnews_news_vc` (approved Tuấn Anh News)
- Render: Remotion 4, React/TypeScript, FFmpeg/ffprobe available through Actions (existing workflow)
- The historical benchmark `KciNewsV2` includes 23 October 2026 data **hard-coded in graphic components**. It must not serve new editions.
- The new composition `KciNewsDaily` consumes the facts and visual kind of v2 editorial jobs. Its look derives from the approved V2.1 style while keeping dates/numbers dynamically supplied.
- Social-platform template safety lives in `src/KciReelsSafe.tsx`: the active component `src/KciNewsReels.tsx` is registered as composition ID `KciNewsDaily` by `src/Root.tsx`. Use central bounds x=96–884, y=264–1440 for readable content in the 1080×1920 master. The header is below the top overlay, data panels above subtitles, CTA above captions, and bottom ticker is removed from the essential reading path. Revisit mobile crop examples after platform UI changes.
- To inspect a render with safe-area outlines, set `safeGuides: true` in the **preview-only** Remotion props. Production props omit this flag. A UI screenshot is the evidence for these conservative bounds; they are not a claim of an official universal Instagram safe-zone specification.
- Do not require Descript, Lovable or Codex for everyday ChatGPT-triggered production.

## Job structure
Use `jobs/kci-schema-v2-example.json` and run `node scripts/validate-kci-job.mjs <path>`. Important fields:
- `schemaVersion` = 2, `id`, `edition`, `dataAsOf` ISO timestamp with +09:00, `headline`, `status` = REVIEW_REQUIRED.
- `sourceLedger[]`: `id` / `title` / `url` / `eventDate` / `checkedAt` / `facts[]`. One claim can cite multiple sources; no orphan scene source ID.
- `hook.spoken`: must be the opening words of first scene `voiceText`.
- `cta`: one primary CTA with spoken + visual texts.
- `scenes[]`: unique id, eyebrow, headline, summary, voiceText, source, sourceIds[], stats[] and `visual`.
- `visual.kind` maps to one of `reversal`, `comparison`, `company`, `risk-bars`, `spotlight`, `rate`, `closing`, `generic`.
- Where bars represent numeric observations, `visual.bars[]` contains actual signed values with units/labels. No interpolation of unseen price ticks.
- For reversal, `visual.milestones[]` are **discrete confirmed checkpoints** with labels such as OPEN/LOW/CLOSE, not a sampled time series.

## Main pipeline
1. Editorial agent researches/verifies, writes the brief, source ledger, 3 scored hooks, scene voice lines and CTA.
2. Save reviewed `jobs/kci-YYYY-MM-DD-topic.json` via connected GitHub. Use unique event/story id; don't overwrite approved prior editions.
3. Run `node scripts/validate-kci-job.mjs jobs/<file>.json`. The production runner calls the same validator for schema v2 before any voice generation.
4. Test Vbee voice for a new speaker (or material change). For approved Tuấn Anh News, generate/retain segment MP3s. The last segment appends the CTA exactly once.
5. Poll Vbee by authenticated request ID, accept only validated HTTPS audio hosts, and inspect MP3 duration with ffprobe. On failed render preserve audio segments; do not blindly repeat paid POSTs on timeout.
6. Build `props.json` including timing from actual audio and CTA object on the last scene. Render dynamic `KciNewsDaily` when schemaVersion 2; never silently fall back to old historical V2.
7. Extract screenshots of first 3 sec, main move, company, macro, CTA and outro. Check that date, numbers, labels and sources match the ledger. Audio must be present in final MP4. Subtitle timings are only approximate if word-count based.
8. Package artifact MP4, source/job JSON, voice transcript, optional SRT/thumbnail, QC status. No upload to Facebook/Instagram/website without approval.

## Direct ChatGPT execution via GitHub connector
On default branch with v2 job, the current authorized path is:
- GitHub Issue by repository owner: title `[KCI VIDEO] 2026-10-24 morning` (or `[KCI VOICE TEST] ...`)
- JSON body `{"job":"jobs/kci-2026-10-24-morning.json"}`
- Workflow `.github/workflows/kci-video.yml` must be on `main` and must use review-only artifacts.
- A GitHub issue triggers production, NOT a social post. Check workflow completion, retrieve artifact, inspect, then deliver link.

The legacy `[KCI V2 QUICK]` workflow is bound to the Oct 2026 archived 7-MP3 artifact; it is **not** a universal daily renderer.

## Security and cost
- `VBEE_APP_ID` and `VBEE_API_TOKEN` are GitHub Secrets. They must never appear in code, issue body, published article, data artifact or ChatGPT message.
- Existing Cloudflare Worker is notification-only. It cannot trigger synthesis or verify the identity of a market-data source.
- Use the exact allowlisted external Vbee S3 host observed from production, not an unrestricted internet audio URL.
- Render artifact retention is limited by Actions policy; maintain archival copies as needed.
- Voice credits and GitHub Actions runtime can have costs, but a paid Vbee subscription already exists. Don't block approved content solely out of generic cost concern; do avoid unnecessary duplicate generation.
