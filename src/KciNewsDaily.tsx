import React from "react";
import {
  AbsoluteFill, Audio, Easing, interpolate, Sequence, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import type {KciCta, KciVideoProps, KciVisual, RenderScene} from "./KciNews";

const P = {
  bg:"#071224", dark:"#061024", glass:"#102844", teal:"#36DEC0",
  red:"#FF647D", blue:"#63BFFE", amber:"#FFD187", white:"#F8FCFF",
  muted:"#A6BDD1", border:"#3B5A75",
};
const cap = {extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
const ease = (f:number, start=0, len=18) =>
  interpolate(f,[start,start+len],[0,1],{...cap,easing:Easing.out(Easing.cubic)});
const fadeUp = (f:number, at=0, px=30):React.CSSProperties => ({
  opacity:ease(f,at),transform:"translateY("+((1-ease(f,at))*px)+"px)",
});
const card:React.CSSProperties = {
  background:"linear-gradient(145deg,rgba(18,45,74,.95),rgba(7,20,40,.97))",
  border:"1px solid "+P.border, borderRadius:23,
  boxShadow:"0 25px 60px #01061166",
};
const tone = (t?:string) => t==="down"?P.red:t==="up"?P.teal:P.white;

const Background:React.FC<{frame:number,color:string}> = ({frame,color}) => (
  <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(135deg,#061126,#10243C 61%,#061226)"}}>
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 76% 28%,"+color+"22,transparent 55%)"}} />
    <AbsoluteFill style={{
      backgroundImage:"linear-gradient(90deg,#6A9FB21F 1px,transparent 1px),linear-gradient(#6A9FB21F 1px,transparent 1px)",
      backgroundSize:"88px 88px",
      transform:"translate("+((frame*.3)%88)+"px,"+((frame*.17)%88)+"px)",
      opacity:.7,
    }}/>
    {[0,1,2].map(i => (
      <div key={i} style={{
        position:"absolute", left:770+i*75, top:230+i*58,
        width:350+i*105, height:350+i*105, borderRadius:"50%",
        border:"2px solid "+color+"30",
        opacity:.6, transform:"rotate("+((i%2?1:-1)*frame*.4)+"deg)",
      }}/>
    ))}
    {Array.from({length:22},(_,i)=>(
      <div key={i} style={{
        position:"absolute",left:(71+i*173)%1050,top:150+(i*251)%1410,
        width:3,height:3,background:color,borderRadius:"50%",
        opacity:.1+Math.max(0,Math.sin(frame/17+i))*.27,
      }}/>
    ))}
    <AbsoluteFill style={{boxShadow:"inset 0 0 155px #000A1C77"}}/>
  </AbsoluteFill>
);

const Masthead:React.FC<{
  i:number; count:number; edition:string; color:string;
}> = ({i,count,edition,color}) => (
  <>
    <div style={{position:"absolute",top:0,width:1080,height:7,background:"linear-gradient(90deg,"+color+",#144669,transparent)"}}/>
    <div style={{position:"absolute",top:74,left:65,right:65,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <div style={{width:78,height:60,background:color,color:P.dark,textAlign:"center",fontSize:32,fontWeight:950,paddingTop:9,boxSizing:"border-box",transform:"skew(-7deg)"}}>KCI</div>
        <div>
          <div style={{fontSize:29,fontWeight:900,letterSpacing:1.7}}>KOREA CAPITAL INSIGHT</div>
          <div style={{fontSize:18,letterSpacing:4.4,color:P.muted}}>MARKET INTELLIGENCE</div>
        </div>
      </div>
      <div style={{fontSize:23,color:P.muted,fontWeight:800}}>
        {String(i).padStart(2,"0")}/{String(count).padStart(2,"0")}
      </div>
    </div>
    <div style={{position:"absolute",left:70,right:70,top:155,borderTop:"1px solid #45607866"}}/>
    <div style={{position:"absolute",top:178,left:70,right:70,fontSize:22,letterSpacing:2.3,color:P.muted,fontWeight:800,display:"flex",justifyContent:"space-between"}}>
      <span>DAILY MARKET BRIEF</span><span>{edition}</span>
    </div>
  </>
);

const Headline:React.FC<{scene:RenderScene;frame:number;color:string}> = ({scene,frame,color}) => (
  <div style={{position:"absolute",top:252,left:70,right:70}}>
    <div style={{...fadeUp(frame,1),fontSize:28,color,fontWeight:900,letterSpacing:3}}>
      ▰ {scene.eyebrow.toUpperCase()}
    </div>
    <div style={{
      ...fadeUp(frame,7,42),fontSize:67,fontWeight:950,lineHeight:1.13,
      color:P.white,letterSpacing:-1.3,marginTop:31,
    }}>{scene.headline}</div>
    <div style={{width:250*ease(frame,17,22),height:5,background:color,marginTop:29,boxShadow:"0 0 24px "+color+"77"}}/>
    <div style={{...fadeUp(frame,21),marginTop:25,fontSize:30,color:"#B9CDDF",lineHeight:1.35}}>
      {scene.summary}
    </div>
  </div>
);

const Info:React.FC<{label:string;value:string;color:string;sub?:string}> = ({
  label,value,color,sub,
}) => (
  <div style={{...card,flex:1,minWidth:0,padding:"28px 22px"}}>
    <div style={{fontSize:25,color:P.muted,fontWeight:850,letterSpacing:.3}}>{label}</div>
    <div style={{fontSize:57,color,fontWeight:950,letterSpacing:-1.5,marginTop:18,whiteSpace:"nowrap"}}>{value}</div>
    {sub&&<div style={{fontSize:24,color,marginTop:12,fontWeight:850}}>{sub}</div>}
  </div>
);

const Reversal:React.FC<{v:KciVisual;f:number}> = ({v,f}) => (
  <>
    <div style={{...fadeUp(f,12),fontSize:105,color:P.teal,fontWeight:950,letterSpacing:-5}}>
      {v.banner||"PHIÊN ĐẢO CHIỀU"}
    </div>
    <div style={{fontSize:23,letterSpacing:2.4,color:P.muted,marginTop:6,fontWeight:750}}>
      CÁC MỐC QUAN SÁT ĐƯỢC XÁC MINH
    </div>
    <div style={{height:3,background:P.border,margin:"73px 35px 30px"}}>
      <div style={{width:(100*ease(f,27,45))+"%",height:3,background:P.blue}}/>
    </div>
    <div style={{display:"flex",gap:16}}>
      {(v.milestones||[]).map((m,i)=>(
        <div key={i} style={{...card,...fadeUp(f,25+i*12),flex:1,padding:"30px 10px",textAlign:"center"}}>
          <div style={{fontSize:23,color:P.muted,fontWeight:900}}>{m.label}</div>
          <div style={{fontSize:43,color:tone(m.tone),fontWeight:950,marginTop:22}}>{m.value}</div>
        </div>
      ))}
    </div>
    <div style={{fontSize:23,color:P.muted,marginTop:35}}>{v.qualifier||"Mốc dữ liệu rời rạc, không phải đường giá liên tục"}</div>
  </>
);

const Bars:React.FC<{v:KciVisual;f:number}> = ({v,f}) => {
  const bars=v.bars||[];
  const max=Math.max(1,...bars.map(x=>Math.abs(x.value)));
  return (
    <div style={{...card,padding:38}}>
      <div style={{fontSize:25,color:P.teal,fontWeight:900,letterSpacing:2}}>SO SÁNH CHỈ BÁO · CÙNG ĐƠN VỊ</div>
      {bars.map((b,i)=>(
        <div key={i} style={{...fadeUp(f,18+i*8),marginTop:37}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:25}}>
            <span style={{fontSize:28,fontWeight:850,maxWidth:540}}>{b.label}</span>
            <span style={{fontSize:40,fontWeight:950,color:tone(b.tone|| (b.value<0?"down":"up"))}}>{b.display}</span>
          </div>
          <div style={{marginTop:14,height:28,position:"relative",background:"#2B4158",borderRadius:12}}>
            <div style={{position:"absolute",height:"100%",width:3,left:"50%",top:0,background:"#BACAD8",zIndex:1}}/>
            <div style={{
              position:"absolute",height:"100%",borderRadius:10,top:0,
              left:b.value<0?undefined:"50%",right:b.value<0?"50%":undefined,
              background:b.value<0?P.red:P.teal,
              width:(46*Math.abs(b.value)/max*ease(f,26+i*9,30))+"%",
              boxShadow:"0 0 16px "+(b.value<0?P.red:P.teal)+"66",
            }}/>
          </div>
        </div>
      ))}
      <div style={{fontSize:22,color:P.muted,marginTop:36}}>
        {v.qualifier||"Thanh thể hiện số liệu so sánh, không phải đường thời gian"}
      </div>
    </div>
  );
};

const Chip:React.FC<{v:KciVisual;s:RenderScene;f:number}> = ({v,s,f}) => (
  <>
    <div style={{...card,height:443,position:"relative",overflow:"hidden",background:"radial-gradient(ellipse at center,#17445B,#0C2138 70%)"}}>
      <svg width="100%" height="100%" viewBox="0 0 940 443">
        {Array.from({length:12},(_,i)=>(
          <g key={i}>
            <path d={"M0 "+(30+i*31)+" H"+(115+(i%4)*35)+" V"+(75+(i%5)*33)+" H310"}
              fill="none" stroke={P.teal} strokeWidth="3" strokeDasharray="12 11"
              strokeDashoffset={-f*1.5} opacity={.15+.12*Math.max(0,Math.sin(f/17+i))}/>
            <path d={"M940 "+(30+i*31)+" H"+(810-(i%4)*35)+" V"+(75+(i%5)*33)+" H628"}
              fill="none" stroke={P.blue} strokeWidth="3" strokeDasharray="12 11"
              strokeDashoffset={f*1.5} opacity={.16+.1*Math.max(0,Math.cos(f/12+i))}/>
          </g>
        ))}
        <rect x="307" y="80" width="326" height="278" rx="25" fill="#0A2036" stroke={P.teal} strokeWidth="5"/>
        <rect x="323" y="97" width="293" height="244" rx="16" fill="#113B56" stroke="#81CEE2" strokeWidth="1"/>
        <text x="470" y="202" textAnchor="middle" fontSize="47" fontWeight="bold" fill={P.white}>
          {v.company||"Korean Company"}
        </text>
        <text x="470" y="279" textAnchor="middle" fontSize="68" fontWeight="bold" fill={P.teal}>
          {s.stats[0]?.value||"—"}
        </text>
      </svg>
    </div>
    <div style={{display:"flex",gap:19,marginTop:20}}>
      {(v.bullets||[s.summary]).slice(0,2).map((t,i)=>(
        <div key={i} style={{...card,...fadeUp(f,30+i*12),padding:26,flex:1,fontSize:29,color:i?P.amber:P.teal,fontWeight:900,lineHeight:1.25}}>
          {t}
        </div>
      ))}
    </div>
  </>
);

const Spotlight:React.FC<{v:KciVisual;f:number;color:string}> = ({v,f,color}) => (
  <div style={{...card,height:620,position:"relative",overflow:"hidden",textAlign:"center",background:"radial-gradient(ellipse at center,#27404B,#0C2038 70%)"}}>
    <svg style={{position:"absolute",left:0,top:0}} width="940" height="620">
      {Array.from({length:6},(_,i)=><circle key={i}
        cx="470" cy="268" r={110+i*51+12*ease(f,10,45)}
        fill="none" stroke={color} strokeWidth="2" strokeDasharray="12 16"
        strokeDashoffset={(i%2?-1:1)*f} opacity={.13+.12*Math.sin(f/17+i)**2}
      />)}
    </svg>
    <div style={{position:"relative",paddingTop:88}}>
      <div style={{fontSize:28,color,fontWeight:900,letterSpacing:2}}>{v.unit||"THỊ TRƯỜNG"}</div>
      <div style={{...fadeUp(f,16),fontSize:136,letterSpacing:-5,fontWeight:950,marginTop:47}}>{v.value}</div>
      <div style={{...card,...fadeUp(f,38),fontSize:29,color,margin:"76px 75px 0",padding:"26px 24px",fontWeight:850,lineHeight:1.3}}>
        {v.qualifier}
      </div>
    </div>
  </div>
);

const Rate:React.FC<{v:KciVisual;f:number}> = ({v,f})=>{
  const r=163,c=2*Math.PI*r;
  const ratio=Math.min(1,Math.max(0,(v.numericValue||0)/(v.scaleMax||5)));
  return <>
    <div style={{...card,height:510,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <svg width="445" height="445" viewBox="0 0 445 445">
        <circle cx="222" cy="222" r={r} fill="none" stroke="#38516C" strokeWidth="27"/>
        <circle cx="222" cy="222" r={r} fill="none" stroke={P.blue} strokeWidth="27"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-ratio*ease(f,14,50))}
          transform="rotate(-90 222 222)"/>
      </svg>
      <div style={{position:"absolute",top:150,left:0,right:0,textAlign:"center"}}>
        <div style={{fontSize:27,color:P.muted,fontWeight:850}}>{v.unit||"LÃI SUẤT"}</div>
        <div style={{fontSize:108,fontWeight:950}}>{v.value}</div>
        <div style={{fontSize:27,color:P.teal,fontWeight:850}}>{v.qualifier}</div>
        <div style={{fontSize:19,color:P.muted,marginTop:9}}>Thang minh họa 0–{v.scaleMax||5}</div>
      </div>
    </div>
  </>;
};
const Closing:React.FC<{v:KciVisual;f:number}> = ({v,f})=>(
  <>
    <div style={{fontSize:29,color:P.teal,fontWeight:900,letterSpacing:3,...fadeUp(f,3)}}>NHỮNG ĐIỀU CẦN THEO DÕI</div>
    {(v.bullets||[]).slice(0,4).map((b,i)=>(
      <div key={i} style={{...card,...fadeUp(f,13+i*10),marginTop:17,padding:"21px 26px",display:"flex",alignItems:"center",gap:22,borderLeft:"6px solid "+[P.teal,P.amber,P.blue][i%3]}}>
        <span style={{fontSize:47,fontWeight:950,color:[P.teal,P.amber,P.blue][i%3]}}>0{i+1}</span>
        <span style={{fontSize:31,fontWeight:850}}>{b}</span>
      </div>
    ))}
    <div style={{fontSize:44,fontWeight:950,letterSpacing:1,marginTop:35,textAlign:"center"}}>KOREA CAPITAL INSIGHT</div>
  </>
);

const CallToAction:React.FC<{cta:KciCta;f:number;durationFrames:number}> = ({
  cta,f,durationFrames,
}) => {
  const showAt=Math.max(16,Math.floor(durationFrames*.51));
  const p=ease(f,showAt,18);
  return (
    <div style={{
      position:"absolute",left:70,right:70,top:1270,padding:"30px 34px",
      borderRadius:23,border:"2px solid "+P.teal,
      background:"linear-gradient(95deg,rgba(11,69,76,.97),rgba(5,26,48,.97))",
      boxShadow:"0 0 45px #37E5C522",
      opacity:p,transform:"translateY("+((1-p)*48)+"px)",
      minHeight:187,boxSizing:"border-box",
    }}>
      <div style={{fontSize:20,letterSpacing:4,color:"#9FF4D9",fontWeight:900}}>
        {cta.type==="comment"?"GÓC NHÌN CỦA ANH CHỊ":cta.type==="follow"?"THEO DÕI KCI":"LƯU LẠI ĐỂ THAM KHẢO"}
      </div>
      <div style={{fontSize:39,fontWeight:950,lineHeight:1.2,marginTop:12}}>{cta.screenHeadline}</div>
      <div style={{fontSize:24,color:"#C4E8E1",fontWeight:750,marginTop:12}}>{cta.screenSubline}</div>
    </div>
  );
};

const Bottom:React.FC<{s:RenderScene;f:number;color:string;ticker:string[]}> = ({
  s,f,color,ticker,
}) => {
  const cue=s.captions.find(c=>f>=c.from&&f<c.to);
  const opacity=cue?ease(f,cue.from,5):0;
  const moving=-(f*1.28)%950;
  return <>
    <div style={{
      position:"absolute",left:70,right:70,bottom:267,minHeight:125,
      background:"rgba(1,10,24,.95)",border:"1px solid "+P.border,
      borderLeft:"6px solid "+color,borderRadius:17,padding:"21px 27px",
      display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box",
    }}>
      <div style={{fontSize:37,fontWeight:850,lineHeight:1.23,opacity,textAlign:"center",whiteSpace:"pre-wrap"}}>
        {cue?.text||""}
      </div>
    </div>
    <div style={{
      position:"absolute",left:70,right:70,bottom:214,fontSize:20,
      color:P.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
    }}>NGUỒN: {s.source}</div>
    <div style={{
      position:"absolute",bottom:118,left:0,right:0,height:70,
      background:"#030C1C",borderTop:"1px solid #3B6683",
      display:"flex",overflow:"hidden",
    }}>
      <div style={{background:color,color:P.bg,padding:"20px 22px",fontWeight:950,fontSize:24,zIndex:2}}>MARKETS</div>
      <div style={{position:"relative",flex:1,overflow:"hidden"}}>
        <div style={{
          width:"max-content",display:"flex",gap:54,height:"100%",alignItems:"center",
          transform:"translateX("+moving+"px)",
        }}>
          {[...ticker,...ticker,...ticker].map((x,i)=>(
            <span key={i} style={{fontSize:23,fontWeight:850,color:i%4===0?color:"#C6D7E6",whiteSpace:"nowrap"}}>{x}</span>
          ))}
        </div>
      </div>
    </div>
    <div style={{position:"absolute",bottom:76,left:70,right:70,height:3,background:"#315064"}}>
      <div style={{height:3,width:(100*f/Math.max(1,s.durationFrames-1))+"%",background:color}}/>
    </div>
    <div style={{position:"absolute",bottom:30,left:70,right:70,fontSize:20,color:"#86A0B6",textAlign:"center"}}>
      Thông tin tham khảo · Không phải khuyến nghị đầu tư
    </div>
  </>;
};

const Scene:React.FC<{
  scene:RenderScene;edition:string;index:number;count:number;preview:boolean;ticker:string[];
}> = ({scene,edition,index,count,preview,ticker}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const v=scene.visual;
  const color=v?.kind==="risk-bars"?P.red:v?.kind==="spotlight"?P.amber:v?.kind==="rate"?P.blue:P.teal;
  const inOut=Math.min(interpolate(frame,[0,10],[0,1],cap),
    interpolate(frame,[Math.max(0,scene.durationFrames-9),scene.durationFrames],[1,0],cap));
  const settle=spring({frame,fps,config:{damping:22,stiffness:70,mass:1}});
  return (
    <AbsoluteFill style={{background:P.bg,color:P.white,fontFamily:"Arial, sans-serif",overflow:"hidden"}}>
      <Background frame={frame} color={color}/>
      <AbsoluteFill style={{opacity:inOut,transform:"scale("+(0.986+.014*settle)+")"}}>
        <Masthead i={index} count={count} edition={edition} color={color}/>
        <Headline scene={scene} frame={frame} color={color}/>
        <div style={{position:"absolute",left:70,right:70,top:740,minHeight:660}}>
          {v?.kind==="reversal"&&<Reversal v={v} f={frame}/>}
          {["comparison","risk-bars"].includes(v?.kind||"")&&v&&<Bars v={v} f={frame}/>}
          {v?.kind==="company"&&<Chip v={v} s={scene} f={frame}/>}
          {v?.kind==="spotlight"&&<Spotlight v={v} f={frame} color={color}/>}
          {v?.kind==="rate"&&<Rate v={v} f={frame}/>}
          {v?.kind==="closing"&&<Closing v={v} f={frame}/>}
          {(!v||v.kind==="generic")&&(
            <div style={{display:"grid",gap:20}}>
              {scene.stats.map((s,i)=><div key={i} style={{...fadeUp(frame,15+i*11)}}>
                <Info label={s.label} value={s.value} color={tone(s.tone)} sub={s.change}/>
              </div>)}
            </div>
          )}
        </div>
        {v?.kind==="closing"&&scene.cta&&(
          <CallToAction cta={scene.cta} f={frame} durationFrames={scene.durationFrames}/>
        )}
        <Bottom s={scene} f={frame} color={color} ticker={ticker}/>
      </AbsoluteFill>
      {preview&&<div style={{position:"absolute",top:214,right:69,color:P.red,fontSize:23,fontWeight:900}}>SILENT PREVIEW</div>}
      {scene.audioFile&&<Audio src={staticFile(scene.audioFile)}/>}
    </AbsoluteFill>
  );
};

export const KciNewsDaily:React.FC<KciVideoProps> = ({scenes,edition,preview}) => {
  const ticker=scenes.flatMap(s=>s.stats.slice(0,2).map(st=>
    st.label.toUpperCase()+" "+st.value+" "+(st.change||"").trim(),
  )).slice(0,9);
  if(!ticker.length)ticker.push("KOREA CAPITAL INSIGHT · VERIFIED MARKET NEWS");
  return (
    <AbsoluteFill style={{background:P.bg}}>
      {scenes.map((scene,i)=>(
        <Sequence key={scene.id} name={scene.headline} from={scene.startFrame}
          durationInFrames={scene.durationFrames}>
          <Scene scene={scene} edition={edition} index={i+1} count={scenes.length}
            preview={preview} ticker={ticker}/>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
