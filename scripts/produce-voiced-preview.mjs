import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {synthesizeVbee,checkVbeeSettings} from './vbee.mjs';
import {runPreview} from './run-voiced-preview.mjs';

const VOICE='n_hanoi_male_anhkhoitintuc_zero_shot_news_vc';
const normalized=s=>s.normalize('NFC').toLocaleLowerCase('vi').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export async function produceVoicedPreview(job,jobFile){
  let plan=job.editingPlan;
  if(!plan && job.editingPlanPath){
    if(!/^(jobs|editorial)\/[\w/.-]+\.json$/.test(job.editingPlanPath) || job.editingPlanPath.includes('..')) throw new Error('Invalid local editingPlanPath');
    plan=JSON.parse(fs.readFileSync(job.editingPlanPath,'utf8'));
  }
  if(!plan || plan.inputKind!=='tts_motion' || !Array.isArray(plan.beats) || !plan.beats.length)
    throw new Error('BLOCKED_BEAT_PLAN: provide reviewed editingPlan with exact spoken triggers before TTS');
  const narration=job.scenes.map((s,i)=>s.voiceText+(i===job.scenes.length-1?' '+job.cta.spoken:''));
  for(const beat of plan.beats){
    const index=job.scenes.findIndex(s=>s.id===beat.sceneId);
    if(index<0 || !beat.trigger || !normalized(narration[index]).includes(normalized(beat.trigger))) throw new Error('Effect trigger not found in narration');
    if(!beat.keyword || !beat.label || !beat.value || !beat.context || beat.keyword.trim().split(/\s+/).length<2 || beat.keyword.trim().split(/\s+/).length>4) throw new Error('Invalid two-to-four-word effect cue');
  }
  // Capability checks precede every potentially billable call.
  execFileSync('python',['-c','import stable_whisper,faster_whisper,numpy'],{stdio:'pipe'});
  if(!fs.existsSync('public/fonts/Inter.ttf')) throw new Error('BLOCKED_FONT: Inter unavailable before TTS');
  if(process.env.VBEE_VOICE_CODE && process.env.VBEE_VOICE_CODE!==VOICE) throw new Error('Wrong configured voice; no fallback');
  process.env.VBEE_VOICE_CODE=VOICE;
  const out=path.resolve('output'),cache=path.resolve('public/voice-cache',job.id);
  fs.mkdirSync(out,{recursive:true});fs.mkdirSync(cache,{recursive:true});
  const scenes=[];
  for(let i=0;i<job.scenes.length;i++){
    const text=narration[i];
    const key=crypto.createHash('sha256').update(JSON.stringify({voice:VOICE,text})).digest('hex');
    const target=path.join(cache,`${key}.mp3`),pending=path.join(cache,`${key}.pending.json`),receipt=path.join(cache,`${key}.json`);
    if(fs.existsSync(pending)) throw new Error('TTS_REQUEST_UNRESOLVED: inspect preserved request/artifact; do not blindly retry');
    if(!fs.existsSync(target)){
      checkVbeeSettings();
      fs.writeFileSync(pending,JSON.stringify({voiceCode:VOICE,scriptHash:key,startedAt:new Date().toISOString(),status:'REQUEST_STARTED_DO_NOT_REPEAT'},null,2));
      await synthesizeVbee(text,target);
      const seconds=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',target],{encoding:'utf8'}).trim());
      if(!Number.isFinite(seconds)||seconds<.5) throw new Error('Invalid audio, preserve pending state');
      fs.writeFileSync(receipt,JSON.stringify({voiceCode:VOICE,scriptHash:key,audioSha256:crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'),seconds},null,2));
      fs.unlinkSync(pending);
    }else{
      if(!fs.existsSync(receipt)) throw new Error('Audio without verified cache receipt; do not overwrite or re-synthesize');
      const r=JSON.parse(fs.readFileSync(receipt,'utf8'));
      if(r.voiceCode!==VOICE||r.scriptHash!==key||r.audioSha256!==crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')) throw new Error('Voice cache mismatch');
    }
    scenes.push({...job.scenes[i],voiceText:text,audioFile:path.relative('public',target).replaceAll('\\','/')});
  }
  const sourceProps=path.join(out,'generated-source-props.json'),planPath=path.join(out,'generated-editing-plan.json');
  fs.writeFileSync(sourceProps,JSON.stringify({headline:job.headline,edition:job.edition,preview:true,scenes},null,2));
  fs.writeFileSync(planPath,JSON.stringify({...plan,voiceCode:VOICE,sourceProvenance:{articleId:job.articleId??job.id,jobFile,dataAsOf:job.dataAsOf}},null,2));
  fs.writeFileSync(path.join(out,'source-ledger.json'),JSON.stringify({dataAsOf:job.dataAsOf,sourceLedger:job.sourceLedger,hook:job.hook,cta:job.cta},null,2));
  return runPreview({mode:'preview',props:sourceProps,audioRoot:'public',plan:planPath,output:out,id:job.id,fps:30,version:job.previewVersion??'v1'});
}
