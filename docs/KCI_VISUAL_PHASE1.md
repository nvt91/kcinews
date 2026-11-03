# KCI — Phase 1: cinematic, source-safe visual storytelling (opt-in)

Status: experimental Pull Request; **NOT enabled in production** until review, CI and a rendered comparison using an existing *authorized* voice track. This iteration adds no paid GPU/TTS calls and does not modify news schedules or automatic publication permissions.

## Goal

Make 60–110-second KCI Vietnamese news reels visually engaging **without falsifying market movement**. Remotion remains the deterministic, data-backed editor. Vbee voice and original dynamic chart data remain untouched. Licensed or AI-generated image files are optional, illustrative B-roll; the final story continues to be source-led.

### Selected technologies and scope

- **Remotion first**: enable a per-scene cinematic headline reveal; use a restrained animation with new words entering from within the existing verified scene headline. This is *visual pacing*, not verified word-onset matching.
- **mflux on an Apple Silicon Mac (optional)**: offline image generation of generic chip factories, server halls, energy infrastructure and other **clearly illustrative** subjects. It is not a required runtime/CI dependency.
- **Qwen-Image-Edit-2509 (optional, GPU environment)**: manually refine/standardize a visual, subject to the separate weights/license/source checks. Do not run this model inside GitHub Actions.
- **WAN / ComfyUI-WanVideoWrapper (phase 2 only)**: GPU-intensive 3–5 second illustrative clips. Not included in this PR.
- **ViMax (planning reference)**: storyboarding ideas only; do not copy arbitrary generated financial facts into the ledger.
- **LivePortrait / LongCat (separate MC experiment)**: not installed. No face avatars, likenesses or consent assumptions; not in the standard KCI reporting pipeline.

## Opt-in JSON schema fields

Add these fields to an eligible `scene.visual` block **only after the actual local image has been added and reviewed**:

```json
{
  "kind": "company",
  "company": "Semiconductor sector",
  "bullets": ["ĐẦU TƯ AI", "ĐÀO TẠO NGUỒN LỰC"],
  "motionStyle": "cinematic",
  "assetPath": "assets/kci/semiconductors/fab-interior.webp",
  "assetKind": "ai-illustration",
  "assetCredit": "mflux offline illustration; original prompt retained in editorial source inventory"
}
```

For a legitimately licensed photograph, set `assetKind: "licensed-photo"` and record the actual license/source in `assetCredit`. The renderer labels image-backed scenes as **HÌNH MINH HỌA AI** or **ẢNH MINH HỌA**, instead of presenting an AI scene as a photograph of an actual news event. Never add fabricated logos, headlines, market figures, price charts or company statements through the image model.

- Only reviewed repository-local `public/assets/kci/.../name.webp` (`png`, `jpg` also accepted) are allowed.
- Runtime job path is relative to `public/`, starting `assets/kci/`; no `https://`, paths outside `public/`, dot segments, or filesystem traversal.
- All image references are validated **before Vbee**, including file existence, explicit `assetKind` and source/rights description `assetCredit`. Unreferenced old jobs remain unchanged.
- `motionStyle: "cinematic"` works with or without an image. Existing jobs without this field retain their original headline animation.
- Image is displayed with a subtle Ken Burns-style scale/pan, dimmed behind the scene's original *data-backed visual*. Financial units, dates, qualifiers and source labels remain structured props, not baked into synthetic images.
- No external model or network request occurs when Remotion renders; checked-in images are bundled as regular static assets.

## Editor checklist

1. Write/verify source ledger, claim IDs and local-market cutoff as usual. Mark any illustrative still `NOT_DATA_SOURCE` in editorial notes.
2. Draft a generic photographic-style illustration prompt. Example: *"Wide cinematic illustrative scene inside a modern semiconductor fabrication facility, atmospheric perspective, cleanroom equipment, no people recognizable, no brand logos, no charts, no legible text, designed as a subtle dark-blue news background, 16:9"*. Keep a copy of the prompt, model checkpoint/version, generation date, and image output. Verify no third-party trademark or source-claim confusion.
3. Inspect visual for misleading real-world context; crop/optimize to WEBP. Suggested 16:9 source, ≥1200px wide, aim ≤2 MB per still; verify the actual frame in 1080×1920 portrait after crop.
4. Put under `public/assets/kci/` with a topic subfolder. Add the JSON metadata to **only** the intended scene(s). If file is absent, the validator must block the asset path before any paid Vbee.
5. Run `node scripts/validate-kci-job.mjs jobs/<reviewed>.json`, `node scripts/test-kci-visual-assets.mjs` and `npm run lint`. Run a local **silent** visual still for comparison first. Do not call Vbee while testing graphics.
6. Inspect before/after stills at hook 0–3s and every asset-backed scene, viewport safe-zone top220/bottom420/right140, legibility, end frames and whether labels overlap. Verify the source text and graphics still match the job's claims.
7. For owner approval of a real video, use the existing `mode=video`/owner issue workflow with the verified Vbee audio. Only deliver a real playable MP4 with caption, honest QC scope, `CHỜ DUYỆT — CHƯA ĐĂNG`; optional visual features are never new blocking prerequisites for other editions.

## Constraints

- No new cron, new scheduled task, auto-publish, notifications, personal portfolio or credentials.
- No unverified image/model downloads, billed APIs or licensed-asset redistribution.
- No charts made from image generation; all numeric/data graphics must be grounded in the existing `sourceLedger` and original scene props.
- No claim of actual Whisper ±2-frame synchronization; this PR adds **presentation motion only**, and does not change soundtrack/timing.
- Existing render path remains `KciNewsDaily` (implemented by `src/KciNewsReels.tsx`), so the optional asset is displayed only by this active composition. Historical `KciNewsV2` remains intact.
- A short visual experiment is not acceptance of an entirely new automatic production pipeline. Before merging, CI and at least one actual screenshot-based safe-zone review are needed.

## Suggested phase-2 additions (not part of PR)

Build a small, reviewed topic library of 3–5 second B-roll clips using a separate GPU workstation, then feed **locally checked-in** clips into Remotion without generating on Actions. Test video duration/performance and licensing separately. A presenter-avatar trial would be a different explicit approval, not an automatic newsroom feature.
