import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { synthesizeVbee, checkVbeeSettings } from "./vbee.mjs";
import { validateKciJob } from "./validate-kci-job.mjs";

const FPS = 30;
const explicitMode = process.argv.find(x => x.startsWith("--mode="))?.split("=")[1];
const explicitJob = process.argv.find(x => x.startsWith("--job="))?.slice(6);
let mode = explicitMode || process.env.KCI_MODE || "validate";
let jobFile = explicitJob || process.env.KCI_JOB || "jobs/kci-2026-10-23.json";
// An explicitly provided CLI mode must NOT be overwritten by a GitHub issue.
// In particular, the validation step must never send a billable TTS request.
if (process.env.GITHUB_EVENT_NAME === "issues" && !explicitMode) {
  // GitHub issues are the bridge to ChatGPT's GitHub connector.
  // Only an owner-authored, explicitly titled new issue can spend Vbee credits.
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  // 17/11/2026: "reopened" lets the owner retry a failed render on the latest
  // main (close → reopen the same issue) instead of filing a new issue. The
  // workflow refuses a reopen when the issue already has a rendered MP4.
  if (!["opened","reopened"].includes(event.action)) throw new Error("Ignored issue event: " + event.action);
  const issue = event.issue || {};
  if (event.action === "reopened" && event.sender?.login !== process.env.GITHUB_REPOSITORY_OWNER) {
    throw new Error("Only the repository owner can reopen a paid KCI render.");
  }
  if (issue.user?.login !== process.env.GITHUB_REPOSITORY_OWNER) {
    throw new Error("Only the repository owner can request a paid KCI render.");
  }
  const match = /^\[KCI (VOICE TEST|VIDEO)\](?:\s|$)/.exec(issue.title || "");
  if (!match) throw new Error("Unrecognized KCI issue title.");
  mode = match[1] === "VOICE TEST" ? "voice-test" : "video";
  // Never execute a command from issue body: it may only select a checked-in JSON job.
  const issueBody = JSON.parse(issue.body || "{}");
  jobFile = issueBody.job || "jobs/kci-2026-10-23.json";
}
if (!["validate", "preview", "voice-test", "video"].includes(mode)) throw new Error("Invalid mode.");
if (!/^jobs\/[\w-]+\.json$/.test(jobFile)) throw new Error("Job filename must be within jobs/.");
const job = JSON.parse(fs.readFileSync(jobFile, "utf8"));
const dailyJob = job.schemaVersion === 2;
if (dailyJob) validateKciJob(job);
if (!/^[a-z0-9-]{5,90}$/.test(job.id) || !Array.isArray(job.scenes) || job.scenes.length < 1 || job.scenes.length > 12) throw new Error("Invalid job data.");
const seen = new Set();
for (const scene of job.scenes) {
  if (!/^[\w-]+$/.test(scene.id) || seen.has(scene.id)) throw new Error("Invalid scene id.");
  seen.add(scene.id);
  for (const key of ["eyebrow", "headline", "summary", "voiceText", "source"]) {
    if (typeof scene[key] !== "string" || scene[key].length < 3) throw new Error("Missing scene field " + key);
  }
  if (scene.voiceText.length > 1400 || scene.headline.length > 105 || scene.summary.length > 190) throw new Error("Scene too long.");
  // Match the schema-v2 editorial validator: up to four attributed stats per scene.
  // The 09/11 KR_CLOSE job validly includes four sector stats.
  if (!Array.isArray(scene.stats) || scene.stats.length > 4) throw new Error("Invalid stats (maximum four).");
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
    // Only new daily jobs carry the approved CTA in the final spoken segment.
    // Historical v1 jobs remain byte-for-byte unchanged.
    const isLastScene = i === job.scenes.length - 1;
    const narration = scene.voiceText +
      (dailyJob && isLastScene && !scene.voiceText.includes(job.cta.spoken) ? " " + job.cta.spoken : ""); // never speak the CTA twice
    if (mode === "voice-test" || mode === "video") {
      const target = path.join(voiceDir, "scene-" + String(i+1).padStart(2,"0") + ".mp3");
      await synthesizeVbee(mode === "voice-test" ? (job.voiceTestText || scene.voiceText) : narration,target);
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
    const words=narration.trim().split(/\s+/);
    const captions=[];
    for(let wi=0; wi<words.length; wi+=7) {
      const audioFrames=durationFrames-10;
      const from=Math.floor(wi/words.length*audioFrames);
      const to=Math.max(from+1,Math.floor(Math.min(wi+7,words.length)/words.length*audioFrames));
      captions.push({from,to,text:words.slice(wi,wi+7).join(" ")});
    }
    // 17/11/2026: per-word timing for animated keyword captions. Measured from the
    // real Vbee audio when faster-whisper is installed; otherwise proportional.
    // Alignment can never block a render: any failure falls back silently.
    let wordTiming="estimated";
    let timedWords=words.map((text,wi)=>({text,
      from:Math.floor(wi/words.length*(durationFrames-10)),
      to:Math.floor((wi+1)/words.length*(durationFrames-10))}));
    if(audioFile && process.env.KCI_WORD_ALIGN!=="0") {
      try {
        const scriptFile=path.join(out,"script-"+String(i+1).padStart(2,"0")+".txt");
        const alignFile=path.join(out,"words-"+String(i+1).padStart(2,"0")+".json");
        fs.writeFileSync(scriptFile,narration.trim(),"utf8");
        execFileSync(process.env.KCI_PYTHON||"python3",["scripts/align-words.py",path.resolve("public",audioFile),scriptFile,alignFile],{stdio:"inherit",timeout:600000});
        const aligned=JSON.parse(fs.readFileSync(alignFile,"utf8"));
        if(aligned.words?.length===words.length && aligned.matchedRatio>=0.5) {
          timedWords=aligned.words.map(w=>({text:w.text,from:Math.round(w.startMs*FPS/1000),to:Math.max(Math.round(w.startMs*FPS/1000)+1,Math.round(w.endMs*FPS/1000))}));
          wordTiming="measured:"+aligned.matchedRatio;
        } else {
          console.warn("Word alignment too weak for scene "+(i+1)+"; using proportional timing.");
        }
      } catch(error) {
        console.warn("Word alignment unavailable for scene "+(i+1)+": "+String(error?.message||error).slice(0,200));
      }
    }
    scenes.push({...scene,voiceText:narration,startFrame,durationFrames,audioFile,captions,words:timedWords,wordTiming,cta:dailyJob&&isLastScene?job.cta:undefined});
    startFrame+=durationFrames;
  }
  const props = {headline:job.headline,edition:job.edition,scenes,preview:mode==="preview"};
  fs.writeFileSync(path.join(out,"props.json"),JSON.stringify(props,null,2));

  // Proportional captions are approximate and require a listening QA pass.
  const timecode = (frame) => {
    const ms = Math.round(frame * 1000 / FPS);
    const h = String(Math.floor(ms / 3600000)).padStart(2,"0");
    const m = String(Math.floor(ms % 3600000 / 60000)).padStart(2,"0");
    const s = String(Math.floor(ms % 60000 / 1000)).padStart(2,"0");
    const part = String(ms % 1000).padStart(3,"0");
    return h+":"+m+":"+s+","+part;
  };
  const subtitleLines = [];
  let previousTo=0;
  for(const scene of scenes) {
    for(const cue of scene.captions) {
      const from=Math.max(previousTo,scene.startFrame+cue.from);
      const to=Math.max(from+1,scene.startFrame+cue.to);
      subtitleLines.push({from,to,text:cue.text});
      previousTo=to;
    }
  }
  fs.writeFileSync(path.join(out,"subtitles-estimated.srt"),subtitleLines.map((cue,i)=>
    String(i+1)+"\n"+timecode(cue.from)+" --> "+timecode(cue.to)+"\n"+cue.text+"\n"
  ).join("\n"),"utf8");
  if(dailyJob) {
    fs.writeFileSync(path.join(out,"source-ledger.json"),JSON.stringify({
      dataAsOf:job.dataAsOf,status:job.status,sourceLedger:job.sourceLedger,
      hook:job.hook,cta:job.cta,
    },null,2));
  }
  const outputFile=path.join(out,job.id+(mode==="preview"?"-preview":"")+".mp4");
  execFileSync("npx",["remotion","render","src/index.ts",dailyJob?"KciNewsDaily":"KciNews",outputFile,"--props="+path.join(out,"props.json"),"--codec=h264","--concurrency=2"],{stdio:"inherit",timeout:1200000});
  if (mode==="video") {
    const streams=execFileSync("ffprobe",["-v","error","-select_streams","a","-show_entries","stream=codec_name","-of","csv=p=0",outputFile],{encoding:"utf8"}).trim();
    if (!streams) throw new Error("No voice in the exported MP4. Rejecting.");
  }
  fs.writeFileSync(path.join(out,"qc.json"),JSON.stringify({job:job.id,status:"REVIEW_REQUIRED",mode,voicePresent:mode==="video",subtitles:"Estimated from words; requires listening alignment review",wordTiming:scenes.map(s=>s.wordTiming),ctaIncluded:dailyJob,composition:dailyJob?"KciNewsDaily":"KciNews",published:false},null,2));
  console.log("Output created; human review required:",outputFile);
}
