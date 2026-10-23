import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { synthesizeVbee, checkVbeeSettings } from "./vbee.mjs";

const FPS = 30;
let mode = process.argv.find(x => x.startsWith("--mode="))?.split("=")[1] || process.env.KCI_MODE || "validate";
let jobFile = process.argv.find(x => x.startsWith("--job="))?.slice(6) || process.env.KCI_JOB || "jobs/kci-2026-10-23.json";
if (process.env.GITHUB_EVENT_NAME === "issues") {
  // GitHub issues are the bridge to ChatGPT's GitHub connector.
  // Only an owner-authored, explicitly titled new issue can spend Vbee credits.
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  if (event.action !== "opened") throw new Error("Ignored non-new issue event.");
  const issue = event.issue || {};
  if (issue.user?.login !== process.env.GITHUB_REPOSITORY_OWNER) {
    throw new Error("Only the repository owner can request a paid KCI render.");
  }
  const match = /^\\[KCI (VOICE TEST|VIDEO)\\](?:\\s|$)/.exec(issue.title || "");
  if (!match) throw new Error("Unrecognized KCI issue title.");
  mode = match[1] === "VOICE TEST" ? "voice-test" : "video";
  // Never execute a command from issue body: it may only select a checked-in JSON job.
  const issueBody = JSON.parse(issue.body || "{}");
  jobFile = issueBody.job || "jobs/kci-2026-10-23.json";
}
if (!["validate", "preview", "voice-test", "video"].includes(mode)) throw new Error("Invalid mode.");
if (!/^jobs\/[\w-]+\.json$/.test(jobFile)) throw new Error("Job filename must be within jobs/.");
const job = JSON.parse(fs.readFileSync(jobFile, "utf8"));
if (!/^[a-z0-9-]{5,90}$/.test(job.id) || !Array.isArray(job.scenes) || job.scenes.length < 1 || job.scenes.length > 12) throw new Error("Invalid job data.");
const seen = new Set();
for (const scene of job.scenes) {
  if (!/^[\w-]+$/.test(scene.id) || seen.has(scene.id)) throw new Error("Invalid scene id.");
  seen.add(scene.id);
  for (const key of ["eyebrow", "headline", "summary", "voiceText", "source"]) {
    if (typeof scene[key] !== "string" || scene[key].length < 3) throw new Error("Missing scene field " + key);
  }
  if (scene.voiceText.length > 1400 || scene.headline.length > 105 || scene.summary.length > 190) throw new Error("Scene too long.");
  if (!Array.isArray(scene.stats) || scene.stats.length > 3) throw new Error("Invalid stats.");
}
console.log("Validated", job.id, job.scenes.length, "scenes.");
if (mode !== "validate") {
  const out = path.resolve("out");
  fs.mkdirSync(out, {recursive:true});
  if (mode === "video" || mode === "voice-test") checkVbeeSettings();
  const voiceDir = path.resolve("public/voice");
  if (mode === "video" || mode === "voice-test") fs.mkdirSync(voiceDir, {recursive:true});
  const scenes = [];
  let startFrame = 0;
  for (let i=0; i < job.scenes.length; i++) {
    if (mode === "voice-test" && i > 0) break;
    const scene = job.scenes[i];
    let seconds = 9;
    let audioFile;
    if (mode === "voice-test" || mode === "video") {
      const target = path.join(voiceDir, "scene-" + String(i+1).padStart(2,"0") + ".mp3");
      await synthesizeVbee(mode === "voice-test" ? (job.voiceTestText || scene.voiceText) : scene.voiceText,target);
      const output = execFileSync("ffprobe",["-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",target],{encoding:"utf8"}).trim();
      seconds = Number(output);
      if (!Number.isFinite(seconds) || seconds < 2 || seconds > 95) throw new Error("Invalid voice duration");
      audioFile = "voice/" + path.basename(target);
      if (mode === "voice-test") {
        fs.copyFileSync(target,path.join(out,"vbee-voice-test.mp3"));
        console.log("Voice test complete. Listening approval is required.");
        process.exit(0);
      }
    }
    const durationFrames = Math.ceil(seconds*FPS)+10;
    const words=scene.voiceText.trim().split(/\s+/);
    const captions=[];
    for(let wi=0; wi<words.length; wi+=7) {
      captions.push({
        from:Math.floor(wi/words.length*(durationFrames-10)),
        to:Math.ceil(Math.min(wi+7,words.length)/words.length*(durationFrames-10)),
        text:words.slice(wi,wi+7).join(" ")
      });
    }
    scenes.push({...scene,startFrame,durationFrames,audioFile,captions});
    startFrame+=durationFrames;
  }
  const props = {headline:job.headline,edition:job.edition,scenes,preview:mode==="preview"};
  fs.writeFileSync(path.join(out,"props.json"),JSON.stringify(props,null,2));
  const outputFile=path.join(out,job.id+(mode==="preview"?"-preview":"")+".mp4");
  execFileSync("npx",["remotion","render","src/index.ts","KciNews",outputFile,"--props="+path.join(out,"props.json"),"--codec=h264","--concurrency=2"],{stdio:"inherit",timeout:1200000});
  if (mode==="video") {
    const streams=execFileSync("ffprobe",["-v","error","-select_streams","a","-show_entries","stream=codec_name","-of","csv=p=0",outputFile],{encoding:"utf8"}).trim();
    if (!streams) throw new Error("No voice in the exported MP4. Rejecting.");
  }
  fs.writeFileSync(path.join(out,"qc.json"),JSON.stringify({job:job.id,status:"REVIEW_REQUIRED",mode,voicePresent:mode==="video",subtitles:"Timing estimated using word positions, requires review",published:false},null,2));
  console.log("Output created; human review required:",outputFile);
}
