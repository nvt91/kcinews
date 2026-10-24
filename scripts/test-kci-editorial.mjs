import fs from "node:fs";
import {validateKciJob} from "./validate-kci-job.mjs";
const source=JSON.parse(fs.readFileSync("jobs/kci-schema-v2-example.json","utf8"));
const copy=(x)=>JSON.parse(JSON.stringify(x));
validateKciJob(source);
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
reject(j=>{j.scenes[1].sourceIds=["invented-source"]; },"unattributed scene");
reject(j=>{j.hook.spoken="A promise of guaranteed gains";},"mismatched hook");
reject(j=>{j.scenes[0].visual.milestones=[];},"fictional timeline");
reject(j=>{j.scenes[1].visual.bars[0].value=NaN;},"invalid chart metric");
reject(j=>{j.template="KciNewsV2";},"stale hardcoded graphics in a daily video");
reject(j=>{j.scenes.at(-1).voiceText+=" "+j.cta.spoken;},"CTA duplication");
console.log("KCI editorial validator regression tests: PASS");
