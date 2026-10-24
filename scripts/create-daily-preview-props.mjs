import fs from "node:fs";
import {validateKciJob} from "./validate-kci-job.mjs";
const job=validateKciJob(JSON.parse(fs.readFileSync(
  "jobs/kci-schema-v2-example.json","utf8",
)));
fs.mkdirSync("out",{recursive:true});
let position=0;
const scenes=job.scenes.map((scene,i)=>{
  const durationFrames=270;
  const voiceText=scene.voiceText +
    (i===job.scenes.length-1?" "+job.cta.spoken:"");
  const chunks=voiceText.trim().split(/\s+/);
  const captions=[];
  for(let p=0;p<chunks.length;p+=7){
    captions.push({
      from:Math.floor(p/chunks.length*250),
      to:Math.min(250,Math.ceil((p+7)/chunks.length*250)),
      text:chunks.slice(p,p+7).join(" "),
    });
  }
  const s={...scene,startFrame:position,durationFrames,captions,
    audioFile:undefined,
    cta:i===job.scenes.length-1?job.cta:undefined,
  };
  position+=durationFrames;
  return s;
});
const props={headline:job.headline,edition:job.edition,scenes,preview:true};
fs.writeFileSync("out/kci-daily-preview-props.json",JSON.stringify(props,null,2));
console.log("Data-driven KCI preview created:",scenes.length,"scenes, no Vbee calls.");
