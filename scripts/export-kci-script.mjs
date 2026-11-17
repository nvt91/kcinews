import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Xuất kịch bản thân thiện (định dạng owner duyệt 17/11/2026) từ job schema v2.
// Usage: node scripts/export-kci-script.mjs jobs/kci-YYYY-MM-DD-topic.json [out.md]
// Xem .agents/skills/kci-news-video/references/SCRIPT_FORMAT.md

const sentences = (text) => String(text || "")
  .replace(/\s+/g, " ").trim()
  .split(/(?<=[.!?…])\s+/u)
  .filter(Boolean);

const screenTextOf = (scene) => {
  if (scene.screenText) return scene.screenText;
  if (Array.isArray(scene.stats) && scene.stats.length) {
    return scene.stats.map((s) => `${s.label} ${s.value}`.toUpperCase()).join(" | ");
  }
  return String(scene.headline || "").toUpperCase();
};

export function formatKciScript(job) {
  const lines = [`KCI | ${job.scriptTitle || job.headline}`, ""];
  job.scenes.forEach((scene, i) => {
    const title = scene.title || scene.headline || scene.eyebrow;
    const label = i === 0 ? `Hook: ${title}` : title;
    lines.push(`Cảnh ${i + 1} — ${label}`);
    lines.push(`Text màn hình: ${screenTextOf(scene)}`);
    lines.push("Lời dẫn:");
    const body = sentences(scene.voiceText);
    lines.push(...body.map((s, k) => (k === 0 ? "“" : "") + s + (k === body.length - 1 ? "”" : "")));
    lines.push("");
  });
  if (job.cta) {
    lines.push("Cảnh kết — CTA");
    lines.push(`Text màn hình: ${job.cta.screenText || job.cta.screenHeadline}`);
    lines.push("Lời dẫn:");
    const body = sentences(job.cta.spoken);
    lines.push(...body.map((s, k) => (k === 0 ? "“" : "") + s + (k === body.length - 1 ? "”" : "")));
  }
  return lines.join("\n").trim() + "\n";
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  const [jobPath, outPath] = process.argv.slice(2);
  if (!jobPath || !/^jobs\/[\w-]+\.json$/.test(jobPath)) {
    throw new Error("Usage: node scripts/export-kci-script.mjs jobs/kci-YYYY-MM-DD-topic.json [out.md]");
  }
  const text = formatKciScript(JSON.parse(fs.readFileSync(jobPath, "utf8")));
  if (outPath) fs.writeFileSync(outPath, text, "utf8");
  else process.stdout.write(text);
}
