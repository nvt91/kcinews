import fs from "node:fs";
import { execFileSync } from "node:child_process";
import {validateKciJob, validateKciJobDetailed} from "./validate-kci-job.mjs";
import {formatKciScript} from "./export-kci-script.mjs";
const source=JSON.parse(fs.readFileSync("jobs/kci-schema-v2-example.json","utf8"));
const copy=(x)=>JSON.parse(JSON.stringify(x));
const quiet={quiet:true};
// Regression: 09 Nov KR_CLOSE was editorial-schema valid, but the paid
// runner's separate 3-card ceiling blocked it before any Vbee call.
// Preflight must exercise the *same* non-billable runner validation.
const krClose=JSON.parse(fs.readFileSync("jobs/kci-2026-11-09-kr-close.json","utf8"));
validateKciJob(krClose,quiet);
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
try{ validateKciJob(invalidFive,quiet); }catch(e){
  rejectedFive=String(e.message).includes("invalid stat cards");
}
if(!rejectedFive)throw new Error("Expected schema validator to reject a fifth stat card");

validateKciJob(source,quiet);
const usAm=JSON.parse(fs.readFileSync("jobs/kci-2026-11-07-us-am.json","utf8"));
validateKciJob(usAm,quiet);
const macro21=JSON.parse(fs.readFileSync("jobs/kci-2026-11-07-macro21.json","utf8"));
validateKciJob(macro21,quiet);

// 17/11/2026 owner directive: editorial process rules WARN, they never block production.
const expectWarning=(job,needle,label)=>{
  const {warnings}=validateKciJobDetailed(job);
  if(!warnings.some(w=>w.includes(needle)))throw new Error("Expected warning (not block) for "+label);
};
const macroWithoutPrimary=copy(macro21);
for(const s of macroWithoutPrimary.sourceLedger)s.kind="secondary";
expectWarning(macroWithoutPrimary,"primary","missing primary source");
const singleSource=copy(macro21);
singleSource.sourceLedger=[singleSource.sourceLedger[0]];
for(const scene of singleSource.scenes)scene.sourceIds=[singleSource.sourceLedger[0].id];
expectWarning(singleSource,"only one source","single source");
const dupCta=copy(source);
dupCta.scenes.at(-1).voiceText+=" "+dupCta.cta.spoken;
expectWarning(dupCta,"CTA","CTA duplication");
const hookMismatch=copy(source);
hookMismatch.hook.spoken="Một mở đầu khác hẳn các candidate đã viết";
expectWarning(hookMismatch,"hook","mismatched hook");

// Hard errors that still block: broken render data or investment promises.
const reject=(mutate,label)=>{
  const job=copy(source);
  mutate(job);
  let failed=false;
  try{validateKciJob(job,quiet);}catch{failed=true;}
  if(!failed)throw new Error("Expected validator to reject "+label);
};
reject(j=>{j.cta.spoken="";},"empty CTA");
reject(j=>{j.cta.type="spam";},"invalid CTA kind");
reject(j=>{j.cta.question="";},"unanswerable comment CTA");
reject(j=>{j.sourceLedger[0].url="http://example.com";},"non-HTTPS source");
reject(j=>{j.sourceLedger[0].kind="analysis";},"unsupported research classification (use primary or secondary)");
reject(j=>{j.sourceLedger=[];},"empty source ledger");
reject(j=>{j.scenes[1].sourceIds=["invented-source"]; },"unattributed scene");
reject(j=>{j.hook.spoken="Cổ phiếu này chắc chắn tăng trong tuần tới";},"guaranteed-return hook");
reject(j=>{j.scenes[0].visual.milestones=[];},"fictional timeline");
reject(j=>{j.scenes[1].visual.bars[0].value=NaN;},"invalid chart metric");
reject(j=>{j.template="KciNewsV2";},"stale hardcoded graphics in a daily video");
// Negated warnings are investor-safe and must not block (17/11 MACRO21 issue #109).
const negated=copy(source);
negated.scenes[1].voiceText+=" Không thể suy ra đồng won chắc chắn giảm.";
validateKciJob(negated,quiet);
expectWarning(negated,"tránh cụm","negated promise phrase still flagged for rewrite");
reject(j=>{j.scenes[1].voiceText+=" Cổ phiếu chip chắc chắn tăng tuần tới.";},"un-negated promise in scene");
reject(j=>{j.cta.spoken+=" Không mua sẽ tiếc.";},"FOMO pressure in CTA");

// Friendly script export must render every scene plus the closing CTA block.
const script=formatKciScript(usAm);
if(!script.startsWith("KCI | ")||!script.includes("Cảnh 1 — Hook")||
  !script.includes("Cảnh kết — CTA")||!script.includes("Lời dẫn:")){
  throw new Error("Friendly script export is missing required sections");
}
console.log("KCI editorial validator regression tests: PASS");
