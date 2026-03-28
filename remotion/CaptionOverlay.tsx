"use client";
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionStyle } from './video.types';
import { CAPTION_STYLE_MAP } from '../lib/constants';

interface CaptionOverlayProps {
  text: string;
  captionStyle: CaptionStyle;
  durationInFrames: number;
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({ 
  text, 
  captionStyle, 
  durationInFrames 
}) => {
    const frame = useCurrentFrame();

    // Pop in: frames 0-4
    const scale = interpolate(frame, [0, 4], [0.85, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Fade timing: relative to durationInFrames
    const fadeOutStart = Math.max(durationInFrames - 3, durationInFrames * 0.7);
    const opacity = interpolate(
        frame,
        [0, 3, fadeOutStart, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const baseStyle = CAPTION_STYLE_MAP[captionStyle] || CAPTION_STYLE_MAP.default;

    const { width } = useVideoConfig();
    const baseFontSize = width * 0.052; // Scale font size relative to width (~112px for 4K)

    return (
        <AbsoluteFill
            style={{
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: width * 0.08, // Scale padding
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    color: baseStyle.color,
                    fontFamily: baseStyle.font.split('-')[0], 
                    fontSize: baseFontSize,
                    fontWeight: 900,
                    textTransform: baseStyle.textTransform as any,
                    backgroundColor: baseStyle.backgroundColor || 'transparent',
                    boxShadow: baseStyle.backgroundColor ? '0 8px 30px rgba(0,0,0,0.4)' : 'none',
                    WebkitTextStroke: baseStyle.strokeWidth ? `${baseStyle.strokeWidth} ${baseStyle.strokeColor}` : 'none',
                    textShadow: baseStyle.glowColor
                        ? `0 0 10px ${baseStyle.color}, 0 0 25px ${baseStyle.glowColor}`
                        : '0 4px 12px rgba(0,0,0,0.5)',
                    transform: `scale(${scale})`,
                    opacity,
                    maxWidth: "88%",
                    padding: "8px 20px",
                    lineHeight: 1.25,
                    borderRadius: 10,
                    textAlign: "center",
                }}
            >
                {text}
            </div>
        </AbsoluteFill>
    );
};
