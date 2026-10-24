import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const FPS = 30;

export type MarketStat = {
  label: string;
  value: string;
  change?: string;
  tone?: "up" | "down" | "neutral";
};

export type SubtitleCue = {
  from: number;
  to: number;
  text: string;
};

export type KciVisual = {
  kind: "reversal" | "comparison" | "company" | "risk-bars" | "spotlight" | "rate" | "closing" | "generic";
  banner?: string;
  milestones?: Array<{ label: string; value: string; tone?: "up" | "down" | "neutral" }>;
  bars?: Array<{ label: string; value: number; display: string; tone?: "up" | "down" | "neutral" }>;
  qualifier?: string;
  company?: string;
  bullets?: string[];
  value?: string;
  unit?: string;
  numericValue?: number;
  scaleMax?: number;
};

export type KciCta = {
  type: "comment" | "follow" | "save";
  spoken: string;
  screenHeadline: string;
  screenSubline: string;
  question?: string;
};

export type RenderScene = {
  id: string;
  eyebrow: string;
  headline: string;
  summary: string;
  source: string;
  stats: MarketStat[];
  startFrame: number;
  durationFrames: number;
  audioFile?: string;
  captions: SubtitleCue[];
  sourceIds?: string[];
  visual?: KciVisual;
  cta?: KciCta;
};

export type KciVideoProps = {
  headline: string;
  edition: string;
  scenes: RenderScene[];
  preview: boolean;
};

const colors = {
  navy: "#08132B",
  navy2: "#0D2140",
  teal: "#37E0C4",
  white: "#F6FAFF",
  muted: "#B2C5D6",
  green: "#3FE1AE",
  red: "#FF7787",
};

const statColor = (tone?: MarketStat["tone"]): string => {
  if (tone === "up") return colors.green;
  if (tone === "down") return colors.red;
  return colors.white;
};

const NewsScene: React.FC<{
  scene: RenderScene;
  edition: string;
  sceneNumber: number;
  sceneCount: number;
  preview: boolean;
}> = ({ scene, edition, sceneNumber, sceneCount, preview }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 13], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [Math.max(0, scene.durationFrames - 10), scene.durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const alpha = Math.min(fadeIn, fadeOut);
  const rise = interpolate(frame, [0, 18], [46, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeCue = scene.captions.find(
    (cue) => frame >= cue.from && frame < cue.to,
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #071226 0%, #102544 62%, #06101D 100%)",
        fontFamily: "Arial, sans-serif",
        color: colors.white,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 82% 22%, rgba(55,224,196,0.13), transparent 42%)",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 86,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #35506A",
          paddingBottom: 26,
        }}
      >
        <span style={{ fontSize: 30, letterSpacing: 5, fontWeight: 800 }}>
          KOREA CAPITAL INSIGHT
        </span>
        <span style={{ fontSize: 27, color: colors.teal, fontWeight: 700 }}>KCI</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 258,
          left: 70,
          right: 70,
          opacity: alpha,
          transform: "translateY(" + rise + "px)",
        }}
      >
        <div style={{ color: colors.teal, fontSize: 34, fontWeight: 700, letterSpacing: 3 }}>
          {scene.eyebrow.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 74,
            lineHeight: 1.14,
            fontWeight: 900,
            marginTop: 34,
            wordBreak: "break-word",
          }}
        >
          {scene.headline}
        </div>
        <div
          style={{
            marginTop: 45,
            fontSize: 37,
            lineHeight: 1.38,
            color: colors.muted,
          }}
        >
          {scene.summary}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 970,
          left: 70,
          right: 70,
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          opacity: alpha,
        }}
      >
        {scene.stats.slice(0, 3).map((stat) => (
          <div
            key={stat.label}
            style={{
              flexGrow: 1,
              minWidth: 240,
              padding: "28px 24px",
              border: "1px solid #284762",
              borderRadius: 21,
              background: "rgba(9, 27, 51, 0.86)",
            }}
          >
            <div style={{ fontSize: 27, color: colors.muted }}>{stat.label}</div>
            <div
              style={{
                fontSize: 44,
                marginTop: 14,
                fontWeight: 800,
                color: statColor(stat.tone),
              }}
            >
              {stat.value}
            </div>
            {stat.change && (
              <div
                style={{ fontSize: 29, marginTop: 9, color: statColor(stat.tone) }}
              >
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 295,
          minHeight: 142,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: "rgba(0,8,20,0.90)",
          borderRadius: 16,
          padding: 22,
          fontSize: 43,
          lineHeight: 1.22,
          fontWeight: 800,
          whiteSpace: "pre-line",
        }}
      >
        {activeCue ? activeCue.text : scene.summary}
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 178,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 25,
          color: colors.muted,
        }}
      >
        <span>{edition} · Nguồn: {scene.source}</span>
        <span>{sceneNumber}/{sceneCount}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 112,
          height: 4,
          background: "#2C435F",
        }}
      >
        <div
          style={{
            height: "100%",
            width: (100 * (frame / Math.max(1, scene.durationFrames - 1))) + "%",
            background: colors.teal,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 58,
          left: 70,
          right: 70,
          fontSize: 22,
          textAlign: "center",
          color: "#91A7BC",
        }}
      >
        Thông tin tham khảo, không phải khuyến nghị đầu tư.
      </div>

      {preview && (
        <div
          style={{
            position: "absolute",
            top: 164,
            right: 70,
            color: colors.red,
            border: "2px solid " + colors.red,
            padding: "11px 17px",
            borderRadius: 8,
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          PREVIEW — CHƯA CÓ VOICE
        </div>
      )}
      {scene.audioFile && <Audio src={staticFile(scene.audioFile)} />}
    </AbsoluteFill>
  );
};

export const KciNews: React.FC<KciVideoProps> = ({ scenes, edition, preview }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      {scenes.map((scene, i) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={scene.headline}
        >
          <NewsScene
            scene={scene}
            edition={edition}
            sceneNumber={i + 1}
            sceneCount={scenes.length}
            preview={preview}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
