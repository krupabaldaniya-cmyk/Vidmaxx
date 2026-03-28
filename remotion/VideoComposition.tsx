"use client";
// ─────────────────────────────────────────────────────────────────────────────
// VideoComposition.tsx — Remotion React component (client-only)
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from 'remotion';
import { VideoCompositionProps } from './video.types';
import { AnimatedImage } from './AnimatedImage';
import { CaptionOverlay } from './CaptionOverlay';

const ANIMATION_CYCLE = ["zoomIn", "slideUp", "slideDown", "fadeIn"] as const;

export const VideoComposition: React.FC<VideoCompositionProps> = ({
    audioSrc,
    imageSrcs,
    captionChunks,
    captionStyle,
    bgMusicFile,
}) => {
    const { durationInFrames } = useVideoConfig();
    const framesPerImage = Math.floor(durationInFrames / Math.max(imageSrcs.length, 1));

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
            {/* Layer 1 — Background music: 15% volume, loops for full duration */}
            {bgMusicFile && (
                <Audio
                    src={bgMusicFile}
                    volume={0.15}
                    loop
                />
            )}

            {/* Layer 2 — Voiceover: 100% volume */}
            <Audio src={audioSrc} volume={1.0} />

            {/* Layer 3 — Animated scene images */}
            {imageSrcs.map((src, i) => {
                const from = i * framesPerImage;
                const duration = i === imageSrcs.length - 1
                    ? durationInFrames - from
                    : framesPerImage;
                
                return (
                    <Sequence key={`img-${i}`} from={from} durationInFrames={Math.max(duration, 1)}>
                        <AnimatedImage
                            src={src}
                            animation={ANIMATION_CYCLE[i % ANIMATION_CYCLE.length]}
                        />
                    </Sequence>
                );
            })}

            {/* Layer 4 — Captions synced to voiceover word timestamps */}
            {captionChunks.map((chunk, i) => {
                const duration = Math.max(chunk.endFrame - chunk.startFrame, 2);
                return (
                    <Sequence
                        key={`cap-${i}`}
                        from={chunk.startFrame}
                        durationInFrames={duration}
                    >
                        <CaptionOverlay 
                            text={chunk.text} 
                            captionStyle={captionStyle} 
                            durationInFrames={duration}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
