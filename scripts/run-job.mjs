import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {synthesizeVbee,checkVbeeSettings} from './vbee.mjs';
import {validateKciJob} from './validate-kci-job.mjs';

const argument=name=>process.argv.find(x=>x.startsWith(`--${name}=`))?.slice(name.length+3);
const explicitMode=argument('mode'),explicitJob=argument('job');
let mode=explicitMode||process.env.KCI_MODE||'validate';
let jobFile=explicitJob||process.env.KCI_JOB||'jobs/kci-2026-10-23.json';
if(process.env.GITHUB_EVENT_NAME==='issues'){
  const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
  if(event.action!=='opened')throw new Error('Ignored non-new issue event');
  const issue=event.issue||{};
  if(issue.user?.login!==process.env.GITHUB_REPOSITORY_OWNER)throw new Error('Only the repository owner can request synthesis');
  const match=/^\[KCI (VOICE TEST|VIDEO)\](?:\s|$)/.exec(issue.title||'');
  if(!match)throw new Error('Unrecognized KCI issue title');
  const body=JSON.parse(issue.body||'{}');
  if(Object.keys(body).some(key=>key!=='job'))throw new Error('Issue body may only select a checked-in job');
  if(!explicitMode) mode=match[1]==='VOICE TEST'?'voice-test':'preview';
  if(!explicitJob) jobFile=body.job||jobFile;
}
// Backward-compatible invocation name, but NEVER automatic final output.
if(mode==='video')mode='preview';
if(!['validate','preview','voice-test','final'].includes(mode))throw new Error('Invalid mode');
if(!/^jobs\/[\w-]+\.json$/.test(jobFile))throw new Error('Job filename must be within jobs/');
const job=JSON.parse(fs.readFileSync(jobFile,'utf8'));
const dailyJob=job.schemaVersion===2;
if(dailyJob)validateKciJob(job);
if(!/^[a-z0-9-]{5,90}$/.test(job.id)||!Array.isArray(job.scenes)||job.scenes.length<1||job.scenes.length>12)throw new Error('Invalid job data');
const seen=new Set();
for(const scene of job.scenes){
  if(!/^[\w-]+$/.test(scene.id)||seen.has(scene.id))throw new Error('Invalid scene id');
  seen.add(scene.id);
  for(const key of ['eyebrow','headline','summary','voiceText','source']){
    if(typeof scene[key]!=='string'||scene[key].length<3)throw new Error('Missing scene field '+key);
  }
  if(scene.voiceText.length>1400||scene.headline.length>105||scene.summary.length>190)throw new Error('Scene too long');
  if(!Array.isArray(scene.stats)||scene.stats.length>3)throw new Error('Invalid stats');
}
console.log('Validated',job.id,job.scenes.length,'scenes. No synthesis in validate mode.');
if(mode==='validate')process.exit(0);
if(mode==='final'){
  if(process.env.GITHUB_EVENT_NAME==='issues')throw new Error('No final export from ordinary video issue');
  const {runPreview}=await import('./run-voiced-preview.mjs');
  await runPreview({mode:'final',output:argument('output')||'output',approval:argument('approval')});
  process.exit(0);
}
if(mode==='preview'){
  if(!dailyJob)throw new Error('BLOCKED_LEGACY_JOB: migrate to a source-backed schema-v2 job and reviewed beat plan');
  const {produceVoicedPreview}=await import('./produce-voiced-preview.mjs');
  await produceVoicedPreview(job,jobFile);
  process.exit(0);
}
if(mode==='voice-test'){
  checkVbeeSettings();
  fs.mkdirSync('out',{recursive:true});fs.mkdirSync('public/voice',{recursive:true});
  const target=path.resolve('public/voice/voice-test.mp3');
  if(fs.existsSync(target))throw new Error('Existing voice test must be reviewed/reused, not overwritten');
  await synthesizeVbee(job.voiceTestText||job.scenes[0].voiceText,target);
  const seconds=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',target],{encoding:'utf8'}).trim());
  if(!Number.isFinite(seconds)||seconds<.5||seconds>95)throw new Error('Invalid voice-test duration');
  fs.copyFileSync(target,'out/vbee-voice-test.mp3');
  fs.writeFileSync('out/qc.json',JSON.stringify({stage:'VOICE_TEST',voiceCode:process.env.VBEE_VOICE_CODE,seconds,listening:'REQUIRED',published:false},null,2));
  console.log('Voice test created; listening review required. No preview/final generated.');
}
