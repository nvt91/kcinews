import fs from "node:fs";
import { execFileSync } from "node:child_process";
import {validateKciJob} from "./validate-kci-job.mjs";
const source=JSON.parse(fs.readFileSync("jobs/kci-schema-v2-example.json","utf8"));
const copy=(x)=>JSON.parse(JSON.stringify(x));
// Regression: 09 Nov KR_CLOSE was editorial-schema valid, but the paid
// runner's separate 3-card ceiling blocked it before any Vbee call.
// Preflight must exercise the *same* non-billable runner validation.
const krClose=JSON.parse(fs.readFileSync("jobs/kci-2026-11-09-kr-close.json","utf8"));
validateKciJob(krClose);
if(krClose.scenes.find(s=>s.id==="sectors")?.stats?.length!==4){
  throw new Error("KR_CLOSE regression requires exactly four sector stats");
}
const runnerValidation=execFileSync(process.execPath,[
  "scripts/run-job.mjs", "--mode=validate",
  "--job=jobs/kci-2026-11-09-kr-close.json"
],{encoding:"utf8"});
if(!runnerValidation.includes("Validated kci-2026-11-09-kr-close")){
  throw new Error("Paid runner did not validate the fixed KR_CLOSE regression job");
}
const invalidFive=copy(krClose);
invalidFive.scenes.find(s=>s.id==="sectors").stats.push({
  label:"UNSOURCED EXTRA", value:"+1%", tone:"up"
});
let rejectedFive=false;
try{ validateKciJob(invalidFive); }catch(e){
  rejectedFive=String(e.message).includes("invalid stat cards");
}
if(!rejectedFive)throw new Error("Expected schema validator to reject a fifth stat card");

validateKciJob(source);
// Regression fixture: the exact 07/11 US_AM production job must pass before any paid issue.
const usAm=JSON.parse(fs.readFileSync("jobs/kci-2026-11-07-us-am.json","utf8"));
validateKciJob(usAm);
// Regression: 07/11 MACRO21 pre-TTS failure 42370942236: no primary evidence.
// This exact repaired job must pass, and removing its official cross-check must fail.
const macro21=JSON.parse(fs.readFileSync("jobs/kci-2026-11-07-macro21.json","utf8"));
validateKciJob(macro21);
if(!macro21.sourceLedger.some(s=>s.kind==="primary" &&
  macro21.scenes.some(scene=>scene.sourceIds.includes(s.id)))) {
  throw new Error("MACRO21 primary source must be relevant and linked to at least one scene");
}
const macroWithoutPrimary=copy(macro21);
for(const s of macroWithoutPrimary.sourceLedger)s.kind="secondary";
let primaryGateRejected=false;
try{validateKciJob(macroWithoutPrimary);}catch(e){
  primaryGateRejected=String(e.message).includes("primary-source cross-check required");
}
if(!primaryGateRejected)throw new Error("Expected primary-source gate to reject MACRO21 without primary evidence");
const reject=(mutate,label)=>{
  const job=copy(source);
  mutate(job);
  let failed=false;
  try{validateKciJob(job);}catch{failed=true;}
  if(!failed)throw new Error("Expected validator to reject "+label);
};
reject(j=>{j.cta.spoken="";},"empty CTA");
reject(j=>{j.cta.type="spam";},"invalid CTA kind");
reject(j=>{j.cta.question="";},"unanswerable comment CTA");
reject(j=>{j.sourceLedger[0].url="http://example.com";},"non-HTTPS source");
reject(j=>{j.sourceLedger[0].kind="analysis";},"unsupported research classification (use primary or secondary)");
reject(j=>{j.scenes[1].sourceIds=["invented-source"]; },"unattributed scene");
reject(j=>{j.hook.spoken="A promise of guaranteed gains";},"mismatched hook");
reject(j=>{j.scenes[0].visual.milestones=[];},"fictional timeline");
reject(j=>{j.scenes[1].visual.bars[0].value=NaN;},"invalid chart metric");
reject(j=>{j.template="KciNewsV2";},"stale hardcoded graphics in a daily video");
reject(j=>{j.scenes.at(-1).voiceText+=" "+j.cta.spoken;},"CTA duplication");
// Exercise the two defects seen in GitHub run 42315821888 against the real episode.
const rejectUsAm=(mutate,label)=>{
  const job=copy(usAm);
  mutate(job);
  let rejected=false;
  try{validateKciJob(job);}catch{rejected=true;}
  if(!rejected)throw new Error("Expected US_AM validator to reject "+label);
};
rejectUsAm(j=>{j.sourceLedger.find(x=>x.id==="fx-mufg").kind="analysis";},"unsupported MUFG source kind");
rejectUsAm(j=>{j.scenes.at(-1).voiceText=j.cta.spoken+" "+j.scenes.at(-1).voiceText;},"repeated spoken outro CTA");
console.log("KCI editorial validator regression tests: PASS");
