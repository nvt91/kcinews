import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {KciVideoProps, RenderScene} from "./KciNews";

const X = {bg:"#071124",pane:"#10243F",white:"#F7FAFF",muted:"#9CB4CA",teal:"#37E5C5",red:"#FF617D",blue:"#62BEFF",amber:"#FFCE82"};
const cl = {extrapolateLeft:"clamp", extrapolateRight:"clamp"} as const;
const ease = (f:number, begin=0, len=20) => interpolate(f,[begin,begin+len],[0,1],{...cl,easing:Easing.out(Easing.cubic)});
const enter = (f:number,at=0,shift=45):React.CSSProperties => ({opacity:ease(f,at,19),transform:"translateY("+((1-ease(f,at,19))*shift)+"px)"});
const glass:React.CSSProperties = {background:"linear-gradient(150deg,rgba(20,47,74,.93),rgba(7,20,38,.96))",border:"1px solid #38536D",borderRadius:24,boxShadow:"0 24px 65px rgba(0,0,0,.25)"};

const Backdrop:React.FC<{f:number,accent:string}> = ({f,accent}) => (
  <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(142deg,#051021,#10233B 64%,#051024)"}}>
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 75% 34%,"+accent+"20,transparent 53%)"}}/>
    <AbsoluteFill style={{backgroundImage:"linear-gradient(90deg,#5D8FA91D 1px,transparent 1px),linear-gradient(#5D8FA91D 1px,transparent 1px)",backgroundSize:"88px 88px",transform:"translate("+((f*.35)%88)+"px,"+((f*.2)%88)+"px)",opacity:.7}}/>
    {[0,1,2].map(i => <div key={i} style={{position:"absolute",left:800+i*34,top:310+i*33,width:310+i*108,height:310+i*108,borderRadius:"50%",border:"2px solid "+accent+"24",transform:"rotate("+(f*.2*(i%2?1:-1))+"deg)",boxShadow:"0 0 55px "+accent+"0B"}}/>)}
    {Array.from({length:24},(_,i)=><div key={i} style={{position:"absolute",left:(79+i*181)%1050,top:180+(i*239)%1420,width:3+(i%3),height:3+(i%3),borderRadius:99,background:accent,opacity:.12+Math.max(0,Math.sin(f/16+i))*.32}}/>)}
    <AbsoluteFill style={{boxShadow:"inset 0 0 170px #010915AA"}}/>
  </AbsoluteFill>
);

const Branding:React.FC<{index:number,total:number,edition:string,accent:string}> = ({index,total,edition,accent})=>(
  <>
    <div style={{position:"absolute",top:0,left:0,width:"100%",height:7,background:"linear-gradient(90deg,"+accent+",#234F70,transparent)"}}/>
    <div style={{position:"absolute",top:70,left:67,right:67,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:19}}>
        <div style={{width:75,height:61,background:accent,color:X.bg,fontSize:33,fontWeight:950,textAlign:"center",paddingTop:9,boxSizing:"border-box",transform:"skew(-7deg)"}}>KCI</div>
        <div><div style={{fontSize:28,fontWeight:900,letterSpacing:2,color:X.white}}>KOREA CAPITAL INSIGHT</div><div style={{fontSize:17,letterSpacing:5,color:X.muted}}>MARKET INTELLIGENCE</div></div>
      </div>
      <span style={{fontSize:24,fontWeight:900,color:X.muted}}>{String(index).padStart(2,"0")}/{String(total).padStart(2,"0")}</span>
    </div>
    <div style={{position:"absolute",top:157,left:70,right:70,borderTop:"1px solid #45627C66"}}/>
    <div style={{position:"absolute",top:176,left:70,right:70,fontSize:22,fontWeight:800,letterSpacing:2.4,color:X.muted,display:"flex",justifyContent:"space-between"}}>
      <span>DAILY MARKET BRIEF</span><span>{edition}</span>
    </div>
  </>
);

const Heading:React.FC<{s:RenderScene,f:number,accent:string}> = ({s,f,accent})=>(
  <div style={{position:"absolute",left:70,right:70,top:265}}>
    <div style={{...enter(f,1,25),color:accent,fontSize:28,fontWeight:900,letterSpacing:3}}><span style={{marginRight:15}}>▰</span>{s.eyebrow.toUpperCase()}</div>
    <div style={{...enter(f,7,46),fontSize:68,fontWeight:940,lineHeight:1.13,letterSpacing:-1.4,marginTop:35,color:X.white,textShadow:"0 10px 20px #0008"}}>{s.headline}</div>
    <div style={{height:5,width:248*ease(f,16,23),background:accent,boxShadow:"0 0 23px "+accent+"66",marginTop:29}}/>
    <div style={{...enter(f,18,24),fontSize:32,color:"#B7CCDC",lineHeight:1.35,marginTop:22}}>{s.summary}</div>
  </div>
);

