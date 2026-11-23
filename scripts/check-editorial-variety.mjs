/**
 * KCI editorial anti-repeat advisor. Read-only; NO TTS, NO paid calls, NEVER blocks video.
 * Run: node scripts/check-editorial-variety.mjs jobs/<existing-job>.json
 *
 * Compares selected hooks, final CTA questions and endings, and narrative opening.
 * Intentional limitation: lexical overlap is not semantic equivalence. Editors must
 * also review new information and narrative angles against source-backed briefs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const normalize = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/gi,"d").toLowerCase()
  .replace(/[^a-z0-9\s]/g," ")
  .replace(/\s+/g," ").trim();

export const words = (value) => normalize(value).split(" ").filter(Boolean);

export const similarity = (a,b) => {
  const aa = new Set(words(a)), bb = new Set(words(b));
  if (!aa.size || !bb.size) return 0;
  const hits = [...aa].filter(w => bb.has(w)).length;
  return hits / (aa.size + bb.size - hits);
};

export const slotOf = (j) => {
  const text=[j?.slot,j?.metadata?.slot,j?.edition,j?.id,j?.articleId].filter(Boolean).join(" ").toUpperCase();
  for (const name of ["KR_AM","US_AM","KR_MID","KR_CLOSE","MACRO21"]) {
    if (text.includes(name) || text.includes(name.replace("_","-"))) return name;
  }
  return "OTHER";
};

const idOf = (j) => j?.articleId || j?.metadata?.articleId || j?.id || "unknown";
const chosenHook = j => j?.hook?.spoken || j?.scenes?.[0]?.voiceText || "";
const question = j => j?.cta?.question || (j?.cta?.spoken || "").split("?")[0]?.trim() + "?";
const invitation = j => (j?.cta?.spoken || "").split("?").slice(1).join("?").trim();
const firstWords = (s,n) => words(s).slice(0,n).join(" ");
const suffix = (s,n) => words(s).slice(-n).join(" ");

export function reviewVariety(job,previousJobs=[]) {
  const issues=[], currentSlot=slotOf(job);
  const same=previousJobs.filter(x=>slotOf(x)===currentSlot).slice(0,7);
  const recent=previousJobs.slice(0,12);
  const curHook=chosenHook(job);
  const curQuestion=question(job);
  const curInvitation=invitation(job);
  for (const prev of same) {
    if (normalize(curHook)===normalize(chosenHook(prev)) && normalize(curHook))
      issues.push({code:"HOOK_REPEAT",with:idOf(prev),reason:"Selected spoken hook repeats an earlier same-edition hook"});
    else if (similarity(curHook,chosenHook(prev)) >= .88)
      issues.push({code:"HOOK_NEAR_REPEAT",with:idOf(prev),reason:"Opening hook has high lexical overlap; check whether the angle differs"});
    if (normalize(curQuestion)===normalize(question(prev)) && normalize(curQuestion))
      issues.push({code:"QUESTION_REPEAT",with:idOf(prev),reason:"Open-ended CTA question repeats"});
    else if (similarity(curQuestion,question(prev)) >= .85)
      issues.push({code:"QUESTION_NEAR_REPEAT",with:idOf(prev),reason:"CTA question has high lexical overlap"});
    if (firstWords(job?.scenes?.[0]?.voiceText,12)===firstWords(prev?.scenes?.[0]?.voiceText,12) &&
        words(job?.scenes?.[0]?.voiceText).length>=12)
      issues.push({code:"OPENING_12_WORDS_REPEAT",with:idOf(prev),reason:"First twelve spoken words match exactly"});
  }
  for (const prev of recent) {
    if (normalize(curInvitation)===normalize(invitation(prev)) && words(curInvitation).length>=8)
      issues.push({code:"FOLLOW_INVITE_REPEAT",with:idOf(prev),reason:"The same closing invitation was used recently"});
    else if (similarity(curInvitation,invitation(prev)) >= .88 && words(curInvitation).length>=8)
      issues.push({code:"FOLLOW_INVITE_NEAR_REPEAT",with:idOf(prev),reason:"Closing invitation is very similar"});
    // Voice tail can be helpful even when a CTA is stored differently in a legacy job.
    const curTail=suffix(job?.cta?.spoken,14),prevTail=suffix(prev?.cta?.spoken,14);
    if (curTail && curTail===prevTail && words(curTail).length>=10 &&
        !issues.some(x=>x.with===idOf(prev) && x.code.startsWith("FOLLOW_INVITE")))
      issues.push({code:"CTA_TAIL_REPEAT",with:idOf(prev),reason:"Last 14 words of spoken CTA are identical"});
  }
  const id=job?.variationReview?.arcId || job?.metadata?.arcId || job?.narrativeArcId;
  if (id && same.slice(0,2).length===2 && same.slice(0,2).every(p=>
      (p?.variationReview?.arcId || p?.metadata?.arcId || p?.narrativeArcId)===id))
    issues.push({code:"ARC_3_IN_ROW",with:same.slice(0,2).map(idOf).join(", "),
      reason:"Same narrative arc selected for three consecutive episodes"});
  return {articleId:idOf(job),slot:currentSlot,checkedSameEdition:same.map(idOf),
    checkedCrossStream:recent.map(idOf),issues};
}

export function loadRecentJobs(currentPath,rootDir="jobs") {
  const target=path.resolve(currentPath);
  const names=fs.readdirSync(rootDir).filter(n=>/^kci-\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.json$/.test(n))
    .map(n=>path.join(rootDir,n)).filter(p=>path.resolve(p)!==target).sort().reverse();
  const currentDate=(path.basename(currentPath).match(/\d{4}-\d{2}-\d{2}/)||[])[0];
  const selected=names.filter(n=>!currentDate || n.match(/\d{4}-\d{2}-\d{2}/)?.[0] <= currentDate).slice(0,240);
  const items=[];
  for (const file of selected) {
    try {
      const j=JSON.parse(fs.readFileSync(file,"utf8"));
      if (j.schemaVersion===2 && Array.isArray(j.scenes) && j.scenes.length) items.push(j);
    } catch (e) { /* legacy or partial JSON is not a reason to stop editorial production */ }
  }
  return items;
}

const mainFile=fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1])===mainFile) {
  const jobPath=process.argv[2];
  if (!jobPath || !/^jobs\/[a-z0-9-]+\.json$/.test(jobPath) || !fs.existsSync(jobPath)) {
    console.error("Usage: node scripts/check-editorial-variety.mjs jobs/<existing-schema-v2-job>.json");
    process.exitCode=2;
  } else {
    const job=JSON.parse(fs.readFileSync(jobPath,"utf8"));
    const reviewed=reviewVariety(job,loadRecentJobs(jobPath));
    console.log("[KCI EDITORIAL VARIETY / ADVISORY ONLY]");
    console.log("Job:",reviewed.articleId,"slot:",reviewed.slot);
    console.log("Compared:",reviewed.checkedSameEdition.length,"same-slot jobs /",
      reviewed.checkedCrossStream.length,"recent cross-stream jobs");
    if (reviewed.issues.length) {
      for (const i of reviewed.issues) {
        const line=i.code+" vs "+i.with+": "+i.reason;
        console.log("::warning::"+line);
      }
      console.log("Editorial review recommended before paid Vbee; WARNINGS DO NOT BLOCK CI.");
    } else {
      console.log("No clear lexical duplicates found. Not proof of original insight/meaning.");
    }
  }
}
