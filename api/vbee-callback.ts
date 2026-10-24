/**
 * Minimal Vbee callback receiver for Vercel.
 *
 * This is a notification-only endpoint. It does NOT trust callback contents
 * and does NOT authorize a render, download audio, or mutate state.
 * The GitHub Actions worker independently polls the authenticated Vbee API.
 *
 * Deploy this /api route with Vercel, then set GitHub Actions variable
 * VBEE_WEBHOOK_URL to https://<verified-domain>/api/vbee-callback.
 * Do not add the Vbee API token to this function.
 */
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export function GET() {
  return Response.json(
    { service: "KCI Vbee callback receiver", status: "ready" },
    { status: 200, headers },
  );
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return new Response(null, { status: 415, headers });
  }

  const length = Number(request.headers.get("content-length") || "0");
  if (length > 16_384) {
    return new Response(null, { status: 413, headers });
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return new Response(null, { status: 400, headers });
  }

  if (body.length === 0 || body.length > 16_384) {
    return new Response(null, { status: 413, headers });
  }

  try {
    const payload: unknown = JSON.parse(body);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return new Response(null, { status: 400, headers });
    }
  } catch {
    return new Response(null, { status: 400, headers });
  }

  // Receipt only: no untrusted payload is logged, persisted or acted upon.
  return new Response(null, { status: 204, headers });
}
