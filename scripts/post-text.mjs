import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Posts a GPT-written text post (posts/YYYY-MM-DD-HHMM-slug.txt) to the Telegram
// channel (owner request 26/11/2026). The file content is the exact message.
// Checks length and investment-promise phrases first; problems go privately to the owner.
// Usage: node scripts/post-text.mjs posts/<file>.txt [--dry-run]

const forbidden = /(chắc chắn (tăng|giảm|thắng)|cam kết (lãi|lợi nhuận)|lãi (100|200|300)%|mua ngay để|không mua sẽ tiếc)/iu;

export function checkPost(text) {
  const problems = [];
  const t = String(text || "").trim();
  if (t.length < 40) problems.push("bài quá ngắn (< 40 ký tự)");
  if (t.length > 4000) problems.push(`bài quá dài (${t.length} > 4000 ký tự của Telegram)`);
  for (const m of t.matchAll(new RegExp(forbidden.source, "giu"))) {
    const before = t.slice(Math.max(0, m.index - 40), m.index);
    const negated = /(không|chưa|chẳng|đừng)[^.!?]{0,35}$/iu.test(before) && !/^không mua/iu.test(m[0]);
    if (!negated) problems.push(`có cụm hứa hẹn lợi nhuận: "${m[0]}"`);
  }
  if (/#(KCI|KoreaCapitalInsight)\b/i.test(t)) problems.push("có hashtag thương hiệu KCI (kênh cá nhân không dùng)");
  return { text: t, problems };
}

async function send(token, chat, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(30000),
  });
  const body = await res.json().catch(() => ({}));
  if (!body.ok) throw new Error(`Telegram: ${body.description || res.status}`);
}

async function main() {
  const file = process.argv[2] || "";
  const dry = process.argv.includes("--dry-run");
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const channel = process.env.TELEGRAM_CHANNEL_ID?.trim();
  const owner = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!/^posts\/[a-z0-9-]+\.txt$/.test(file) || !fs.existsSync(file)) {
    throw new Error("Usage: node scripts/post-text.mjs posts/YYYY-MM-DD-HHMM-slug.txt");
  }
  const { text, problems } = checkPost(fs.readFileSync(file, "utf8"));
  if (problems.length) {
    const msg = `❌ Bài ${path.basename(file)} chưa đăng: ${problems.join("; ")}. Sửa file rồi commit lại với tên mới.`;
    console.error(msg);
    if (token && owner && !dry) await send(token, owner, msg).catch(() => {});
    process.exitCode = 1;
    return;
  }
  console.log(text);
  if (dry || !token || !channel) { console.log(`\n(chưa gửi: ${dry ? "dry-run" : "thiếu token/kênh"})`); return; }
  try {
    await send(token, channel, text);
    console.log(`\nĐã đăng ${path.basename(file)} lên ${channel}.`);
  } catch (error) {
    const msg = String(error?.message || error).replace(/bot\d+:[\w-]+/g, "bot[ẩn]");
    if (token && owner) await send(token, owner, `❌ Đăng bài ${path.basename(file)} lỗi: ${msg}`).catch(() => {});
    throw new Error(msg);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e.message); process.exitCode = 1; });
}
