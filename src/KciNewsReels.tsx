import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from "remotion";
import type {KciCta, KciVideoProps, KciVisual, RenderScene} from "./KciNews";

/** Owner's 24 October revision: use the full middle width, not a narrow card.
 * Top/bottom clearance stays; only lower overlays reserve the right action rail.
 * Internal screenshot-based layout, not an official platform specification. */
export const KCI_REELS_SAFE = {left:56,right:56,top:264,bottom:480,width:968} as const;
export const KCI_REELS_LOWER = {left:56,right:166,width:858} as const;
const P={bg:"#071224",teal:"#36DEC0",red:"#FF647D",blue:"#63BFFE",amber:"#FFD187",white:"#F8FCFF",muted:"#A6BDD1",border:"#3B5A75"};
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const ease=(f:number,start=0,len=18)=>interpolate(f,[start,start+len],[0,1],{...clamp,easing:Easing.out(Easing.cubic)});
const enter=(f:number,start=0):React.CSSProperties=>({opacity:ease(f,start),transform:`translateY(${(1-ease(f,start))*14}px)`});
const tone=(t?:string)=>t==="down"?P.red:t==="up"?P.teal:P.white;
const zone=(top:number,height:number,lower=false):React.CSSProperties=>({position:"absolute",left:56,width:lower?KCI_REELS_LOWER.width:KCI_REELS_SAFE.width,top,height,boxSizing:"border-box"});
const small:React.CSSProperties={fontSize:25,lineHeight:1.3,color:P.muted};

