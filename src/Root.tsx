import React from "react";
import { Composition } from "remotion";
import { FPS, KciNews, type KciVideoProps } from "./KciNews";
import { KciNewsV2 } from "./KciNewsV2";
// Keep the job/composition ID stable; only replace the presentation layer.
import { KciNewsReels as KciNewsDaily } from "./KciNewsReels";

const demo: KciVideoProps = {
  headline: "KCI Market News",
  edition: "23/10/2026 KST",
  preview: true,
  scenes: [
    {
      id: "demo",
      eyebrow: "KCI | Bản xem trước",
      headline: "KOSPI đảo chiều trong phiên",
      summary: "Dự án thử bố cục. Chưa có giọng đọc và chưa sẵn sàng xuất bản.",
      source: "KRX — dữ liệu mẫu 23/10/2026",
      stats: [
        { label: "KOSPI", value: "5.550,30", change: "+0,30%", tone: "up" },
        { label: "KOSDAQ", value: "751,69", change: "−1,62%", tone: "down" },
      ],
      captions: [],
      startFrame: 0,
      durationFrames: 240,
    },
  ],
};

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="KciNews"
    component={KciNews}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={240}
    defaultProps={demo}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(
        FPS,
        props.scenes.reduce(
          (end, scene) => Math.max(end, scene.startFrame + scene.durationFrames),
          0,
        ),
      ),
    })}
  />
  <Composition
    id="KciNewsV2"
    component={KciNewsV2}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={240}
    defaultProps={demo}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(FPS, props.scenes.reduce(
        (end, scene) => Math.max(end, scene.startFrame + scene.durationFrames), 0,
      )),
    })}
  />
  <Composition
    id="KciNewsDaily"
    component={KciNewsDaily}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={240}
    defaultProps={demo}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(FPS, props.scenes.reduce(
        (end, scene) => Math.max(end, scene.startFrame + scene.durationFrames), 0,
      )),
    })}
  />
  </>
);
