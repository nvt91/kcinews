import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const arg=(name,fallback)=>process.argv.find(x=>x.startsWith(`--${name}=`))?.slice(name.length+3) ?? fallback;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2));
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const execute=(cmd,args,opts={})=>execFileSync(cmd,args,{encoding:'utf8',timeout:1800000,maxBuffer:32*1024*1024,...opts});
const probe=p=>JSON.parse(execute('ffprobe',['-v','error','-show_format','-show_streams','-of','json',p]));
function ffmpegLog(args){
  // spawnSync retains stderr for measured loudness and black-frame checks.
  return import('node:child_process').then(({spawnSync})=>{
    const r=spawnSync('ffmpeg',args,{encoding:'utf8',timeout:1800000,maxBuffer:32*1024*1024});
    if(r.status!==0) throw new Error(`FFmpeg failed: ${r.stderr?.slice(-3000)}`);
    return r.stderr;
  });
}
function measurement(log){
  const matches=[...log.matchAll(/\{\s*"input_i"[\s\S]*?\}/g)];
  if(!matches.length) throw new Error('Missing real loudness measurement');
  return JSON.parse(matches.at(-1)[0]);
}
export function verifyFinalApproval(out,approvalPath,owner='nvt91'){
  if(!approvalPath || !fs.existsSync(approvalPath)) throw new Error('OWNER_APPROVAL_REQUIRED: preview must be approved before final');
  const a=read(approvalPath), identity=read(path.join(out,'preview-identity.json'));
  if(a.stage!=='final' || a.approvedBy!==owner || a.previewSha256!==digest(path.join(out,'preview.mp4')) || a.previewSha256!==identity.previewSha256 || a.propsSha256!==identity.propsSha256 || a.audioSha256!==identity.audioSha256)
    throw new Error('APPROVAL_CUT_MISMATCH');
  if(!a.reference || !a.approvedAt || !Number.isFinite(Date.parse(a.approvedAt)) || a.checks?.listening!=='PASS' || a.checks?.wordSync!=='PASS' || a.checks?.facts!=='PASS')
    throw new Error('APPROVAL_EVIDENCE_INCOMPLETE: no self-approval or estimated-sync pass');
  const props=path.join(out,'aligned-props.json');
  if(digest(props)!==identity.propsSha256) throw new Error('PROPS_CHANGED_AFTER_PREVIEW');
  return {approval:a,identity};
}
export async function runPreview(options={}){
  const mode=options.mode ?? arg('mode','preview');
  const out=path.resolve(options.output ?? arg('output','output'));
  if(!['preview','final'].includes(mode)) throw new Error('Only preview or explicitly approved final');
  fs.mkdirSync(out,{recursive:true});
  let approval;
  if(mode==='final') approval=verifyFinalApproval(out,options.approval ?? arg('approval'));
  let props;
  if(mode==='preview'){
    const propsFile=options.props ?? arg('props');
    const audioRoot=options.audioRoot ?? arg('audio-root');
    const planFile=options.plan ?? arg('plan');
    if(!propsFile || !audioRoot || !planFile) throw new Error('Need exact narration props, local audio root and reviewed beat plan');
    const source=read(propsFile),plan=read(planFile);
    if(plan.inputKind!=='tts_motion' || !Array.isArray(plan.beats) || !plan.beats.length) throw new Error('Reviewed tts_motion beat plan required; footage not silently supported');
    for(const b of plan.beats){
      const s=source.scenes.find(s=>s.id===b.sceneId);
      if(!s || !b.trigger || !b.keyword || !b.label || !b.value || !b.context) throw new Error('Incomplete source-linked effect beat');
      const n=b.keyword.trim().split(/\s+/).length;
      if(n<2 || n>4) throw new Error('Keyword cue must contain two to four words');
    }
    if(!fs.existsSync('public/fonts/Inter.ttf')) throw new Error('Inter font missing; install before audio synthesis');
    execute('python',['-c','import stable_whisper, faster_whisper, numpy']);
    const id=(options.id ?? arg('id','word-preview')).replace(/[^a-zA-Z0-9_-]/g,'-');
    const assetDir=path.resolve('public/aligned',id);
    execute('python',['scripts/align-kci-audio.py','--props',propsFile,'--audio-root',audioRoot,'--plan',planFile,'--output',out,'--asset-dir',assetDir,'--fps',String(options.fps ?? arg('fps',30)),'--model',options.model ?? arg('model','small')],{stdio:'inherit'});
    const raw=path.join(assetDir,'narration-edited.wav'),master=path.join(assetDir,'narration-master.wav');
    const chain='highpass=f=80,acompressor=threshold=0.125:ratio=2:attack=10:release=80:makeup=1';
    const m=measurement(await ffmpegLog(['-hide_banner','-i',raw,'-af',`${chain},loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json`,'-f','null','-']));
    const norm=`loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=json`;
    await ffmpegLog(['-y','-hide_banner','-i',raw,'-af',`${chain},${norm}`,'-ar','48000','-c:a','pcm_s16le',master]);
    write(path.join(out,'audio-processing.json'),{chain,normalizationTargetLUFS:-14,preEncodeTruePeakMargin:-1.5,measuredInput:m,denoise:'bypassed for clean TTS',music:false,sfx:false});
    props=read(path.join(out,'aligned-props.json'));
    fs.copyFileSync(master,path.join(out,'narration-preview.wav'));
    fs.copyFileSync(propsFile,path.join(out,'source-props.json'));
    fs.copyFileSync(planFile,path.join(out,'reviewed-plan.json'));
  }else{
    props=read(path.join(out,'aligned-props.json'));
    if(digest(path.join('public',props.audioFile))!==approval.identity.audioSha256) throw new Error('AUDIO_CHANGED_AFTER_PREVIEW');
    props={...props,preview:false};
  }
  const {bundle}=await import('@remotion/bundler');
  const {selectComposition,renderMedia}=await import('@remotion/renderer');
  const serveUrl=await bundle({entryPoint:path.resolve('src/aligned-index.tsx')});
  const composition=await selectComposition({serveUrl,id:'KciNewsDaily',inputProps:props});
  const outputFile=path.join(out,mode==='preview'?'preview.mp4':'final.mp4');
  await renderMedia({serveUrl,composition,inputProps:props,outputLocation:outputFile,codec:'h264',audioCodec:'aac',pixelFormat:'yuv420p',videoBitrate:mode==='final'?'18M':'8M',audioBitrate:'320k',x264Preset:'veryfast',concurrency:2,overwrite:true});
  execute('ffmpeg',['-v','error','-i',outputFile,'-f','null','-']);
  const encoded=probe(outputFile),video=encoded.streams.find(s=>s.codec_type==='video'),audio=encoded.streams.find(s=>s.codec_type==='audio');
  if(!audio || audio.codec_name!=='aac' || video?.codec_name!=='h264' || video.width!==1080 || video.height!==1920) throw new Error('Invalid encoded preview streams');
  const loud=measurement(await ffmpegLog(['-hide_banner','-i',outputFile,'-af','loudnorm=I=-14:TP=-1:LRA=7:print_format=json','-f','null','-']));
  const blackLog=await ffmpegLog(['-hide_banner','-i',outputFile,'-vf','blackdetect=d=0.02:pic_th=0.99:pix_th=0.10','-an','-f','null','-']);
  const blackFrames=/black_start:/.test(blackLog);
  if(blackFrames) throw new Error('BLACK_FRAME_DETECTED');
  if(Number(loud.input_tp)>-1 || Math.abs(Number(loud.input_i)+14)>.6) throw new Error('ENCODED_AUDIO_TARGET_FAILED: '+JSON.stringify(loud));
  const beats=read(path.join(out,'effects-map.json'));
  const indices=new Set([0,Math.floor(props.durationInFrames/2),props.durationInFrames-1]);
  const stillManifest=[];
  for(const beat of beats){
    const settled=Math.min(beat.endFrame-1,beat.startFrame+Math.round(.2*props.fps));
    const nearby=[Math.max(0,beat.startFrame-1),beat.startFrame,beat.startFrame+1,settled];
    nearby.forEach(f=>indices.add(f));
    stillManifest.push({beatId:beat.id,trigger:beat.trigger,onsetFrame:beat.startFrame,settledFrame:settled,adjacentFrames:nearby.slice(0,3),groundTruthSyncStatus:'REQUIRES_LISTENING_REVIEW'});
  }
  const sorted=[...indices].sort((a,b)=>a-b);
  const framesDir=path.join(out,'frames');fs.mkdirSync(framesDir,{recursive:true});
  execute('ffmpeg',['-y','-v','error','-i',outputFile,'-vf',`select='${sorted.map(n=>`eq(n,${n})`).join('+')}'`,'-vsync','0',path.join(framesDir,'frame-%05d.png')]);
  const names=new Map(sorted.map((n,i)=>[n,`frame-${String(i+1).padStart(5,'0')}.png`]));
  for(const s of stillManifest){s.still=`frames/${names.get(s.settledFrame)}`;s.adjacentStills=s.adjacentFrames.map(f=>`frames/${names.get(f)}`);}
  write(path.join(out,'beat-stills.json'),stillManifest);write(path.join(out,'frame-index.json'),sorted.map((frame,i)=>({frame,file:`frames/frame-${String(i+1).padStart(5,'0')}.png`})));
  const metrics=read(path.join(out,'metrics.json'));
  Object.assign(metrics,{encodedDurationSeconds:Number(encoded.format.duration),encodedVideoBitrate:Number(video.bit_rate),encodedAudioBitrate:Number(audio.bit_rate),encodedFps:video.avg_frame_rate,integratedLUFS:Number(loud.input_i),truePeakDbTP:Number(loud.input_tp),blackFrameCheck:'PASS',decode:'PASS',domSafeBounds:'PASS for rendered frames; component throws on overflow',beatCount:beats.length,beatStills:stillManifest.length,finalRendered:mode==='final'});
  write(path.join(out,'metrics.json'),metrics);
  write(path.join(out,`qc-${mode}.json`),{status:mode==='preview'?'PREVIEW_QA_REQUIRED':'FINAL_QA_REQUIRED',automated:{decode:true,blackFrames:false,voiceStreamPresent:true,encodedAudioTargets:true,domSafeBounds:true,everyBeatStill:true},requiresListening:['Vietnamese pronunciation','independent acoustic word-onset validation within two frames','subjective clicks/pops and naturalness'],face:'N/A: no footage/face',wordTiming:'Whisper forced alignment on actual edited audio, NOT word-count estimates',published:false});
  if(mode==='preview') write(path.join(out,'preview-identity.json'),{stage:'PREVIEW',version:options.version ?? arg('version','v1'),previewSha256:digest(outputFile),propsSha256:digest(path.join(out,'aligned-props.json')),audioSha256:digest(path.join('public',props.audioFile)),planSha256:digest(path.join(out,'reviewed-plan.json')),createdAt:new Date().toISOString(),voiceCode:props.voiceCode,sourceProvenance:props.sourceProvenance});
  console.log(`${mode.toUpperCase()}_QA_REQUIRED: ${outputFile}; no publication; no unapproved final.`);
  return outputFile;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) await runPreview();