const Background:React.FC<{f:number;color:string}>=({f,color})=>(
  <AbsoluteFill style={{background:"linear-gradient(135deg,#061126,#10243C 61%,#061226)",overflow:"hidden"}}>
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 72% 40%,${color}20,transparent 62%)`}}/>
    <AbsoluteFill style={{backgroundImage:"linear-gradient(90deg,#6A9FB21A 1px,transparent 1px),linear-gradient(#6A9FB21A 1px,transparent 1px)",backgroundSize:"88px 88px",transform:`translate(${f*.16%88}px,${f*.1%88}px)`}}/>
    {[0,1,2].map(i=><div key={i} style={{position:"absolute",left:800+i*40,top:420+i*70,width:360+i*90,height:360+i*90,borderRadius:"50%",border:`2px solid ${color}19`,transform:`rotate(${f*.2}deg)`}}/>)}
  </AbsoluteFill>
);

const Masthead:React.FC<{edition:string;index:number;count:number;color:string}>=({edition,index,count,color})=>(
  <>
    <div data-kci-safe="masthead" style={{...zone(268,60),display:"flex",alignItems:"center",gap:18}}>
      <div style={{width:68,height:50,flexShrink:0,background:color,color:P.bg,fontSize:29,fontWeight:950,textAlign:"center",lineHeight:"50px",transform:"skew(-6deg)"}}>KCI</div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:27,fontWeight:900,letterSpacing:.7}}>KOREA CAPITAL INSIGHT</div><div style={{fontSize:16,letterSpacing:3.1,color:P.muted,marginTop:5}}>MARKET INTELLIGENCE</div></div>
      <div style={{fontSize:22,color:P.muted,fontWeight:800}}>{String(index).padStart(2,"0")}/{String(count).padStart(2,"0")}</div>
    </div>
    <div style={{...zone(339,1),background:`${P.border}99`}}/>
    <div data-kci-safe="edition" style={{...zone(351,29),fontSize:22,color:P.muted,fontWeight:750,letterSpacing:.4}}>{edition}</div>
  </>
);

const Headline:React.FC<{scene:RenderScene;f:number;color:string}>=({scene,f,color})=>(
  <>
    <div data-kci-safe="eyebrow" style={{...zone(394,30),...enter(f,1),fontSize:25,color,fontWeight:900,letterSpacing:1.7}}>▰ {scene.eyebrow.toUpperCase()}</div>
    <div data-kci-safe="headline" style={{...zone(446,158),...enter(f,6),fontSize:scene.headline.length>70?55:65,fontWeight:950,lineHeight:1.1,letterSpacing:-.8}}>{scene.headline}</div>
    <div data-kci-safe="summary" style={{...zone(620,74),...enter(f,14),fontSize:29,color:"#BED1DF",lineHeight:1.28}}>{scene.summary}</div>
  </>
);

const Bars:React.FC<{v:KciVisual;f:number}>=({v,f})=>{
  const bars=v.bars||[],max=Math.max(1,...bars.map(b=>Math.abs(b.value)));
  return <div style={{width:"100%"}}>
    <div style={{fontSize:23,color:P.teal,fontWeight:850,letterSpacing:1}}>SO SÁNH CHỈ BÁO · CÙNG ĐƠN VỊ</div>
    {bars.map((b,i)=><div key={i} style={{...enter(f,18+i*8),marginTop:26}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:18}}><span style={{fontSize:31,fontWeight:850,flex:1,minWidth:0}}>{b.label}</span><span style={{fontSize:48,fontWeight:950,whiteSpace:"nowrap",color:tone(b.tone||(b.value<0?"down":"up"))}}>{b.display}</span></div>
      <div style={{height:24,marginTop:10,position:"relative",background:"#2B4158"}}><div style={{position:"absolute",left:"50%",height:"100%",width:2,background:P.muted,zIndex:2}}/><div style={{position:"absolute",top:0,height:"100%",left:b.value<0?undefined:"50%",right:b.value<0?"50%":undefined,width:`${46*Math.abs(b.value)/max*ease(f,24+i*9,30)}%`,background:b.value<0?P.red:P.teal}}/></div>
    </div>)}
    <div style={{...small,marginTop:27,maxWidth:858}}>{v.qualifier||"Số liệu so sánh, không phải đường thời gian"}</div>
  </div>;
};

const Reversal:React.FC<{v:KciVisual;f:number}>=({v,f})=>(
  <div style={{width:"100%"}}>
    <div style={{...enter(f,12),fontSize:98,fontWeight:950,letterSpacing:-3,color:P.teal}}>{v.banner||"PHIÊN ĐẢO CHIỀU"}</div>
    <div style={{...small,marginTop:12,fontSize:23,letterSpacing:1}}>CÁC MỐC QUAN SÁT RỜI RẠC</div>
    <div style={{display:"flex",gap:22,marginTop:32}}>{(v.milestones||[]).map((m,i)=><div key={i} style={{...enter(f,24+i*10),flex:1,minWidth:0,padding:"24px 0",borderTop:`2px solid ${tone(m.tone)}77`}}><div style={{fontSize:23,fontWeight:850,color:P.muted}}>{m.label}</div><div style={{fontSize:49,fontWeight:950,color:tone(m.tone),marginTop:18,whiteSpace:"nowrap"}}>{m.value}</div></div>)}</div>
    <div style={{...small,marginTop:20,maxWidth:858}}>{v.qualifier||"Không phải đường giá từng phút"}</div>
  </div>
);

const Spotlight:React.FC<{v:KciVisual;f:number;color:string}>=({v,f,color})=>(
  <div style={{width:"100%",height:444,textAlign:"center",position:"relative",overflow:"hidden",padding:20,boxSizing:"border-box"}}>
    <div style={{position:"absolute",left:"50%",top:20,width:390,height:390,borderRadius:"50%",border:`2px dashed ${color}44`,transform:`translateX(-50%) rotate(${f*.3}deg)`}}/>
    <div style={{position:"relative"}}><div style={{fontSize:29,color,fontWeight:850,letterSpacing:1}}>{v.unit||"THỊ TRƯỜNG"}</div><div style={{...enter(f,16),fontSize:176,fontWeight:950,letterSpacing:-4,marginTop:25}}>{v.value}</div><div style={{...small,fontSize:30,marginTop:30,color:P.white,fontWeight:750}}>{v.qualifier}</div></div>
  </div>
);

const Company:React.FC<{v:KciVisual;s:RenderScene;f:number}>=({v,s,f})=>(
  <div style={{width:"100%"}}>
    <div style={{height:270,position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,borderTop:`2px solid ${P.teal}77`,borderBottom:`1px solid ${P.border}`}}><div style={{fontSize:51,fontWeight:900}}>{v.company||"DOANH NGHIỆP"}</div><div style={{...enter(f,16),fontSize:116,fontWeight:950,color:tone(s.stats[0]?.tone||"up"),whiteSpace:"nowrap"}}>{s.stats[0]?.value||"—"}</div></div>
    <div style={{display:"flex",gap:28,marginTop:24}}>{(v.bullets||[s.summary]).map((b,i)=><div key={i} style={{...enter(f,28+i*8),flex:1,minWidth:0,padding:"14px 0",fontSize:28,lineHeight:1.22,fontWeight:850,color:i?P.amber:P.teal}}>{b}</div>)}</div>
  </div>
);

const Rate:React.FC<{v:KciVisual;f:number}>=({v,f})=>{
  const r=132,c=2*Math.PI*r,ratio=Math.max(0,Math.min(1,(v.numericValue||0)/(v.scaleMax||5)));
  return <div style={{width:"100%",height:460,position:"relative",textAlign:"center",padding:25,boxSizing:"border-box"}}>
    <svg width="340" height="340" viewBox="0 0 340 340"><circle cx="170" cy="170" r={r} fill="none" stroke="#38516C" strokeWidth="20"/><circle cx="170" cy="170" r={r} fill="none" stroke={P.blue} strokeWidth="20" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-ratio*ease(f,14,40))} transform="rotate(-90 170 170)"/></svg>
    <div style={{position:"absolute",left:0,right:0,top:115}}><div style={small}>{v.unit||"LÃI SUẤT"}</div><div style={{fontSize:80,fontWeight:950}}>{v.value}</div><div style={{fontSize:23,color:P.teal,fontWeight:850}}>{v.statusLabel}</div></div><div style={{fontSize:18,color:P.muted}}>Thang minh họa 0–{v.scaleMax||5}</div><div style={{...small,marginTop:12}}>{v.qualifier}</div>
  </div>;
};

const Closing:React.FC<{v:KciVisual;cta?:KciCta;f:number;duration:number}>=({v,cta,f,duration})=>(
  <div style={{width:"100%",alignSelf:"flex-start"}}>
    <div style={{fontSize:24,fontWeight:850,color:P.teal,letterSpacing:1}}>NHỮNG ĐIỀU CẦN THEO DÕI</div>
    {(v.bullets||[]).map((b,i)=><div key={i} style={{...enter(f,13+i*8),display:"flex",gap:20,marginTop:17,alignItems:"center"}}><span style={{fontSize:35,fontWeight:950,color:[P.teal,P.amber,P.blue][i%3]}}>0{i+1}</span><span style={{fontSize:29,lineHeight:1.2,fontWeight:800}}>{b}</span></div>)}
    {cta&&<div data-kci-safe="cta" style={{...enter(f,Math.max(16,Math.floor(duration*.51))),borderTop:`3px solid ${P.teal}`,padding:"20px 0 0",marginTop:24}}><div style={{fontSize:19,letterSpacing:2,fontWeight:850,color:"#9FF4D9"}}>{cta.type==="comment"?"GÓC NHÌN CỦA ANH CHỊ":cta.type==="follow"?"THEO DÕI KCI":"LƯU LẠI ĐỂ THAM KHẢO"}</div><div style={{fontSize:42,fontWeight:950,lineHeight:1.15,marginTop:12}}>{cta.screenHeadline}</div><div style={{fontSize:25,color:"#C4E8E1",lineHeight:1.25,marginTop:12,maxWidth:858}}>{cta.screenSubline}</div></div>}
  </div>
);

const Visual:React.FC<{s:RenderScene;f:number;color:string}>=({s,f,color})=>{
  const v=s.visual;
  if(v?.kind==="reversal")return <Reversal v={v} f={f}/>;
  if(v?.kind==="comparison"||v?.kind==="risk-bars")return <Bars v={v} f={f}/>;
  if(v?.kind==="spotlight")return <Spotlight v={v} f={f} color={color}/>;
  if(v?.kind==="company")return <Company v={v} s={s} f={f}/>;
  if(v?.kind==="rate")return <Rate v={v} f={f}/>;
  if(v?.kind==="closing")return <Closing v={v} cta={s.cta} f={f} duration={s.durationFrames}/>;
  return <div style={{width:"100%",display:"grid",gridTemplateColumns:s.stats.length===2?"1fr 1fr":"1fr",gap:26}}>{s.stats.map((st,i)=><div key={i} style={{...enter(f,14+i*9),padding:"25px 0",borderTop:`2px solid ${P.border}`}}><div style={small}>{st.label}</div><div style={{fontSize:53,lineHeight:1.12,fontWeight:950,color:tone(st.tone),marginTop:22}}>{st.value}</div>{st.change&&<div style={{fontSize:26,marginTop:12,color:tone(st.tone)}}>{st.change}</div>}</div>)}</div>;
};

const Scene:React.FC<{scene:RenderScene;edition:string;index:number;count:number;preview:boolean}>=({scene,edition,index,count,preview})=>{
  const f=useCurrentFrame(),v=scene.visual;
  const color=v?.kind==="risk-bars"?P.red:v?.kind==="spotlight"?P.amber:v?.kind==="rate"?P.blue:P.teal;
  const opacity=Math.min(ease(f,0,9),interpolate(f,[Math.max(0,scene.durationFrames-8),scene.durationFrames],[1,0],clamp));
  const cue=scene.captions.find(c=>f>=c.from&&f<c.to);
  return <AbsoluteFill style={{background:P.bg,color:P.white,fontFamily:"Arial, sans-serif",overflow:"hidden"}}>
    <Background f={f} color={color}/>
    <AbsoluteFill style={{opacity}}>
      <Masthead edition={edition} index={index} count={count} color={color}/><Headline scene={scene} f={f} color={color}/>
      <div data-kci-safe="visual" style={{...zone(718,474),display:"flex",alignItems:"center"}}><Visual s={scene} f={f} color={color}/></div>
      <div data-kci-safe="captions" style={{...zone(1220,112,true),background:"linear-gradient(90deg,rgba(1,10,24,.8),rgba(1,10,24,.35))",borderTop:`3px solid ${color}`,padding:"15px 14px",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:38,lineHeight:1.22,fontWeight:850,textAlign:"center",whiteSpace:"pre-wrap",opacity:cue?ease(f,cue.from,4):0}}>{cue?.text||""}</div></div>
      <div data-kci-safe="source" style={{...zone(1347,48,true),fontSize:19,lineHeight:1.22,color:P.muted}}>Nguồn: {scene.source}</div>
      <div style={{...zone(1402,2,true),background:P.border}}><div style={{height:2,width:`${100*f/Math.max(1,scene.durationFrames-1)}%`,background:color}}/></div>
      <div data-kci-safe="disclaimer" style={{...zone(1415,25,true),fontSize:19,lineHeight:1.2,color:P.muted}}>Thông tin tham khảo · Không phải khuyến nghị đầu tư cá nhân.</div>
      {preview&&<div data-kci-safe="preview" style={{...zone(1189,24,true),fontSize:18,fontWeight:900,color:P.red,textAlign:"right"}}>SILENT PREVIEW · CHƯA CÓ VOICE</div>}
    </AbsoluteFill>
    {scene.audioFile&&<Audio src={staticFile(scene.audioFile)}/>}
  </AbsoluteFill>;
};

/** Same composition/job/audio contract; wider presentation layer only. */
export const KciNewsReels:React.FC<KciVideoProps>=({scenes,edition,preview})=>(
  <AbsoluteFill style={{background:P.bg}}>{scenes.map((scene,i)=><Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationFrames} name={scene.headline}><Scene scene={scene} edition={edition} index={i+1} count={scenes.length} preview={preview}/></Sequence>)}</AbsoluteFill>
);
