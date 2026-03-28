"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Root.tsx — Remotion entry (client-only)
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./VideoComposition";
import { VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT } from "./video.types";

export { VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT } from "./video.types";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VidmaxxVideo"
    component={VideoComposition as any}
    durationInFrames={300}
    fps={VIDEO_FPS}
    width={VIDEO_WIDTH}
    height={VIDEO_HEIGHT}
    defaultProps={{
      audioSrc: "",
      imageSrcs: [],
      captionChunks: [],
      captionStyle: "default",
      durationInFrames: 300,
      bgMusic: "calm",
    }}
  />
);
