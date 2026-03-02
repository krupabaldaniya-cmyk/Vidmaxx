'use client';

import React, { useState, useEffect } from 'react';
import { Type, Check, Sparkles, Play } from 'lucide-react';
import { CaptionStyles } from '@/lib/constants';

interface TypographySelectionProps {
    formData: any;
    updateFormData: (step: string, data: any) => void;
}

const CaptionPreview = ({ style, isSelected }: { style: typeof CaptionStyles[0], isSelected: boolean }) => {
    const [tick, setTick] = useState(0);

    // Loop animation for preview
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getAnimationClass = (animation: string) => {
        switch (animation) {
            case 'pop':
                return 'animate-caption-pop';
            case 'bounce':
                return 'animate-bounce';
            case 'flicker':
                return 'animate-caption-flicker';
            case 'scale':
                return 'animate-in zoom-in-90 duration-500';
            case 'slide-up':
                return 'animate-caption-slide-up';
            case 'fade':
                return 'animate-in fade-in duration-1000';
            default:
                return '';
        }
    };

    return (
        <div className="h-44 rounded-[28px] bg-zinc-950 flex items-center justify-center relative overflow-hidden ring-1 ring-zinc-800 shadow-2xl group-hover:ring-zinc-700 transition-all duration-500">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

            {/* Simulated Content Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-zinc-900/20" />

            {/* Simulated Video Frame */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div
                    key={tick} // Key change triggers re-animation
                    className={`px-5 py-2.5 rounded-xl font-black tracking-tight text-3xl leading-none select-none ${getAnimationClass(style.animation)}`}
                    style={{
                        color: style.color,
                        backgroundColor: (style as any).backgroundColor || 'transparent',
                        boxShadow: (style as any).backgroundColor ? '0 8px 30px rgba(0,0,0,0.4)' : 'none',
                        textShadow: (style as any).glowColor
                            ? `0 0 10px ${style.color}, 0 0 25px ${(style as any).glowColor}`
                            : (style as any).strokeColor
                                ? `none`
                                : '0 8px 16px rgba(0,0,0,0.6)',
                        WebkitTextStroke: (style as any).strokeWidth ? `${(style as any).strokeWidth} ${(style as any).strokeColor}` : 'none',
                        textTransform: style.textTransform as any,
                        fontFamily: style.font.split('-')[0], // Simplified choice
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    MODERN ART
                </div>
            </div>

            {/* Play Indicator Status Overlay */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

            <div className="absolute bottom-4 left-6 flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Capture</span>
            </div>

            <div className="absolute bottom-4 right-6 flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                <Play className="w-2.5 h-2.5 fill-current" />
                Preview
            </div>

            {/* Selection Highlight */}
            {isSelected && (
                <div className="absolute inset-0 ring-2 ring-purple-500/50 rounded-[28px] pointer-events-none" />
            )}
        </div>
    );
};

export default function TypographySelection({ formData, updateFormData }: TypographySelectionProps) {
    const handleStyleSelect = (style: typeof CaptionStyles[0]) => {
        updateFormData('typography', {
            styleId: style.id,
            styleName: style.name
        });
    };

    return (
        <div className="space-y-10 relative z-10 flex flex-col h-full pb-6">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-purple-600/50" />
                    <span className="text-sm font-black text-purple-500 uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]">Typography System</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">Caption Style</h2>
                <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">Choose an aesthetic for your subtitles that fits your niche. These styles are designed for maximum engagement.</p>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-3 custom-scrollbar max-h-[620px] pb-8 group/list">
                    {CaptionStyles.map((style) => {
                        const isSelected = formData.typography?.styleId === style.id;
                        return (
                            <div
                                key={style.id}
                                onClick={() => handleStyleSelect(style)}
                                className={`group relative p-1.5 rounded-[36px] transition-all duration-700 cursor-pointer flex flex-col ${isSelected
                                    ? 'bg-gradient-to-b from-purple-500/20 to-transparent ring-1 ring-purple-500 shadow-[0_30px_60px_-15px_rgba(147,51,234,0.25)] scale-[1.02] z-20'
                                    : 'bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/60 hover:bg-zinc-900/60 z-10'
                                    }`}
                            >
                                <div className={`p-4 space-y-6 rounded-[31px] transition-colors duration-500 ${isSelected ? 'bg-zinc-950/40' : 'bg-transparent'}`}>
                                    <CaptionPreview style={style} isSelected={isSelected} />

                                    <div className="space-y-4 px-2 pb-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <h4 className={`font-black text-xl transition-all duration-500 ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                                {style.name}
                                            </h4>
                                            {isSelected && (
                                                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.6)] animate-in zoom-in spin-in-90 duration-500">
                                                    <Check className="w-4 h-4 text-white" strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-500 leading-relaxed font-bold line-clamp-2 min-h-[40px] opacity-80 group-hover:opacity-100 transition-opacity">
                                            {style.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2.5 pt-1">
                                            {style.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full transition-all duration-500 
                                                        ${isSelected
                                                            ? 'bg-purple-600/20 text-purple-400 ring-1 ring-purple-500/30'
                                                            : 'bg-zinc-800/80 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-400'
                                                        }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Outer selection glow */}
                                {isSelected && (
                                    <div className="absolute inset-0 -z-10 bg-purple-600/10 blur-3xl rounded-full" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Selection Status Hint */}
            {!formData.typography?.styleId && (
                <div className="p-5 rounded-[24px] bg-zinc-900/30 border border-dashed border-zinc-800/80 flex items-center justify-between text-zinc-500 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-zinc-800/50">
                            <Type className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest italic opacity-60">Selection Required</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-700">0 / 1 Style Selected</span>
                </div>
            )}
        </div>
    );
}
