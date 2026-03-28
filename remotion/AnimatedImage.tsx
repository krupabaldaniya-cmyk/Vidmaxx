"use client";
// ─────────────────────────────────────────────────────────────────────────────
// AnimatedImage.tsx — Remotion React component (client-only)
// ONLY imported by VideoComposition.tsx — never by server-side code.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { AnimationType } from "./video.types";

export type { AnimationType } from "./video.types";

interface AnimatedImageProps {
  src: string;
  animation: AnimationType;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, animation }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 20, durationInFrames - 20, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const getTransform = (): string => {
    switch (animation) {
      case "zoomIn": {
        const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.18], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return `scale(${scale})`;
      }
      case "slideUp": {
        const y = interpolate(frame, [0, 30], [50, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return `translateY(${y}px)`;
      }
      case "slideDown": {
        const y = interpolate(frame, [0, 30], [-50, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return `translateY(${y}px)`;
      }
      case "fadeIn":
      default:
        return "none";
    }
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity,
          transform: getTransform(),
          willChange: "transform, opacity",
        }}
      />
    </AbsoluteFill>
  );
};
