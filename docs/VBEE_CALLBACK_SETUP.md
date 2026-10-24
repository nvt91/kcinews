# Deploy the KCI Vbee callback (one-time setup)

The Vbee subscription covers text-to-speech usage. A callback endpoint is a separate hosting concern.

## Why this exists

The current Vbee Batch API call includes `webhookUrl`. The KCI worker also authenticates with Vbee and polls its Get Request endpoint until it retrieves the audio link. This callback route is a **notification-only receiver**; it does not trust request data, store speech text, expose App ID/Token, or trigger paid renders. Do not interpret an HTTP 204 as proof that synthesis succeeded.

## Deployment

1. Open Vercel and choose **Add New → Project**, importing the private `nvt91/kcinews` repository. Select the appropriate account/plan for commercial KCI content. Vercel Hobby is for personal non-commercial use.
2. Deploy a commit that contains `api/vbee-callback.ts`. Prefer a production deployment only after reviewing PR #1. If the Vercel project detects a build script that is intended only for Remotion, configure the project as **Other** and deploy the API route independently. Do not assume a Remotion bundle is a web app.
3. Confirm `GET https://YOUR-VERIFIED-DOMAIN/api/vbee-callback` returns JSON with `status: "ready"`. This verifies the route exists, not end-to-end Vbee integration.
4. In GitHub `nvt91/kcinews → Settings → Secrets and variables → Actions → Variables`, add `VBEE_WEBHOOK_URL` as `https://YOUR-VERIFIED-DOMAIN/api/vbee-callback`. A valid HTTPS URL is needed; do not enter `example.com` or any placeholder.
5. Secrets `VBEE_APP_ID` and `VBEE_API_TOKEN` stay exclusively in GitHub **Actions Secrets**. They must not appear in a query string, code file, issue, or ChatGPT message. Voice code `n_hanoi_male_tuananhnews_news_vc` is configured in the GitHub Actions workflow.
6. Once the KCI workflow is merged and the callback URL configured, run a single **voice-test**. Listen to the actual MP3 and confirm pronunciation before making the full video.

## Notes

- Vbee Get Request polling is the authoritative source for audio completion; callback messages are ignored and not logged by this endpoint.
- If the API plan's actual callback contract differs from the published Batch API examples, update the adapter before spending API credits.
- This endpoint has no durable state. It is not an auditable event sink; for scale or diagnostics, replace it with an authenticated, rate-limited receiver backed by a small database or queue.
- Do not make this service publicly writable with any side effects.
