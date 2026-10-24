import React from "react";
import {
  AbsoluteFill, Audio, Easing, interpolate, Sequence, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import type {KciCta, KciVideoProps, KciVisual, RenderScene} from "./KciNews";
import {REELS_SAFE, REELS_CONTENT_WIDTH, ReelsSafeGuides} from "./KciReelsSafe";

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
  i:number;count:number;edition:string;color:string;
}> = ({i,count,edition,color}) => (
  <>
    <div style={{
      position:"absolute",top:0,left:0,right:0,height:7,
      background:"linear-gradient(90deg,"+color+",#144669,transparent)",
    }}/>
    <div style={{
      position:"absolute",left:REELS_SAFE.left,right:REELS_SAFE.right,
      top:REELS_SAFE.masthead,display:"flex",alignItems:"center",
      justifyContent:"space-between",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
        <div style={{
          width:65,height:50,background:color,color:P.dark,
          fontSize:28,fontWeight:950,textAlign:"center",paddingTop:7,
          boxSizing:"border-box",transform:"skew(-7deg)",flexShrink:0,
        }}>KCI</div>
        <div style={{minWidth:0}}>
          <div style={{
            fontSize:24,fontWeight:900,letterSpacing:1.1,
            whiteSpace:"nowrap",
          }}>KOREA CAPITAL INSIGHT</div>
          <div style={{fontSize:15,letterSpacing:3,color:P.muted}}>
            MARKET INTELLIGENCE
          </div>
        </div>
      </div>
      <div style={{fontSize:18,fontWeight:800,color:P.muted,flexShrink:0,marginLeft:10}}>
        {String(i).padStart(2,"0")}/{String(count).padStart(2,"0")}
      </div>
    </div>
    <div style={{
      position:"absolute",top:REELS_SAFE.edition,left:REELS_SAFE.left,
      right:REELS_SAFE.right,borderTop:"1px solid #46627C88",
      display:"flex",justifyContent:"space-between",paddingTop:10,
      fontSize:17,fontWeight:800,color:P.muted,letterSpacing:1.1,
    }}>
      <span>DAILY MARKET BRIEF</span><span>{edition}</span>
    </div>
  </>
);

const Headline:React.FC<{scene:RenderScene;frame:number;color:string}> = ({
  scene,frame,color,
}) => {
  // All essential text must end before the artwork zone. Long titles use
  // smaller type rather than pushing the lower content into Instagram UI.
  const titleSize=scene.headline.length>84?42:
    scene.headline.length>65?46:
    scene.headline.length>46?51:57;
  const summarySize=scene.summary.length>115?23:26;
  return (
    <div style={{
      position:"absolute",top:REELS_SAFE.headline,
      left:REELS_SAFE.left,right:REELS_SAFE.right,
    }}>
      <div style={{
        ...fadeUp(frame,1),fontSize:24,color,fontWeight:900,
        letterSpacing:2.0,lineHeight:1.15,
      }}>▰ {scene.eyebrow.toUpperCase()}</div>
      <div style={{
        ...fadeUp(frame,7,30),fontSize:titleSize,fontWeight:950,
        lineHeight:1.12,letterSpacing:-1.0,marginTop:18,
        maxHeight:196,overflow:"hidden",wordBreak:"break-word",
      }}>{scene.headline}</div>
      <div style={{
        height:4,width:196*ease(frame,17,23),background:color,
        marginTop:17,boxShadow:"0 0 22px "+color+"55",
      }}/>
      <div style={{
        ...fadeUp(frame,21,18),fontSize:summarySize,
        color:"#C5D5E4",lineHeight:1.27,marginTop:13,
        maxHeight:67,overflow:"hidden",
      }}>{scene.summary}</div>
    </div>
  );
};

const Info:React.FC<{label:string;value:string;color:string;sub?:string}> = ({
  label,value,color,sub,
}) => (
  <div style={{
    ...card,flex:1,minWidth:0,padding:"20px 18px",
    boxSizing:"border-box",overflow:"hidden",
  }}>
    <div style={{fontSize:20,color:P.muted,fontWeight:850,lineHeight:1.17}}>{label}</div>
    <div style={{
      fontSize:value.length>12?34:value.length>9?40:51,
      color,fontWeight:950,letterSpacing:-1,marginTop:12,
      overflowWrap:"anywhere",lineHeight:1.09,
    }}>{value}</div>
    {sub&&<div style={{fontSize:21,color,marginTop:9,fontWeight:850}}>{sub}</div>}
  </div>
);

const Reversal:React.FC<{v:KciVisual;f:number}> = ({v,f}) => {
  const banner=v.banner||"PHIÊN ĐẢO CHIỀU";
  const bannerSize=banner.length>21?62:banner.length>16?71:82;
  return (
    <div style={{height:REELS_SAFE.artworkHeight,overflow:"hidden"}}>
      <div style={{
        ...fadeUp(f,12),fontSize:bannerSize,color:P.teal,
        fontWeight:950,letterSpacing:-2,lineHeight:1.12,
      }}>{banner}</div>
      <div style={{
        fontSize:19,letterSpacing:1.2,color:P.muted,
        marginTop:8,fontWeight:800,
      }}>CÁC MỐC GIÁ ĐƯỢC XÁC MINH</div>
      <div style={{
        height:3,background:P.border,margin:"48px 20px 21px",
      }}>
        <div style={{
          width:(100*ease(f,27,45))+"%",height:3,background:P.blue,
        }}/>
      </div>
      <div style={{display:"flex",gap:10}}>
        {(v.milestones||[]).map((m,i)=>(
          <div key={i} style={{
            ...card,...fadeUp(f,25+i*12),flex:1,minWidth:0,
            padding:"20px 5px",textAlign:"center",
          }}>
            <div style={{fontSize:18,color:P.muted,fontWeight:900}}>
              {m.label}
            </div>
            <div style={{
              fontSize:m.value.length>9?30:35,
              color:tone(m.tone),fontWeight:950,marginTop:12,
              letterSpacing:-.5,whiteSpace:"nowrap",
            }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{
        fontSize:18,color:P.muted,lineHeight:1.3,marginTop:17,
      }}>{v.qualifier||"Các mốc rời rạc, không phải biểu đồ phút"}</div>
    </div>
  );
};

const Bars:React.FC<{v:KciVisual;f:number}> = ({v,f}) => {
  const bars=v.bars||[];
  const max=Math.max(1,...bars.map(x=>Math.abs(x.value)));
  const many=bars.length>3;
  return (
    <div style={{
      ...card,padding:many?22:29,
      height:REELS_SAFE.artworkHeight,boxSizing:"border-box",
      overflow:"hidden",
    }}>
      <div style={{
        fontSize:21,color:P.teal,fontWeight:900,letterSpacing:1.2,
      }}>SO SÁNH BIẾN ĐỘNG · CÙNG ĐƠN VỊ</div>
      {bars.map((b,i)=>(
        <div key={i} style={{
          ...fadeUp(f,18+i*8),marginTop:many?18:26,
        }}>
          <div style={{
            display:"flex",justifyContent:"space-between",
            alignItems:"baseline",gap:12,
          }}>
            <span style={{
              fontSize:many?21:24,fontWeight:850,maxWidth:450,
            }}>{b.label}</span>
            <span style={{
              fontSize:many?28:35,fontWeight:950,
              whiteSpace:"nowrap",color:tone(b.tone||(b.value<0?"down":"up")),
            }}>{b.display}</span>
          </div>
          <div style={{
            marginTop:11,height:many?18:23,position:"relative",
            background:"#2B4158",borderRadius:12,
          }}>
            <div style={{
              position:"absolute",height:"100%",width:3,
              left:"50%",top:0,background:"#BACAD8",zIndex:1,
            }}/>
            <div style={{
              position:"absolute",height:"100%",borderRadius:10,top:0,
              left:b.value<0?undefined:"50%",
              right:b.value<0?"50%":undefined,
              background:b.value<0?P.red:P.teal,
              width:(46*Math.abs(b.value)/max*ease(f,26+i*9,30))+"%",
              boxShadow:"0 0 15px "+(b.value<0?P.red:P.teal)+"55",
            }}/>
          </div>
        </div>
      ))}
      <div style={{
        fontSize:17,color:P.muted,marginTop:many?13:22,
        lineHeight:1.22,
      }}>{v.qualifier||"Dữ liệu xác minh; không phải đồ thị thời gian"}</div>
    </div>
  );
};

const Chip:React.FC<{v:KciVisual;s:RenderScene;f:number}> = ({v,s,f}) => (
  <div style={{height:REELS_SAFE.artworkHeight,overflow:"hidden"}}>
    <div style={{
      ...card,height:284,position:"relative",overflow:"hidden",
      background:"radial-gradient(ellipse at center,#17445B,#0C2138 70%)",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 940 360">
        {Array.from({length:12},(_,i)=>(
          <g key={i}>
            <path d={"M0 "+(20+i*29)+" H"+(115+(i%4)*35)+" V"+(65+(i%5)*24)+" H310"}
              fill="none" stroke={P.teal} strokeWidth="3"
              strokeDasharray="12 11" strokeDashoffset={-f*1.5}
              opacity={.15+.12*Math.max(0,Math.sin(f/17+i))}/>
            <path d={"M940 "+(20+i*29)+" H"+(810-(i%4)*35)+" V"+(65+(i%5)*24)+" H628"}
              fill="none" stroke={P.blue} strokeWidth="3"
              strokeDasharray="12 11" strokeDashoffset={f*1.5}
              opacity={.16+.1*Math.max(0,Math.cos(f/12+i))}/>
          </g>
        ))}
        <rect x="308" y="39" width="325" height="275" rx="25"
          fill="#0A2036" stroke={P.teal} strokeWidth="5"/>
        <rect x="324" y="55" width="293" height="243" rx="16"
          fill="#113B56" stroke="#81CEE2" strokeWidth="1"/>
        <text x="470" y="155" textAnchor="middle" fontSize="44"
          fontWeight="bold" fill={P.white}>
          {v.company||"Korean Company"}
        </text>
        <text x="470" y="238" textAnchor="middle" fontSize="65"
          fontWeight="bold" fill={P.teal}>
          {s.stats[0]?.value||"—"}
        </text>
      </svg>
    </div>
    <div style={{display:"flex",gap:12,marginTop:14}}>
      {(v.bullets||[s.summary]).slice(0,2).map((t,i)=>(
        <div key={i} style={{
          ...card,...fadeUp(f,28+i*12),padding:"18px 17px",
          flex:1,minWidth:0,fontSize:23,
          color:i?P.amber:P.teal,fontWeight:900,lineHeight:1.22,
          display:"flex",alignItems:"center",minHeight:93,
          boxSizing:"border-box",
        }}>{t}</div>
      ))}
    </div>
  </div>
);

const Spotlight:React.FC<{v:KciVisual;f:number;color:string}> = ({
  v,f,color,
}) => (
  <div style={{
    ...card,height:REELS_SAFE.artworkHeight,position:"relative",
    overflow:"hidden",textAlign:"center",
    background:"radial-gradient(ellipse at center,#27404B,#0C2038 70%)",
  }}>
    <svg width="100%" height="100%" viewBox="0 0 800 460"
      style={{position:"absolute",inset:0}}>
      {Array.from({length:5},(_,i)=>(
        <circle key={i} cx="400" cy="213"
          r={92+i*43+10*ease(f,10,45)}
          fill="none" stroke={color} strokeWidth="2"
          strokeDasharray="12 16" strokeDashoffset={(i%2?-1:1)*f}
          opacity={.12+.11*Math.sin(f/17+i)**2}/>
      ))}
    </svg>
    <div style={{position:"relative",padding:"52px 30px 20px"}}>
      <div style={{
        fontSize:24,color,fontWeight:900,letterSpacing:1.2,
      }}>{v.unit||"CHỈ SỐ THỊ TRƯỜNG"}</div>
      <div style={{
        ...fadeUp(f,16),fontSize:(v.value||"").length>10?82:113,
        letterSpacing:-3,fontWeight:950,marginTop:36,
        overflowWrap:"anywhere",
      }}>{v.value}</div>
      <div style={{
        ...card,...fadeUp(f,38),fontSize:24,color,
        margin:"38px 20px 0",padding:"23px 22px",
        fontWeight:850,lineHeight:1.27,
      }}>{v.qualifier}</div>
    </div>
  </div>
);

const Rate:React.FC<{v:KciVisual;f:number}> = ({v,f}) => {
  const r=145,c=2*Math.PI*r;
  const ratio=Math.min(1,Math.max(0,(v.numericValue||0)/(v.scaleMax||5)));
  return (
    <div style={{
      ...card,height:REELS_SAFE.artworkHeight,position:"relative",
      overflow:"hidden",display:"flex",justifyContent:"center",
    }}>
      <svg width="390" height="390" viewBox="0 0 390 390">
        <circle cx="195" cy="190" r={r} fill="none"
          stroke="#38516C" strokeWidth="23"/>
        <circle cx="195" cy="190" r={r} fill="none"
          stroke={P.blue} strokeWidth="23" strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c*(1-ratio*ease(f,14,50))}
          transform="rotate(-90 195 190)"/>
      </svg>
      <div style={{
        position:"absolute",top:120,left:0,right:0,
        textAlign:"center",
      }}>
        <div style={{fontSize:23,color:P.muted,fontWeight:850}}>
          {v.unit||"LÃI SUẤT"}
        </div>
        <div style={{fontSize:87,fontWeight:950,letterSpacing:-2}}>
          {v.value}
        </div>
        {v.statusLabel&&(
          <div style={{fontSize:25,color:P.teal,fontWeight:850}}>
            {v.statusLabel}
          </div>
        )}
        <div style={{fontSize:17,color:P.muted,marginTop:7}}>
          Thang minh họa 0–{v.scaleMax||5}
        </div>
      </div>
      <div style={{
        position:"absolute",bottom:14,left:26,right:26,
        textAlign:"center",fontSize:20,fontWeight:750,color:P.muted,
      }}>{v.qualifier}</div>
    </div>
  );
};

const Closing:React.FC<{v:KciVisual;f:number}> = ({v,f}) => {
  const bullets=(v.bullets||[]).slice(0,4);
  return (
    <div style={{height:310,overflow:"hidden"}}>
      <div style={{
        fontSize:23,color:P.teal,fontWeight:900,
        letterSpacing:1.8,...fadeUp(f,3),
      }}>NHỮNG ĐIỀU CẦN THEO DÕI</div>
      {bullets.map((b,i)=>(
        <div key={i} style={{
          ...card,...fadeUp(f,13+i*10),
          marginTop:11,padding:"12px 17px",
          minHeight:58,boxSizing:"border-box",
          display:"flex",alignItems:"center",gap:15,
          borderLeft:"6px solid "+[P.teal,P.amber,P.blue][i%3],
        }}>
          <span style={{
            fontSize:34,fontWeight:950,
            color:[P.teal,P.amber,P.blue][i%3],
          }}>0{i+1}</span>
          <span style={{fontSize:24,fontWeight:850,lineHeight:1.15}}>
            {b}
          </span>
        </div>
      ))}
    </div>
  );
};

const CallToAction:React.FC<{
  cta:KciCta;f:number;durationFrames:number;
}> = ({cta,f,durationFrames}) => {
  const showAt=Math.max(16,Math.floor(durationFrames*.51));
  const p=ease(f,showAt,18);
  return (
    <div style={{
      position:"absolute",
      left:REELS_SAFE.left,right:REELS_SAFE.right,top:REELS_SAFE.cta,
      padding:"20px 24px",minHeight:157,boxSizing:"border-box",
      borderRadius:19,border:"2px solid "+P.teal,
      background:"linear-gradient(95deg,rgba(11,69,76,.98),rgba(5,26,48,.98))",
      boxShadow:"0 0 38px #37E5C52A",
      opacity:p,transform:"translateY("+((1-p)*30)+"px)",
    }}>
      <div style={{
        fontSize:16,letterSpacing:2.0,color:"#9FF4D9",fontWeight:900,
      }}>
        {cta.type==="comment"?"GÓC NHÌN CỦA ANH CHỊ":
          cta.type==="follow"?"THEO DÕI KCI":"LƯU LẠI ĐỂ THAM KHẢO"}
      </div>
      <div style={{
        fontSize:cta.screenHeadline.length>47?27:33,
        fontWeight:950,lineHeight:1.16,marginTop:10,
      }}>{cta.screenHeadline}</div>
      <div style={{
        fontSize:20,color:"#C4E8E1",fontWeight:750,
        marginTop:10,lineHeight:1.18,
      }}>{cta.screenSubline}</div>
    </div>
  );
};

const Bottom:React.FC<{s:RenderScene;f:number;color:string}> = ({
  s,f,color,
}) => {
  const cue=s.captions.find(c=>f>=c.from&&f<c.to);
  const opacity=cue?ease(f,cue.from,5):0;
  return (
    <>
      <div style={{
        position:"absolute",
        left:REELS_SAFE.left,right:REELS_SAFE.right,
        top:REELS_SAFE.source,
        fontSize:18,color:P.muted,fontWeight:750,
        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
      }}>NGUỒN: {s.source}</div>
      <div style={{
        position:"absolute",
        left:REELS_SAFE.left,right:REELS_SAFE.right,
        top:REELS_SAFE.captions,height:REELS_SAFE.captionsHeight,
        padding:"17px 23px",boxSizing:"border-box",
        borderRadius:17,background:"rgba(1,10,24,.97)",
        border:"1px solid "+P.border,borderLeft:"6px solid "+color,
        display:"flex",alignItems:"center",justifyContent:"center",
        overflow:"hidden",
      }}>
        <div style={{
          fontSize:29,fontWeight:870,lineHeight:1.22,
          opacity,textAlign:"center",whiteSpace:"pre-wrap",
          overflowWrap:"break-word",
        }}>{cue?.text||""}</div>
      </div>
      <div style={{
        position:"absolute",
        left:REELS_SAFE.left,right:REELS_SAFE.right,
        top:REELS_SAFE.disclaimer,
        color:"#94A9B9",textAlign:"center",
        fontSize:16,fontWeight:650,
      }}>Thông tin tham khảo · Không phải khuyến nghị đầu tư</div>
    </>
  );
};

const Scene:React.FC<{
  scene:RenderScene;edition:string;index:number;
  count:number;preview:boolean;safeGuides:boolean;
}> = ({scene,edition,index,count,preview,safeGuides}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const v=scene.visual;
  const color=v?.kind==="risk-bars"?P.red:
    v?.kind==="spotlight"?P.amber:v?.kind==="rate"?P.blue:P.teal;
  const inOut=Math.min(
    interpolate(frame,[0,10],[0,1],cap),
    interpolate(frame,[Math.max(0,scene.durationFrames-9),scene.durationFrames],[1,0],cap),
  );
  const settle=spring({frame,fps,config:{damping:22,stiffness:70,mass:1}});
  return (
    <AbsoluteFill style={{
      background:P.bg,color:P.white,fontFamily:"Arial, sans-serif",overflow:"hidden",
    }}>
      <Background frame={frame} color={color}/>
      <AbsoluteFill style={{
        opacity:inOut,
        transform:"scale("+(0.986+.014*settle)+")",
      }}>
        <Masthead i={index} count={count} edition={edition} color={color}/>
        <Headline scene={scene} frame={frame} color={color}/>
        <div style={{
          position:"absolute",
          left:REELS_SAFE.left,right:REELS_SAFE.right,
          top:REELS_SAFE.artwork,height:REELS_SAFE.artworkHeight,
          overflow:"hidden",
        }}>
          {v?.kind==="reversal"&&<Reversal v={v} f={frame}/>}
          {["comparison","risk-bars"].includes(v?.kind||"")&&v&&(
            <Bars v={v} f={frame}/>
          )}
          {v?.kind==="company"&&<Chip v={v} s={scene} f={frame}/>}
          {v?.kind==="spotlight"&&<Spotlight v={v} f={frame} color={color}/>}
          {v?.kind==="rate"&&<Rate v={v} f={frame}/>}
          {v?.kind==="closing"&&<Closing v={v} f={frame}/>}
          {(!v||v.kind==="generic")&&(
            <div style={{
              display:"grid",
              gridTemplateColumns:scene.stats.length>2?"1fr 1fr":"1fr",
              gap:13,
            }}>
              {scene.stats.map((st,i)=>(
                <div key={i} style={{...fadeUp(frame,15+i*9)}}>
                  <Info label={st.label} value={st.value}
                    color={tone(st.tone)} sub={st.change}/>
                </div>
              ))}
            </div>
          )}
        </div>
        {v?.kind==="closing"&&scene.cta&&(
          <CallToAction cta={scene.cta} f={frame}
            durationFrames={scene.durationFrames}/>
        )}
        <Bottom s={scene} f={frame} color={color}/>
      </AbsoluteFill>
      {preview&&(
        <div style={{
          position:"absolute",top:REELS_SAFE.top-38,
          right:REELS_SAFE.right+8,color:P.red,fontSize:19,fontWeight:900,
        }}>SILENT PREVIEW</div>
      )}
      {scene.audioFile&&<Audio src={staticFile(scene.audioFile)}/>}
      {safeGuides&&<ReelsSafeGuides/>}
    </AbsoluteFill>
  );
};

export const KciNewsDaily:React.FC<KciVideoProps> = ({
  scenes,edition,preview,safeGuides=false,
}) => (
  <AbsoluteFill style={{background:P.bg}}>
    {scenes.map((scene,i)=>(
      <Sequence key={scene.id} name={scene.headline}
        from={scene.startFrame} durationInFrames={scene.durationFrames}>
        <Scene scene={scene} edition={edition} index={i+1}
          count={scenes.length} preview={preview} safeGuides={safeGuides}/>
      </Sequence>
    ))}
  </AbsoluteFill>
);