const Stat:React.FC<{label:string,value:string,color?:string,small?:string}> = ({label,value,color=X.teal,small})=>(
  <div style={{...glass,padding:27,flex:1,minWidth:0}}>
    <div style={{color:X.muted,fontSize:24,fontWeight:800,letterSpacing:1}}>{label}</div>
    <div style={{color,fontSize:61,fontWeight:950,letterSpacing:-2,marginTop:12,whiteSpace:"nowrap"}}>{value}</div>
    {small&&<div style={{fontSize:26,fontWeight:850,marginTop:10,color}}>{small}</div>}
  </div>
);

const Hook:React.FC<{f:number}> = ({f})=>(
  <>
    <div style={{...enter(f,13),display:"flex",alignItems:"baseline",gap:25,marginTop:25}}>
      <span style={{fontSize:112,color:X.red,fontWeight:950,letterSpacing:-6}}>{"↓ >4%"}</span>
      <span style={{fontSize:65,color:X.muted,fontWeight:800}}>→</span>
      <span style={{fontSize:102,color:X.teal,fontWeight:950,letterSpacing:-4}}>+0,30%</span>
    </div>
    <div style={{fontSize:25,color:X.muted,letterSpacing:3,fontWeight:700,marginTop:2}}>TỪ ĐÁY TRONG PHIÊN ĐẾN MỨC ĐÓNG CỬA</div>
    <div style={{height:3,background:"#34516D",margin:"82px 35px 0",position:"relative"}}>
      <div style={{width:(100*ease(f,23,48))+"%",height:3,background:X.blue,boxShadow:"0 0 19px "+X.blue}}/>
    </div>
    <div style={{display:"flex",gap:16,marginTop:40}}>
      {[
        ["MỞ CỬA","5.403,17",X.white],
        ["THẤP NHẤT","5.305,98",X.red],
        ["ĐÓNG CỬA","5.550,30",X.teal]
      ].map((a,i)=><div key={i} style={{...glass,...enter(f,24+i*13,32),flex:1,padding:"28px 11px",textAlign:"center"}}>
        <div style={{fontSize:23,color:X.muted,fontWeight:800}}>{a[0]}</div>
        <div style={{fontSize:43,fontWeight:900,color:a[2],marginTop:18}}>{a[1]}</div>
      </div>)}
    </div>
    <div style={{fontSize:21,color:X.muted,marginTop:30}}>Ba mốc giá được xác nhận · Không mô phỏng dữ liệu phút</div>
  </>
);
const Markets:React.FC<{f:number}> = ({f})=>{
  const p=ease(f,22,40);
  return <div style={{...glass,padding:34}}>
    <div style={{color:X.teal,fontSize:24,fontWeight:900,letterSpacing:3}}>KRX / PHIÊN CHÍNH</div>
    <div style={{display:"flex",gap:18,marginTop:31}}>
      <div style={{...enter(f,12),flex:1}}><Stat label="KOSPI" value="5.550,30" small="+0,30%" color={X.teal}/></div>
      <div style={{...enter(f,20),flex:1}}><Stat label="KOSDAQ" value="751,69" small="−1,62%" color={X.red}/></div>
    </div>
    <div style={{marginTop:54,fontSize:24,fontWeight:800,color:X.muted}}>SO SÁNH BIẾN ĐỘNG PHIÊN (%)</div>
    <div style={{position:"relative",height:110,marginTop:20}}>
      <div style={{height:110,width:3,background:"#758DA5",position:"absolute",left:"50%"}}/>
      <div style={{position:"absolute",right:"50%",top:10,height:38,width:(p*1.62/2*43)+"%",borderRadius:9,background:X.red,boxShadow:"0 0 23px "+X.red+"66"}}/>
      <div style={{position:"absolute",left:"50%",top:65,height:38,width:(p*.30/2*43)+"%",borderRadius:9,background:X.teal,boxShadow:"0 0 23px "+X.teal+"66"}}/>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:25,fontWeight:850}}>
      <span style={{color:X.red}}>KOSDAQ −1,62%</span><span style={{color:X.teal}}>KOSPI +0,30%</span>
    </div>
  </div>;
};
const Chip:React.FC<{f:number}> = ({f})=>(
  <>
    <div style={{...glass,height:456,position:"relative",overflow:"hidden",background:"radial-gradient(ellipse at 50% 45%,#174761,#0C1D34 67%)"}}>
      <svg width="100%" height="100%" viewBox="0 0 940 456">
        {Array.from({length:12},(_,i)=><g key={i}>
          <path d={"M0 "+(28+i*34)+" H"+(124+(i%4)*31)+" V"+(94+(i%5)*28)+" H310"} fill="none" stroke={X.teal} strokeWidth="3" strokeDasharray="14 9" strokeDashoffset={-f*1.4} opacity={.15+(Math.sin(f/14+i)+1)*.2}/>
          <path d={"M940 "+(28+i*34)+" H"+(820-(i%4)*31)+" V"+(94+(i%5)*28)+" H628"} fill="none" stroke={X.blue} strokeWidth="3" strokeDasharray="14 9" strokeDashoffset={f*1.4} opacity={.13+(Math.cos(f/13+i)+1)*.2}/>
        </g>)}
        <rect x="307" y="84" width="323" height="285" rx="25" fill="#091829" stroke={X.teal} strokeWidth="4"/>
        <rect x="321" y="98" width="294" height="257" rx="18" fill="#113350" stroke="#5FBBCE" strokeWidth="2"/>
        <text x="468" y="200" textAnchor="middle" fontSize="50" fontWeight="bold" fill={X.white}>SK hynix</text>
        <text x="468" y="277" textAnchor="middle" fontSize="70" fontWeight="bold" fill={X.teal}>+4,42%</text>
        <rect x="300" y="77" width="337" height="299" rx="29" fill="none" stroke={X.teal} strokeWidth="7" opacity={.24+.13*Math.sin(f/9)}/>
      </svg>
    </div>
    <div style={{display:"flex",gap:19,marginTop:20}}>
      <div style={{...enter(f,30),flex:1}}><Stat label="XEM XÉT IPO SOLIDIGM" value="ĐÃ DỪNG" color={X.teal}/></div>
      <div style={{...enter(f,38),flex:1}}><Stat label="NHU CẦU ĐẦU TƯ" value="VẪN CÒN" color={X.amber}/></div>
    </div>
  </>
);
const Ai:React.FC<{f:number}> = ({f})=>(
  <>
    <div style={{...glass,padding:39}}>
      <div style={{color:X.red,fontWeight:900,fontSize:24,letterSpacing:3}}>WALL STREET · 22/10/2026</div>
      {[
        ["NASDAQ","−2,60%",2.6,16],
        ["BÁN DẪN PHILADELPHIA","GIẢM >6%",6,32],
      ].map((a,i)=><div key={i} style={{marginTop:46}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:i===0?33:27,color:X.white,fontWeight:850}}>{a[0]}</span>
          <span style={{fontSize:44,color:X.red,fontWeight:900}}>{a[1]}</span>
        </div>
        <div style={{height:27,background:"#344159",borderRadius:15,overflow:"hidden",marginTop:18}}>
          <div style={{height:"100%",width:(Number(a[2])/7*100*ease(f,Number(a[3]),28))+"%",background:"linear-gradient(90deg,#A43D50,"+X.red+")"}}/>
        </div>
      </div>)}
      <div style={{fontSize:19,color:X.muted,marginTop:24}}>Thanh bán dẫn dựa trên cận dưới mức giảm được công bố.</div>
    </div>
    <div style={{...glass,...enter(f,53),padding:28,marginTop:28,borderLeft:"7px solid "+X.teal,fontSize:30,fontWeight:850,lineHeight:1.3}}>
      <span style={{fontSize:46,color:X.teal,marginRight:15}}>≠</span>
      BIẾN ĐỘNG GIÁ KHÔNG CHỨNG MINH NHU CẦU CHIP SUY GIẢM
    </div>
  </>
);
const Oil:React.FC<{f:number}> = ({f})=>(
  <div style={{...glass,height:614,position:"relative",overflow:"hidden",textAlign:"center",background:"radial-gradient(ellipse at center,#3F342C 0%,#102236 60%)"}}>
    <svg style={{position:"absolute",top:5,left:0}} width="940" height="590">
      {Array.from({length:5},(_,i)=><circle key={i} cx="470" cy="255" r={110+i*50+10*ease(f,10,40)} fill="none" stroke={i%2?X.amber:X.red} strokeWidth="2" strokeDasharray="12 16" strokeDashoffset={(i%2?-1:1)*f} opacity={.12+.13*Math.max(0,Math.sin(f/20+i))}/>)}
    </svg>
    <div style={{position:"relative",paddingTop:94}}>
      <div style={{color:X.amber,fontSize:27,fontWeight:900,letterSpacing:3}}>BRENT · INTRADAY HIGH</div>
      <div style={{...enter(f,15),color:X.white,fontSize:136,fontWeight:950,letterSpacing:-5,marginTop:34}}>115,16</div>
      <div style={{color:X.amber,fontSize:45,fontWeight:900,letterSpacing:5}}>USD / THÙNG</div>
      <div style={{...glass,...enter(f,38),margin:"68px 85px 0",padding:27,borderColor:X.amber+"70",fontSize:28,fontWeight:900,color:X.amber}}>MỨC CAO TRONG PHIÊN — KHÔNG PHẢI GIÁ ĐÓNG CỬA</div>
    </div>
  </div>
);
const Bok:React.FC<{f:number}> = ({f})=>{
  const p=ease(f,15,50),r=164,circ=2*Math.PI*r;
  return <>
    <div style={{...glass,height:483,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <svg width="446" height="446" viewBox="0 0 446 446">
        <circle cx="223" cy="223" r={r} fill="none" stroke="#304963" strokeWidth="28"/>
        <circle cx="223" cy="223" r={r} fill="none" stroke={X.blue} strokeWidth="28" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-.6*p)} transform="rotate(-90 223 223)"/>
      </svg>
      <div style={{position:"absolute",textAlign:"center",top:138,left:0,right:0}}>
        <div style={{color:X.muted,fontSize:27,fontWeight:900}}>LÃI SUẤT BOK</div>
        <div style={{color:X.white,fontSize:102,fontWeight:950}}>3,00%</div>
        <div style={{color:X.teal,fontSize:31,fontWeight:900}}>GIỮ NGUYÊN</div>
        <div style={{color:X.muted,fontSize:19,marginTop:16}}>Thang minh họa 0–5%</div>
      </div>
    </div>
    <div style={{display:"flex",gap:20,marginTop:21}}>
      <div style={{...enter(f,38),flex:1}}><Stat label="ĐỘNG LỰC" value="XUẤT KHẨU" color={X.teal}/></div>
      <div style={{...enter(f,44),flex:1}}><Stat label="RỦI RO" value="LẠM PHÁT" color={X.amber}/></div>
    </div>
  </>;
};
const Outro:React.FC<{f:number}> = ({f})=>(
  <>
    <div style={{color:X.teal,fontSize:30,fontWeight:900,letterSpacing:4,...enter(f,3)}}>3 ĐIỂM CẦN THEO DÕI</div>
    {["DÒNG VỐN NƯỚC NGOÀI","GIÁ DẦU","LỢI NHUẬN BÁN DẪN"].map((x,i)=><div key={x} style={{...glass,...enter(f,13+i*11,55),padding:"21px 28px",marginTop:17,borderLeft:"7px solid "+[X.teal,X.amber,X.blue][i],display:"flex",alignItems:"center",gap:24}}>
      <span style={{color:[X.teal,X.amber,X.blue][i],fontSize:50,fontWeight:900}}>0{i+1}</span>
      <span style={{fontSize:34,fontWeight:850,color:X.white}}>{x}</span>
    </div>)}
    <div style={{textAlign:"center",marginTop:43,...enter(f,52)}}>
      <div style={{fontSize:50,fontWeight:950,color:X.white,letterSpacing:1}}>KOREA CAPITAL INSIGHT</div>
      <div style={{fontSize:28,fontWeight:850,color:X.teal,letterSpacing:1.5,marginTop:10}}>NHÌN THỊ TRƯỜNG QUA DỮ LIỆU</div>
    </div>
  </>
);
const Graphic:React.FC<{s:RenderScene,f:number}> = ({s,f})=>(
  <div style={{position:"absolute",top:710,left:70,right:70,height:720}}>
    {s.id==="hook"&&<Hook f={f}/>}
    {s.id==="kospi"&&<Markets f={f}/>}
    {s.id==="hynix"&&<Chip f={f}/>}
    {s.id==="nasdaq"&&<Ai f={f}/>}
    {s.id==="oil"&&<Oil f={f}/>}
    {s.id==="bok"&&<Bok f={f}/>}
    {s.id==="outro"&&<Outro f={f}/>}
    {!["hook","kospi","hynix","nasdaq","oil","bok","outro"].includes(s.id)&&<Stat label={s.eyebrow} value={s.stats[0]?.value||s.headline}/>}
  </div>
);
const Footer:React.FC<{s:RenderScene,f:number,accent:string}> = ({s,f,accent})=>{
  const cue=s.captions.find(c=>f>=c.from&&f<c.to);
  const progress=cue?ease(f,cue.from,5):0;
  const tick=["KOSPI +0,30%","KOSDAQ −1,62%","SK HYNIX +4,42%","NASDAQ −2,60%","BRENT 115,16 HIGH","BOK 3,00%"];
  const move=-(f*1.35)%980;
  return <>
    <div style={{position:"absolute",left:70,right:70,bottom:268,minHeight:123,padding:"19px 26px",boxSizing:"border-box",borderRadius:18,background:"rgba(1,9,23,.94)",border:"1px solid #41637D",borderLeft:"6px solid "+accent,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:36,color:X.white,fontWeight:850,lineHeight:1.25,textAlign:"center",opacity:progress}}>{cue?.text||""}</div>
    </div>
    <div style={{position:"absolute",bottom:215,left:71,right:71,fontSize:20,color:X.muted}}>NGUỒN: {s.source}</div>
    <div style={{position:"absolute",bottom:120,left:0,right:0,height:67,overflow:"hidden",display:"flex",alignItems:"center",background:"#030C1B",borderTop:"1px solid #386782"}}>
      <div style={{height:67,boxSizing:"border-box",background:accent,padding:"19px 20px",color:X.bg,fontSize:24,fontWeight:900,zIndex:2}}>MARKETS</div>
      <div style={{position:"relative",height:67,overflow:"hidden",flex:1}}>
        <div style={{position:"absolute",width:"max-content",height:"100%",display:"flex",alignItems:"center",gap:50,transform:"translateX("+move+"px)"}}>
          {[...tick,...tick,...tick].map((t,i)=><span key={i} style={{fontSize:24,color:i%6===0?accent:"#C5D3E2",fontWeight:850,whiteSpace:"nowrap"}}>{t}</span>)}
        </div>
      </div>
    </div>
    <div style={{position:"absolute",bottom:76,left:70,right:70,height:3,background:"#294056"}}><div style={{background:accent,width:(100*f/Math.max(1,s.durationFrames-1))+"%",height:"100%"}}/></div>
    <div style={{position:"absolute",bottom:31,left:70,right:70,fontSize:20,color:"#829BB1",textAlign:"center"}}>Thông tin tham khảo · Không phải khuyến nghị đầu tư</div>
  </>;
};
const Scene:React.FC<{s:RenderScene,edition:string,ix:number,total:number,preview:boolean}> = ({s,edition,ix,total,preview})=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const accent=s.id==="nasdaq"?X.red:s.id==="oil"?X.amber:s.id==="bok"?X.blue:X.teal;
  const fadeIn=interpolate(f,[0,9],[0,1],cl);
  const fadeOut=interpolate(f,[Math.max(0,s.durationFrames-9),s.durationFrames],[1,0],cl);
  const settle=spring({frame:f,fps,config:{stiffness:75,damping:22,mass:1}});
  return <AbsoluteFill style={{overflow:"hidden",backgroundColor:X.bg,color:X.white,fontFamily:"Arial, sans-serif"}}>
    <Backdrop f={f} accent={accent}/>
    <AbsoluteFill style={{opacity:Math.min(fadeIn,fadeOut),transform:"scale("+(0.987+.013*settle)+")"}}>
      <Branding index={ix} total={total} edition={edition} accent={accent}/>
      <Heading s={s} f={f} accent={accent}/>
      <Graphic s={s} f={f}/>
      <Footer s={s} f={f} accent={accent}/>
    </AbsoluteFill>
    <div style={{position:"absolute",top:0,height:"100%",left:interpolate(f,[0,19],[-360,1430],cl),width:210,transform:"skewX(-21deg)",background:"linear-gradient(90deg,transparent,"+accent+"20,transparent)",pointerEvents:"none",opacity:f<20?.9:0}}/>
    {preview&&<div style={{position:"absolute",top:208,right:68,color:X.red,fontSize:24,fontWeight:900}}>PREVIEW — CHƯA CÓ VOICE</div>}
    {s.audioFile&&<Audio src={staticFile(s.audioFile)}/>}
  </AbsoluteFill>;
};
export const KciNewsV2:React.FC<KciVideoProps> = ({scenes,edition,preview})=>(
  <AbsoluteFill style={{background:X.bg}}>
    {scenes.map((s,i)=><Sequence key={s.id} name={s.headline} from={s.startFrame} durationInFrames={s.durationFrames}>
      <Scene s={s} edition={edition} ix={i+1} total={scenes.length} preview={preview}/>
    </Sequence>)}
  </AbsoluteFill>
);
