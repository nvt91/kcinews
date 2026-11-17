import React from "react";
import {Easing, interpolate, spring, useVideoConfig} from "remotion";

/** Step 1 of the 17/11/2026 "video sinh động hơn" upgrade.
 * Pure Remotion (no extra packages): keyword captions timed per word,
 * count-up numbers, animated up/down arrows and a brand wipe between scenes.
 * Every element only re-presents data already in the job; nothing is invented. */

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const KCI_COLORS = {teal: "#36DEC0", red: "#FF647D", amber: "#FFD187", white: "#F8FCFF", muted: "#A6BDD1"};

type Word = {text: string; from: number; to: number};

/** Group words into short cues (max 4 words, break after punctuation). */
export const groupWords = (words: Word[], max = 4): Word[][] => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= max || /[.,!?;:…]$/.test(w.text)) {
      groups.push(cur);
      cur = [];
    }
  }
  if (cur.length) groups.push(cur);
  return groups;
};

const UP = /^(tăng|hồi|vượt|cao|mạnh|lãi|dương|bứt)/iu;
const DOWN = /^(giảm|mất|lao|rơi|sụt|thấp|yếu|âm|bán|đỏ)/iu;
const NUM = /[0-9]|phần|phẩy|nghìn|triệu|tỷ|USD|đô/iu;

const wordColor = (text: string, accent: string) =>
  DOWN.test(text) ? KCI_COLORS.red : UP.test(text) ? KCI_COLORS.teal : NUM.test(text) ? KCI_COLORS.amber : accent;

/** Karaoke-style 2–4 word cue: the spoken word pops in the accent colour. */
export const KeywordCaption: React.FC<{words: Word[]; frame: number; accent: string}> = ({words, frame, accent}) => {
  const {fps} = useVideoConfig();
  const groups = groupWords(words);
  const gi = groups.findIndex((g, k) => frame >= g[0].from && frame < (groups[k + 1]?.[0].from ?? g[g.length - 1].to + 12));
  if (gi < 0) return null;
  const group = groups[gi];
  const enterProgress = spring({frame: frame - group[0].from, fps, config: {damping: 16, stiffness: 180}});
  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", transform: `translateY(${(1 - enterProgress) * 18}px)`, opacity: enterProgress}}>
      {group.map((w, i) => {
        const active = frame >= w.from && frame < Math.max(w.to, w.from + 3);
        const spoken = frame >= w.from;
        const pop = spring({frame: frame - w.from, fps, config: {damping: 11, stiffness: 220}, durationInFrames: 10});
        const color = spoken ? wordColor(w.text, active ? accent : KCI_COLORS.white) : "#8FA6BA";
        return (
          <span key={i} style={{display: "inline-block", fontSize: 50, fontWeight: 950, letterSpacing: -0.3, color, transform: `scale(${active ? 1 + 0.12 * pop : 1})`, textShadow: active ? `0 0 22px ${color}66` : "none"}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** Count a formatted Vietnamese number up from 0, keeping its exact final text. */
export const CountUp: React.FC<{value: string; frame: number; start?: number; duration?: number}> = ({value, frame, start = 10, duration = 22}) => {
  const m = /^([^0-9]*)([0-9][0-9.]*(?:,[0-9]+)?)(.*)$/u.exec(value);
  if (!m) return <>{value}</>;
  const [, prefix, digits, suffix] = m;
  const decimals = digits.includes(",") ? digits.split(",")[1].length : 0;
  const target = Number(digits.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(target)) return <>{value}</>;
  const t = interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  if (t >= 1) return <>{value}</>;
  const current = (target * t).toFixed(decimals);
  const [int, dec] = current.split(".");
  const grouped = digits.includes(".") ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : int;
  return <>{prefix}{grouped}{dec !== undefined ? "," + dec : ""}{suffix}</>;
};

/** Small animated arrow for up/down stats. */
export const TrendArrow: React.FC<{tone?: string; frame: number; size?: number}> = ({tone, frame, size = 34}) => {
  if (tone !== "up" && tone !== "down") return null;
  const down = tone === "down";
  const color = down ? KCI_COLORS.red : KCI_COLORS.teal;
  const appear = interpolate(frame, [8, 18], [0, 1], clamp);
  const bob = Math.sin(frame / 6) * 4 * (down ? 1 : -1);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{opacity: appear, transform: `translateY(${bob}px) rotate(${down ? 180 : 0}deg)`, flexShrink: 0}}>
      <path d="M12 3 L21 14 H15 V21 H9 V14 H3 Z" fill={color} />
    </svg>
  );
};

/** Brand-coloured wipe at the start of each scene (no timing change, audio untouched). */
export const SceneWipe: React.FC<{frame: number; color: string}> = ({frame, color}) => {
  const p = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (p >= 1) return null;
  return (
    <div style={{position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(100deg, ${color} 0%, ${color} 82%, transparent 100%)`, transform: `translateX(${p * 125}%)`, opacity: 0.9}} />
  );
};
