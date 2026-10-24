import React from "react";
import {AbsoluteFill} from "remotion";

/**
 * Conservative Reels-safe layout for a 1080x1920 portrait master.
 * These coordinates are editorial constraints based on a real Instagram
 * viewing screenshot, not guarantees across all app versions/devices.
 *
 * Decoration/background may bleed to the full canvas.
 * Mandatory readable elements must stay inside this rectangle.
 */
export const REELS_SAFE = {
  // User screenshot reference: Instagram overlays the top navigation,
  // right reaction controls, and lower account/caption panels.
  left: 96,
  right: 196,
  top: 264,
  bottom: 480,
} as const;

export const REELS_CONTENT_WIDTH = 1080 - REELS_SAFE.left - REELS_SAFE.right;
export const REELS_CONTENT_BOTTOM = 1920 - REELS_SAFE.bottom;

/**
 * QC guide only. Must never be enabled in the published composition.
 * Magenta regions approximate the top/bottom UI and right interaction rail.
 */
export const ReelsSafeGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents:"none"}}>
    <div style={{
      position:"absolute",top:0,left:0,right:0,
      height:REELS_SAFE.top,background:"rgba(224,46,80,.12)",
      borderBottom:"2px solid #FCA5A5",
    }}/>
    <div style={{
      position:"absolute",bottom:0,left:0,right:0,
      height:REELS_SAFE.bottom,background:"rgba(224,46,80,.12)",
      borderTop:"2px solid #FCA5A5",
    }}/>
    <div style={{
      position:"absolute",top:REELS_SAFE.top,bottom:REELS_SAFE.bottom,
      right:0,width:REELS_SAFE.right,
      background:"rgba(224,46,80,.12)",borderLeft:"2px solid #FCA5A5",
    }}/>
    <div style={{
      position:"absolute",
      left:REELS_SAFE.left,
      right:REELS_SAFE.right,
      top:REELS_SAFE.top,
      bottom:REELS_SAFE.bottom,
      border:"3px dashed #F5D46D",
      borderRadius:14,
    }}/>
    <div style={{
      position:"absolute",top:REELS_SAFE.top+9,left:REELS_SAFE.left+12,
      color:"#FFE79A",background:"#071224",padding:"4px 11px",
      fontFamily:"Arial,sans-serif",fontSize:20,fontWeight:800,
    }}>REELS SAFE AREA — QC ONLY</div>
  </AbsoluteFill>
);
