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
    throw new Error("Vbee returned HTTP " + response.status + " (" + (config?.method || "GET") + ").");
  }
  try { return await response.json(); }
  catch { throw new Error("Vbee returned unexpected non-JSON."); }
}
const dataPart = (x) => x?.data ?? x?.result ?? x;
const audioUrl = (x) => dataPart(x)?.audioLink ?? dataPart(x)?.audio_link ?? dataPart(x)?.audioUrl;
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
  const url = new URL(link);
  const configuredHosts = (process.env.VBEE_AUDIO_HOSTS || "")
    .split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  const allow = ["vbee.vn", "cdn.vbee.vn", "api.vbee.vn", ...configuredHosts];
  if (url.protocol !== "https:" || !allow.includes(url.hostname.toLowerCase())) {
    throw new Error("Audio CDN hostname is not allowlisted. Verify then set VBEE_AUDIO_HOSTS.");
  }
  let response;
  try {
    response = await fetch(link, { redirect: "error", signal: AbortSignal.timeout(45000) });
  } catch {
    throw new Error("Unable to fetch Vbee audio.");
  }
  if (!response.ok) throw new Error("Audio download HTTP " + response.status);
  const audio = Buffer.from(await response.arrayBuffer());
  if (audio.length < 2000 || audio.length > 30_000_000) {
    throw new Error("Implausible audio payload size.");
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, audio);
  return outputPath;
}
