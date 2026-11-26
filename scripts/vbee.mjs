import fs from "node:fs/promises";
import path from "node:path";

const endpoint = "https://api.vbee.vn/v1/tts";
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const envRequired = (key) => {
  const value = process.env[key]?.trim();
  if (!value) throw new Error("Missing " + key + "; Vbee was not called.");
  return value;
};

export function checkVbeeSettings() {
  const appId = envRequired("VBEE_APP_ID");
  const token = envRequired("VBEE_API_TOKEN");
  const voiceCode = envRequired("VBEE_VOICE_CODE");
  const webhookUrl = envRequired("VBEE_WEBHOOK_URL");
  if (!/^[a-zA-Z0-9_.-]{2,128}$/.test(voiceCode)) {
    throw new Error("VBEE_VOICE_CODE contains invalid characters.");
  }
  const url = new URL(webhookUrl);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("VBEE_WEBHOOK_URL must be a real HTTPS callback without embedded credentials.");
  }
  return { appId, token, voiceCode, webhookUrl };
}
async function jsonRequest(url, config) {
  let response;
  try {
    response = await fetch(url, {
      ...config,
      signal: AbortSignal.timeout(18000),
    });
  } catch {
    throw new Error("Vbee request timed out or network failed. No automatic retry of POST.");
  }
  if (!response.ok) {
    // 26/11/2026: surface Vbee's own error text (e.g. quota/characters, invalid
    // voice, text rejected) so the failed-render issue comment says why.
    let detail = "";
    try {
      const raw = await response.text();
      let msg = raw;
      try { const j = JSON.parse(raw); msg = j?.error_message ?? j?.message ?? j?.error ?? j?.msg ?? j?.data?.message ?? raw; } catch {}
      detail = String(typeof msg === "string" ? msg : JSON.stringify(msg))
        .replace(/https?:\/\/\S+/gi, "[url]")
        .replace(/[A-Za-z0-9_\-.]{24,}/g, "[ẩn]")
        .replace(/\s+/g, " ").trim().slice(0, 180);
    } catch {}
    throw new Error("Vbee returned HTTP " + response.status + " (" + (config?.method || "GET") + ")" +
      (detail ? ": " + detail : ".") );
  }
  try { return await response.json(); }
  catch { throw new Error("Vbee returned unexpected non-JSON."); }
}
const dataPart = (x) => x?.data ?? x?.result ?? x;
const audioUrl = (x) => dataPart(x)?.audioLink ?? dataPart(x)?.audio_link ?? dataPart(x)?.audioUrl ?? dataPart(x)?.audio_url;
const requestId = (x) => dataPart(x)?.requestId ?? dataPart(x)?.request_id;
const state = (x) => String(dataPart(x)?.status ?? "").toUpperCase();

export async function synthesizeVbee(text, outputPath) {
  if (typeof text !== "string" || text.length < 15 || text.length > 1400) {
    throw new Error("Invalid TTS segment size: 15 to 1400 characters required.");
  }
  const config = checkVbeeSettings();
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + config.token,
    "App-Id": config.appId,
  };
  const created = await jsonRequest(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      text: text.trim(),
      mode: "async",
      webhookUrl: config.webhookUrl,
      voiceCode: config.voiceCode,
    }),
  });
  if (created?.status === 0 || created?.success === false) {
    throw new Error("Vbee rejected the TTS request. Check account, schema and voice.");
  }
  const id = requestId(created);
  let link = audioUrl(created);
  if (!link && !id) throw new Error("Vbee returned neither a requestId nor audio URL.");
  if (["FAILED", "FAILURE", "ERROR"].includes(state(created))) {
    throw new Error("Vbee rejected synthesis.");
  }
  for (let i = 0; !link && i < 72; i++) {
    await pause(3500);
    const polled = await jsonRequest(
      endpoint + "/requests/" + encodeURIComponent(id),
      { method: "GET", headers },
    );
    if (["FAILED", "FAILURE", "ERROR"].includes(state(polled))) {
      throw new Error("Vbee synthesis failed.");
    }
    link = audioUrl(polled);
  }
  if (!link) throw new Error("Vbee generation timed out; do not repeat the chargeable request blindly.");
  const configuredHosts = (process.env.VBEE_AUDIO_HOSTS || "")
    .split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);
  const isAllowedHost = (hostname) =>
    hostname === "vbee.vn" || hostname.endsWith(".vbee.vn") ||
    configuredHosts.includes(hostname);
  const parseAudioUrl = (value) => {
    const uri = new URL(value);
    if (uri.protocol !== "https:" || uri.username || uri.password ||
        (uri.port && uri.port !== "443") || !isAllowedHost(uri.hostname.toLowerCase())) {
      throw new Error(
        "Vbee audio URL host is not allowlisted: " + uri.hostname +
        ". Verify it with Vbee and set VBEE_AUDIO_HOSTS to the exact hostname if appropriate.",
      );
    }
    return uri;
  };

  // A Vbee CDN may respond with an HTTPS 302/307 to its storage location.
  // Manual redirect handling avoids leaking the Bearer token (never sent to CDN)
  // and prevents redirects to arbitrary private/network-local addresses.
  let current = parseAudioUrl(link);
  let response;
  for (let hop = 0; hop < 4; hop++) {
    try {
      response = await fetch(current.href, {
        redirect: "manual",
        signal: AbortSignal.timeout(45000),
      });
    } catch (error) {
      const kind = String(error?.cause?.code || error?.name || "NETWORK_ERROR")
        .replace(/[^A-Za-z0-9_-]/g, "").slice(0, 50);
      throw new Error("Unable to fetch Vbee audio from " + current.hostname + ": " + kind);
    }
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    const location = response.headers.get("location");
    if (!location) throw new Error("Vbee CDN redirect lacks Location header.");
    current = parseAudioUrl(new URL(location, current).href);
    response = null;
  }
  if (!response) throw new Error("Too many Vbee CDN redirects (maximum 4).");
  if (!response.ok) {
    throw new Error("Vbee audio download HTTP " + response.status +
      " from " + current.hostname);
  }
  const audio = Buffer.from(await response.arrayBuffer());
  if (audio.length < 2000 || audio.length > 30_000_000) {
    throw new Error("Implausible audio payload size.");
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, audio);
  return outputPath;
}
