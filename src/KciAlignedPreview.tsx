import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type AlignedWord = {word: string; start: number; end: number};
export type AlignedBeat = {
  id: string; sceneId: string; trigger: string; startFrame: number; endFrame: number;
  keyword: string; label: string; value: string; context: string;
  kind?: string; words: AlignedWord[];
};
export type AlignedProps = {
  editingProfile: string; headline: string; edition: string;
  preview: boolean; technicalPreview: boolean; fps: number; durationInFrames: number;
  audioFile: string; voiceCode?: string;
  scenes: Array<{id: string; source: string; eyebrow: string; startSeconds: number; endSeconds: number}>;
  beats: AlignedBeat[];
};
const NAVY='#1c2c58'; const BLUE='#365daa'; const WHITE='#ffffff';
const expo=(x:number) => x >= 1 ? 1 : 1-Math.pow(2,-10*Math.max(0,x));
const box:React.CSSProperties={position:'absolute',left:56,width:884};
const safe=(extra:React.CSSProperties):React.CSSProperties=>({...box,...extra});

export const KciAlignedPreview:React.FC<AlignedProps>=(props)=>{
  const frame=useCurrentFrame(); const {fps,durationInFrames}=useVideoConfig();
  const root=useRef<HTMLDivElement>(null);
  const [fontHandle]=useState(()=>delayRender('Load local Inter font'));
  const [fontReady,setFontReady]=useState(false);
  useEffect(()=>{
    document.fonts.load('700 68px KciInter').then(()=>{
      setFontReady(true);continueRender(fontHandle);
    }).catch(cancelRender);
  },[fontHandle]);
  // Validate actual DOM rectangles/overflow, not only intended coordinates.
  useLayoutEffect(()=>{
    if(!fontReady || !root.current) return;
    const base=root.current.getBoundingClientRect(); const scale=base.width/1080;
    const errors:string[]=[];
    root.current.querySelectorAll<HTMLElement>('[data-kci-safe]').forEach((el)=>{
      const r=el.getBoundingClientRect();
      const x=(r.left-base.left)/scale, y=(r.top-base.top)/scale;
      const right=(r.right-base.left)/scale,bottom=(r.bottom-base.top)/scale;
      if(x<55 || y<220 || right>940.5 || bottom>1500.5 || el.scrollWidth>el.clientWidth+1 || el.scrollHeight>el.clientHeight+1)
        errors.push(`${el.dataset.kciSafe}: ${x},${y},${right},${bottom}; overflow ${el.scrollWidth-el.clientWidth}/${el.scrollHeight-el.clientHeight}`);
    });
    if(errors.length) cancelRender(new Error(`SAFE_ZONE_FRAME_${frame}: ${errors.join('; ')}`));
  },[frame,fontReady]);
  if(!props.beats.length) return <AbsoluteFill style={{backgroundColor:NAVY}}/>;
  const loop=frame>=durationInFrames-Math.round(.5*fps);
  const visualFrame=loop?0:frame;
  const beat=[...props.beats].reverse().find(b=>b.startFrame<=visualFrame) || props.beats[0];
  const scene=props.scenes.find(s=>s.id===beat.sceneId) || props.scenes[0];
  const elapsed=Math.max(0,visualFrame-beat.startFrame);
  const fadeFrames=Math.max(1,Math.round(.08*fps));
  const initial=beat.id===props.beats[0].id;
  const alpha=initial?1:Math.max(.08,Math.min(1,(elapsed+1)/fadeFrames));
  const words=beat.keyword.trim().split(/\s+/);
  const spoken=visualFrame/fps;
  const actualWords=beat.words;
  const normalized=(s:string)=>s.toLocaleLowerCase('vi').replace(/[^\p{L}\p{N}]/gu,'');
  const matched=words.map(w=>actualWords.find(a=>normalized(a.word)===normalized(w)));
  const activePhrase=actualWords.some(w=>spoken>=w.start && spoken<=w.end+.08);
  const shift=initial?0:8*(1-expo(elapsed/Math.max(1,Math.round(.4*fps))));
  const valueSize=beat.value.length>19?76:beat.value.length>12?94:beat.value.length>8?118:154;
  const isCta=beat.kind==='cta';
  return <AbsoluteFill ref={root} style={{backgroundColor:NAVY,color:WHITE,fontFamily:'KciInter, sans-serif',fontWeight:700}}>
    <style>{`@font-face{font-family:KciInter;src:url('${staticFile('fonts/Inter.ttf')}') format('truetype');font-weight:100 900;font-display:block}*{box-sizing:border-box}`}</style>
    {props.audioFile?<Audio src={staticFile(props.audioFile)}/>:null}
    <div style={{position:'absolute',left:0,top:0,width:26,height:1920,backgroundColor:BLUE}}/>
    <div data-kci-safe="review-label" style={safe({top:236,height:38,fontSize:23,letterSpacing:1.3,color:'rgba(255,255,255,.8)'})}>
      {props.technicalPreview?'PREVIEW KỸ THUẬT · KHÔNG PHÁT HÀNH':props.preview?'PREVIEW · CHỜ DUYỆT · CHƯA ĐĂNG':'KOREA CAPITAL INSIGHT'}
    </div>
    <div data-kci-safe="brand" style={safe({top:304,height:48,fontSize:35,letterSpacing:.3})}>KOREA CAPITAL INSIGHT</div>
    <div data-kci-safe="section" style={safe({top:377,height:72,fontSize:28,lineHeight:1.25,color:'rgba(255,255,255,.82)'})}>{scene.eyebrow}</div>
    <div data-kci-safe="fact-card" style={safe({top:480,height:564,backgroundColor:WHITE,color:NAVY,borderRadius:24,padding:34})}>
      <div data-kci-safe="fact-label" style={{position:'absolute',left:34,top:42,width:816,height:82,fontSize:34,lineHeight:1.2,color:BLUE}}>{beat.label}</div>
      <div data-kci-safe="fact-value" style={{position:'absolute',left:34,top:160,width:816,height:194,fontSize:valueSize,lineHeight:1.1,letterSpacing:-2,display:'flex',alignItems:'center'}}>
        {isCta?<svg aria-hidden width="82" height="82" viewBox="0 0 64 64" style={{marginRight:20,flexShrink:0}}><path d="M8 10h48v34H29L15 55V44H8z" fill="none" stroke={BLUE} strokeWidth="4"/></svg>:null}
        {beat.value}
      </div>
      <div data-kci-safe="fact-context" style={{position:'absolute',left:34,top:386,width:816,height:150,fontSize:29,lineHeight:1.34,fontWeight:500}}>{beat.context}</div>
    </div>
    <div data-kci-safe="keyword" style={safe({top:1122+shift,height:174,backgroundColor:WHITE,color:NAVY,borderRadius:18,padding:'28px 24px',fontSize:68,lineHeight:1.08,opacity:alpha,display:'flex',alignItems:'center',justifyContent:'center',flexWrap:'wrap',gap:'0 16px',textShadow:'0 1px 1px rgba(0,0,0,.06)'})}>
      {words.map((word,i)=>{
        const m=matched[i];const active=m?(spoken>=m.start && spoken<m.end+.08):activePhrase;
        return <span key={`${beat.id}-${i}`} style={{color:active?BLUE:NAVY}}>{word}</span>;
      })}
    </div>
    <div data-kci-safe="source" style={safe({top:1340,height:58,fontSize:23,lineHeight:1.24,fontWeight:500,color:'rgba(255,255,255,.88)'})}>{scene.source}</div>
    <div data-kci-safe="date" style={safe({top:1416,height:32,fontSize:22,fontWeight:500})}>{props.edition}</div>
    <div data-kci-safe="disclaimer" style={safe({top:1461,height:30,fontSize:21,fontWeight:500,color:'rgba(255,255,255,.8)'})}>Thông tin tham khảo, không phải khuyến nghị đầu tư cá nhân.</div>
  </AbsoluteFill>;
};
