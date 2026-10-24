/**
 * KCI Vbee TTS notification receiver — Cloudflare Workers Free.
 *
 * GET  /api/vbee-callback => health status
 * POST /api/vbee-callback => reject invalid JSON, acknowledge with 204.
 *
 * It intentionally DOES NOT trust/store/log/forward the callback body.
 * The KCI GitHub Actions worker authenticates separately with Vbee's
 * GET-request endpoint to establish completion and retrieve the MP3.
 *
 * This endpoint has no credentials and never starts rendering or synthesis.
 * It must not be repurposed for a state-changing webhook without
 * authentication and replay protection.
 */

const MAX_BYTES = 16 * 1024;
const ROUTE = "/api/vbee-callback";
const commonHeaders = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

async function readLimitedJson(request) {
  const advertised = request.headers.get("content-length");
  if (advertised !== null) {
    const count = Number(advertised);
    if (!Number.isFinite(count) || count < 0 || count > MAX_BYTES) {
      return { status: 413 };
    }
  }

  const reader = request.body?.getReader();
  if (!reader) return { status: 400 };

  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BYTES) {
        await reader.cancel();
        return { status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { status: 400 };
  }
  if (totalBytes === 0) return { status: 400 };

  const all = new Uint8Array(totalBytes);
  let offset = 0;
  for (const part of chunks) {
    all.set(part, offset);
    offset += part.byteLength;
  }
  try {
    const message = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(all));
    if (message === null || Array.isArray(message) || typeof message !== "object") {
      return { status: 400 };
    }
    return { status: 204 };
  } catch {
    return { status: 400 };
  }
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname !== ROUTE) {
      return new Response("Not found", { status: 404, headers: commonHeaders });
    }
    if (request.method === "GET") {
      return Response.json(
        { service: "KCI Vbee callback", status: "ready" },
        { status: 200, headers: commonHeaders },
      );
    }
    if (request.method !== "POST") {
      return new Response(null, {
        status: 405,
        headers: { ...commonHeaders, allow: "GET, POST" },
      });
    }
    const type = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (!type.startsWith("application/json")) {
      return new Response(null, { status: 415, headers: commonHeaders });
    }
    const { status } = await readLimitedJson(request);
    return new Response(null, { status, headers: commonHeaders });
  },
};
