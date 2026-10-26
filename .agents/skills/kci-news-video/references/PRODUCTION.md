# KCI Production Contract: ChatGPT → GitHub → Vbee → Remotion

## Current runtime and approval boundary — 26 October 2026

Read [EDITING_WORKFLOW.md](EDITING_WORKFLOW.md) for the owner's nine-step profile and [ALIGNED_PREVIEW_RUNTIME.md](ALIGNED_PREVIEW_RUNTIME.md) for executable commands, editing-plan fields and honest QA limits.

The schema-v2 `preview` path now creates a voiced review MP4 from real Vbee audio and Whisper word alignment. `video` is a backward-compatible alias for PREVIEW, not automatic final. An owner `[KCI VIDEO]` issue also stops at voiced preview. A new job MUST include a reviewed `editingPlan` or `editingPlanPath`; the template cannot invent an effects map. `validate` stays no-TTS. Do not reuse the earlier silent preview or word-count captions as evidence of word alignment.

Preview delivery is `output/preview.mp4` plus every-beat stills and measured logs. Output `output/final.mp4` only after the owner explicitly approves the specific preview/cut and required listening/factual/sync QA passes. Final uses1080x1920,H.264 target18Mbps,AAC320k; motion-only retains30fps. The current executable route is TTS/motion only, not automatic face tracking or camera editing. Real footage requires its own validated input/FPS/take/face pipeline; do not silently process it as TTS.

## Components
- Private repo `nvt91/kcinews`.
- Cloudflare callback `https://kcinews.golffashion-vn.workers.dev/api/vbee-callback`.
- Owner-selected Vbee code `n_hanoi_male_anhkhoitintuc_zero_shot_news_vc` (Anh Khôi Tin tức). Read [VOICE_PROFILE.md](VOICE_PROFILE.md); configuration is not proof of successful synthesis or listening approval.
- Remotion4,React/TypeScript,FFmpeg/ffprobe; CPU-only matching torch/torchaudio and stable-ts/faster-whisper installed by `scripts/install-alignment.sh`.
- `src/aligned-index.tsx` registers composition ID `KciNewsDaily` for the word-cued runtime. The historical entry/template remains for archived fixtures; it is not the new voiced-preview route.
- Historical `KciNewsV2` contains hard-coded23October data and must not serve new episodes. No Descript/Lovable/Codex requirement for routine production.

## Reviewed job structure

Use the existing schema-v2 example and validator, preserving all source fields:
- `schemaVersion:2`,unique`id`,`edition`,`dataAsOf`KST timestamp,headline,statusREVIEW_REQUIRED.
- `sourceLedger[]` withid,title,url,eventDate,checkedAt,facts; every claim's sourceIds point to actual evidence.
- `hook.spoken` starts the firstscene.voiceText.
- `cta.spoken` lives once outside scenes and is appended once to the last narration segment. Do not duplicate it.
- scenes haveuniqueid,eyebrow,headline,summary,voiceText,source,sourceIds,stats,visual.
- Numeric charts use actual signed values/units; discrete confirmed open/low/close observations are not interpolated into imaginary price paths.
- Add `editingPlan` or a checked-in `editingPlanPath` underjobs/oreditorial/. Plan inputKind=`tts_motion`; beats carry sceneId,exactspoken`trigger`,optionaloccurrence,2–4word`keyword`,source-backedlabel,value,context,andoptional kindcta. See ALIGNED_PREVIEW_RUNTIME. Keep date/session/unit/forecast qualifiers even when keywords are short.
- Preserve stream/slot/articleId/articlePath/eventKeys/digest mode and same-day idempotency required by DAILY_CADENCE. Preview/final are stages of one edition, not extra news videos.

## Production sequence

1. Research fresh sources, write brief/ledger,three hooks,scene narration and once-onlyCTA. Verify dates,sessions,units,uncertainty and corrections; perform editorial scoring.
2. Build and review the effects map. Check source linkage and capability before paid TTS. Missing plan or unsupported input is BLOCKED, not permission to use legacy timing.
3. Save unique reviewed job to main when authorized. Run `node scripts/validate-kci-job.mjs jobs/<file>.json`. The runtime also validates before synthesis.
4. Use the approved voice trial/listening process when still required. Keep exact-text+voice cache receipts and MP3s. Lastscene includesCTAonce. Reuse audio for picture-only revisions; do not generate retakes for a TTS-only job without reason.
5. Poll Vbee using the authenticated request ID and allowlisted HTTPS audio hosts. Preserve pending-state receipts on timeout/failure; do not issue duplicate paid POSTs. A fresh Actions runner does not share local cache: retrieve previous job/run artifacts and cache before a retry.
6. Align every real narration file with Whisper cross-attention/DTW, detect waveform silence>0.15s, protect speech/two-frame handles,apply short join fades and align the edited audio again. Save original/edited timing,hashes,models/attempts and edit-decision records. Never fabricate a duration for a word the aligner could not locate.
7. Render `output/preview.mp4` with audible narration, keyword cues and source/date context. Extract settled and onset-neighbor images for EVERY mapped beat, plus first/middle/last. Check actualDOMbounds,decode,blackframes,encodedloudness and truepeak. No final is produced in this stage.
8. Inspect images and actual audio, correct errors, deliver preview,word/effecttimings,takes.md,edit log and realmetrics. Model timestamp accuracy is not groundtruth; sub-frame renderer quantization alone cannot certify the two-frame acoustic requirement. Unheard/unverified checks remain PREVIEW_QA_REQUIRED.
9. After explicit approval of the exact previewversion/cut/hash and completed requiredQA, record trueapprovalprovenance and invoke the separate final route with matching preserved assets. No automatic final from a generic issue or Sheet cell. Publish only under separate explicit authorization.

## GitHub connection

Owner issue title `[KCI VIDEO] YYYY-MM-DD <edition> <topic>`, body only`{"job":"jobs/<actual-file>.json"}` selects a checked-in job for voicedPREVIEW. `[KCI VOICE TEST]` remains a short trial only. Workflow `.github/workflows/kci-video.yml` must be onmain. Actual completion requires artifact+inspection, not just run success.

The separate PR integration test reuses preserved26OctoberAnhKhôi audio without Vbee secrets/calls. Its technical preview is prominently marked nonpublishable and does not count toward daily editions. Do not claim it is new verified news. The legacy `[KCI V2 QUICK]` route is bound to archived audio, not a daily renderer.

## Security, artifacts and cost

Vbee AppID/token remain exclusively in GitHubSecrets; never print/export/read values into issue bodies,code,articles or artifacts. Existing callback is notification-only. Use the exact known allowlisted Vbeeaudiohost, not unrestrictedURLs. Preserveaudio/pendingrequests/outputalignment/QConfailure. Do not distribute font binaries. ActionsartifactURLs need authentication and expire; keep realarchivalcopies when authorized. Do not upload/post tosocial/website,sendthirdparties ortrade withoutauthorization. Do not repeat paid synthesis just because a visual render orSheetwrite failed.
