import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// 26/11/2026 owner request: every finished render is delivered straight to the
// owner's private Telegram chat (MP4 + caption), and failures arrive as a short
// text with the reason. Review copy only: NOT a publication. Never blocks or
// retries a render. Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.

const LIMIT = 49 * 1024 * 1024; // Telegram bot upload limit is 50 MB.

export function buildCaption({ edition, job, runUrl, result, reason }) {
  const title = String(edition || job?.id || "KCI").replace(/\s+/g, " ").trim().slice(0, 120);
  if (result !== "success") {
    return [
      `❌ KCI — RENDER LỖI`,
      title,
      reason ? `Lý do: ${reason}` : "Lý do: xem log run",
      `Run: ${runUrl}`,
      "Sửa job rồi Đóng → Mở lại issue để render lại.",
    ].join("\n").slice(0, 1000);
  }
  const caption = typeof job?.caption === "string" ? job.caption.trim() : "";
  return [
    `✅ ${title}`,
    "VIDEO ĐÃ RENDER — CHỜ ANH DUYỆT — CHƯA ĐĂNG",
    "",
    caption ? `Caption đề xuất:\n${caption}` : "Caption: (job chưa có caption)",
    "",
    `Run: ${runUrl}`,
  ].join("\n").slice(0, 1000);
}

function findMp4(outDir) {
  if (!fs.existsSync(outDir)) return "";
  const files = fs.readdirSync(outDir).filter((f) => /\.mp4$/i.test(f) && !/preview/i.test(f))
    .map((f) => path.join(outDir, f));
  files.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
  return files[0] || "";
}

// Shrink a copy for Telegram only when the review MP4 is over the bot limit.
function fitForTelegram(file) {
  if (fs.statSync(file).size <= LIMIT) return file;
  const small = file.replace(/\.mp4$/i, "-telegram.mp4");
  const seconds = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
    "-of", "csv=p=0", file], { encoding: "utf8" }).trim()) || 90;
  const kbps = Math.max(800, Math.floor((LIMIT * 8 * 0.9) / seconds / 1000) - 128);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", file, "-c:v", "libx264", "-preset", "veryfast",
    "-b:v", `${kbps}k`, "-maxrate", `${kbps}k`, "-bufsize", `${kbps * 2}k`, "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart", small], { stdio: "inherit", timeout: 600000 });
  return small;
}

async function telegram(method, token, form) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST", body: form, signal: AbortSignal.timeout(180000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok === false) {
    throw new Error(`Telegram ${method} failed: HTTP ${response.status} ${String(body.description || "").slice(0, 120)}`);
  }
}

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.log("Telegram delivery skipped: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID secrets not set.");
    return;
  }
  const mode = process.env.KCI_MODE_RESOLVED || "";
  const result = process.env.KCI_RESULT || "";
  const jobPath = process.env.KCI_JOB_PATH || "";
  let job = null;
  if (/^jobs\/[a-z0-9-]+\.json$/.test(jobPath) && fs.existsSync(jobPath)) {
    job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
  }
  let reason = "";
  try {
    const { failureReason } = await import("./notify-render.mjs");
    reason = failureReason(fs.readFileSync("out/failure-reason.txt", "utf8"));
  } catch {}
  const caption = buildCaption({
    edition: process.env.KCI_EDITION, job, result, reason,
    runUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  });
  const mp4 = result === "success" ? findMp4("out") : "";
  if (result === "success" && !mp4) {
    console.log(`Telegram: no MP4 in out/ (mode=${mode || "unknown"}); nothing to deliver.`);
    return;
  }
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("caption", caption);
  if (mp4) {
    const file = fitForTelegram(mp4);
    form.append("supports_streaming", "true");
    form.append("video", new Blob([fs.readFileSync(file)], { type: "video/mp4" }), path.basename(mp4));
    await telegram("sendVideo", token, form);
    console.log(`Telegram: sent ${path.basename(mp4)} (${(fs.statSync(file).size / 1048576).toFixed(1)} MB).`);
  } else {
    const text = new FormData();
    text.append("chat_id", chatId);
    text.append("text", caption);
    await telegram("sendMessage", token, text);
    console.log("Telegram: sent failure notice.");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    // Never print the token; error text only carries Telegram's description.
    console.error(String(error?.message || error).replace(/bot\d+:[\w-]+/g, "bot[ẩn]"));
    process.exitCode = 1;
  });
}
