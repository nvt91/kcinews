# KCI Vbee Callback — Cloudflare Workers Free

This project does **not** require Lovable or a paid Vercel deployment.

Vbee Batch API expects a real HTTPS \`webhookUrl\`. The GitHub Actions worker also polls Vbee's authenticated request-status API to retrieve the actual audio file. The Cloudflare Worker acknowledges notifications only — it neither stores, trusts nor acts on webhook data. A callback HTTP 200 does **not** mean the MP3 is ready.

## One-time setup on Cloudflare Workers Free

Cloudflare Workers Free currently includes 100,000 incoming requests/day. This very small endpoint should use only a handful of requests per KCI news video, subject to Cloudflare's published free-tier limits.

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/) with a Free account, or create one.
2. Open **Workers & Pages → Create application → Create Worker**. Give it a name like \`kci-vbee-callback\`.
3. In **Edit code**, replace the default Worker source with the exact content of \`workers/vbee-callback.mjs\` from this repository branch and deploy. Alternatively, for one-time CLI deployment from the repo folder:
   \`\`\`bash
   npx wrangler login
   npx wrangler deploy
   \`\`\`
   This repository's \`wrangler.toml\` specifies the worker script and its name.
4. Cloudflare will issue a public HTTPS domain such as \`https://kci-vbee-callback.<your-subdomain>.workers.dev\`. **Do not guess the domain** — use the URL Cloudflare actually provides.
5. Open \`https://ACTUAL_WORKERS_DOMAIN/api/vbee-callback\` in a browser. It must respond with a JSON object containing \`"status":"ready"\`. This tests only the endpoint, not Vbee.
6. Go to GitHub **nvt91/kcinews → Settings → Secrets and variables → Actions → Variables**. Create a non-secret variable:
   - Name: \`VBEE_WEBHOOK_URL\`
   - Value: \`https://ACTUAL_WORKERS_DOMAIN/api/vbee-callback\`
   Keep \`VBEE_APP_ID\` and \`VBEE_API_TOKEN\` inside GitHub **Secrets**, never in Variables, source files, query parameters, chat, or logs. The approved \`n_hanoi_male_tuananhnews_news_vc\` voice code is already in the pipeline YAML.
7. Once PR #1 has been reviewed and merged to main, run **KCI News Video → Run workflow → voice-test**. Check the real MP3 before using **video**. Do not label a silent MP4 as final.

## Security and quality

- The worker accepts only small (up to 16 KiB) JSON-object POST messages and returns HTTP 200 on receipt. It does not retain or forward the content.
- The worker cannot trigger paid synthesis or a GitHub render; only the authenticated GitHub Actions execution may request Vbee audio.
- Do **not** depend on unauthenticated callback messages for proof of synthesis completion; the render pipeline must independently verify the request status and MP3 result with Vbee credentials.
- If Vbee supplies a CDN audio URL with a hostname outside the worker's strict allowlist, first verify it through Vbee documentation, then configure \`VBEE_AUDIO_HOSTS\` as a GitHub Actions Variable. Do not disable HTTPS or hostname restrictions.
- The Vbee adapter currently follows the published asynchronous API example; schema acceptance still requires a single live voice-test. A failed/timeout POST must not be retried blindly because Vbee might have already accepted the request.
- For an always-on webhook with state-changing actions, replace this acknowledgment-only endpoint with an authenticated endpoint with replay protection and monitoring; **do not** extend this anonymous receiver to execute commands.

## Costs

- Cloudflare Workers Free: no recurring hosting fee while within its stated limits.
- Remotion/FFmpeg: local/open-source rendering subject to relevant licenses.
- GitHub Actions: usage subject to account plan/minutes and repository settings.
- Vbee: covered by your paid subscription or API account; usage may still draw down your balance.

No Cloudflare deployment has been performed from ChatGPT; this repository change only prepares it.
