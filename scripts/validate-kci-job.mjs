import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const kinds = new Set([
  "reversal","comparison","company","risk-bars",
  "spotlight","rate","closing","generic",
]);
const actions = new Set(["comment","follow","save"]);
const forbidden = /(chắc chắn (tăng|giảm|thắng)|cam kết (lãi|lợi nhuận)|lãi (100|200|300)%|mua ngay để|không mua sẽ tiếc)/iu;
const https = (x) => {
  try {
    const url = new URL(x);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
};
const nonempty = (v, min=3, max=1500) => typeof v === "string" &&
  v.trim().length >= min && v.trim().length <= max;
const required = (condition, message) => {
  if (!condition) throw new Error("KCI editorial validation: " + message);
};
const dateKst = (v) => nonempty(v) &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?\+09:00$/.test(v) &&
  !Number.isNaN(Date.parse(v));
const numeric = (v) => typeof v === "number" && Number.isFinite(v);

export function validateKciJob(job) {
  required(job && typeof job === "object" && !Array.isArray(job), "job object required");
  required(job.schemaVersion === 2, "schemaVersion must be 2 for daily episodes");
  required(/^[a-z0-9-]{6,100}$/.test(job.id || ""), "invalid unique job id");
  required(nonempty(job.edition,6,100), "edition missing");
  required(dateKst(job.dataAsOf), "dataAsOf must be a KST ISO timestamp with +09:00");
  required(nonempty(job.headline,15,190), "headline invalid");
  required(job.status === "REVIEW_REQUIRED", "new episodes must start REVIEW_REQUIRED");
  required(job.template === "KciNewsDaily", "new jobs must use data-driven KciNewsDaily");
  required(Array.isArray(job.sourceLedger) && job.sourceLedger.length >= 2 &&
    job.sourceLedger.length <= 30, "sourceLedger requires 2–30 sources");

  const sources = new Set();
  for (const source of job.sourceLedger) {
    required(/^[a-z0-9-]{3,70}$/.test(source?.id || "") && !sources.has(source.id),
      "source IDs must be unique kebab-case");
    sources.add(source.id);
    required(nonempty(source.title,5,220), source.id + ": title required");
    required(https(source.url), source.id + ": exact HTTPS URL required");
    required(/^\d{4}-\d{2}-\d{2}$/.test(source.eventDate || ""),
      source.id + ": event date required");
    required(dateKst(source.checkedAt), source.id + ": checkedAt KST required");
    required(["primary","secondary"].includes(source.kind),
      source.id + ": specify primary or secondary");
    required(Array.isArray(source.facts) && source.facts.length >= 1 &&
      source.facts.every((fact) => nonempty(fact,5,280)),
      source.id + ": at least one attributed factual statement required");
  }

  required(job.hook && nonempty(job.hook.spoken,20,300),
    "factually grounded hook.spoken required");
  required(Array.isArray(job.hook.candidates) && job.hook.candidates.length >= 3,
    "produce at least three hook candidates");
  required(job.hook.candidates.some((c) => c?.text === job.hook.spoken),
    "selected spoken hook must match a candidate");
  required(job.hook.candidates.every((c) =>
    nonempty(c?.text,20,300) && nonempty(c?.style,4,80)),
    "hook candidates need text and different approaches");
  required(!forbidden.test(job.hook.spoken), "unsafe investment promise in hook");

  required(job.cta && actions.has(job.cta.type), "one primary CTA type required");
  required(nonempty(job.cta.spoken,24,460), "spoken CTA required");
  required(nonempty(job.cta.screenHeadline,5,72), "CTA headline required");
  required(nonempty(job.cta.screenSubline,5,95), "CTA supporting copy required");
  if (job.cta.type === "comment") {
    required(nonempty(job.cta.question,15,220) && job.cta.question.includes("?"),
      "comment CTA needs an answerable question ending with ?");
  }
  required(!forbidden.test(job.cta.spoken), "CTA must not promise profits or pressure trading");

  required(Array.isArray(job.scenes) && job.scenes.length >= 3 &&
    job.scenes.length <= 12, "3–12 narrated scenes required");
  const ids = new Set();
  job.scenes.forEach((scene, index) => {
    required(/^[a-z0-9-]{2,64}$/.test(scene?.id || "") && !ids.has(scene.id),
      "each scene needs a unique simple id");
    ids.add(scene.id);
    for (const field of ["eyebrow","headline","summary","source","voiceText"]) {
      required(nonempty(scene[field],3,field==="voiceText"?1400:200),
        scene.id + ": invalid " + field);
    }
    required(!forbidden.test(scene.voiceText), scene.id + ": unsafe price/return guarantee");
    required(Array.isArray(scene.sourceIds) && scene.sourceIds.length > 0 &&
      scene.sourceIds.every((id) => sources.has(id)),
      scene.id + ": unknown or missing source ID");
    required(Array.isArray(scene.stats) && scene.stats.length <= 4 &&
      scene.stats.every((stat) =>
        nonempty(stat?.label,2,75) && nonempty(stat?.value,1,55) &&
        (!stat.tone || ["up","down","neutral"].includes(stat.tone))),
      scene.id + ": invalid stat cards");
    required(scene.visual && kinds.has(scene.visual.kind),
      scene.id + ": missing visual kind");
    // Visual illustrations are opt-in, local and source-reviewed. Never fetch untrusted
    // URLs at render time or let an illustration stand in for financial evidence.
    if (scene.visual.motionStyle !== undefined) {
      required(["standard", "cinematic"].includes(scene.visual.motionStyle),
        scene.id + ": unsupported motion style");
    }
    if (scene.visual.assetPath !== undefined) {
      required(typeof scene.visual.assetPath === "string" &&
        /^assets\/kci\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\.(png|jpe?g|webp)$/.test(scene.visual.assetPath),
        scene.id + ": visual asset must be a local public/assets/kci png/jpg/webp");
      required(["ai-illustration", "licensed-photo"].includes(scene.visual.assetKind),
        scene.id + ": visual asset disclosure kind required");
      required(nonempty(scene.visual.assetCredit, 5, 240),
        scene.id + ": visual asset source/license/provenance required");
      required(fs.existsSync(path.join("public", scene.visual.assetPath)),
        scene.id + ": referenced visual asset does not exist in checked-out repo");
    }
    if (scene.visual.kind === "reversal") {
      required(Array.isArray(scene.visual.milestones) &&
        scene.visual.milestones.length === 3 &&
        scene.visual.milestones.every((x) =>
          nonempty(x.label,2,32) && nonempty(x.value,2,45)),
        scene.id + ": three explicitly labeled observations required");
    }
    if (["comparison","risk-bars"].includes(scene.visual.kind)) {
      required(Array.isArray(scene.visual.bars) && scene.visual.bars.length >= 2 &&
        scene.visual.bars.length <= 5 &&
        scene.visual.bars.every((x) =>
          nonempty(x.label,2,75) && nonempty(x.display,2,55) && numeric(x.value)),
        scene.id + ": labeled numeric bars required");
    }
    if (["spotlight","rate"].includes(scene.visual.kind)) {
      required(nonempty(scene.visual.value,1,60) &&
        nonempty(scene.visual.qualifier,5,160),
        scene.id + ": value and observation qualifier required");
    }
    if (scene.visual.kind === "company") {
      required(nonempty(scene.visual.company,3,65), scene.id + ": company label required");
    }
    if (scene.visual.kind === "closing") {
      required(Array.isArray(scene.visual.bullets) &&
        scene.visual.bullets.length >= 2 && scene.visual.bullets.length <= 4 &&
        scene.visual.bullets.every((x) => nonempty(x,3,85)),
        scene.id + ": two to four grounded closing items required");
    }
    if (index < job.scenes.length - 1) {
      required(!scene.visual.cta, "CTA overlay belongs only to last scene");
    }
  });
  required(job.scenes[0].voiceText.startsWith(job.hook.spoken),
    "first scene voice must begin exactly with the chosen hook");
  required(!job.scenes.at(-1).voiceText.includes(job.cta.spoken),
    "don't duplicate CTA in outro voiceText; runner appends it once");
  required(job.scenes.at(-1).visual.kind === "closing",
    "last scene should use closing visual with CTA overlay");
  required(job.sourceLedger.some((s) => s.kind === "primary"),
    "at least one primary-source cross-check required");

  return job;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  const argument = process.argv[2];
  if (!argument || !/^jobs\/[\w-]+\.json$/.test(argument)) {
    throw new Error("Usage: node scripts/validate-kci-job.mjs jobs/kci-YYYY-MM-DD-topic.json");
  }
  const job = JSON.parse(fs.readFileSync(argument, "utf8"));
  validateKciJob(job);
  console.log("KCI editorial schema v2 valid:", job.id, "| sources:", job.sourceLedger.length,
    "| scenes:", job.scenes.length, "| CTA:", job.cta.type);
}
