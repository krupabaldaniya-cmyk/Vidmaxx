'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoStyles } from '@/lib/constants';

interface VisualsSelectionProps {
    formData: any;
    updateFormData: (step: string, data: any) => void;
}

export default function VisualsSelection({ formData, updateFormData }: VisualsSelectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleStyleSelect = (style: typeof VideoStyles[0]) => {
        updateFormData('visuals', {
            styleId: style.id,
            styleName: style.name
        });
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth'
        });
    };

    const selectedStyle = VideoStyles.find(s => s.id === formData.visuals?.styleId);

    return (
        <div className="space-y-8 relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight">Video Style</h2>
                <p className="text-zinc-400 text-lg">
                    Choose the visual aesthetic for your video series.
                </p>
            </div>

            {/* Selected Badge */}
            {selectedStyle && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-purple-600/10 border border-purple-500/30 w-fit
                                animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-sm font-bold text-purple-300">
                        Selected: <span className="text-white">{selectedStyle.name}</span>
                    </span>
                </div>
            )}

            {/* Horizontal Scroll Container */}
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">
                        Select Style
                    </label>
                    {/* Scroll Arrows */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center
                                       text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800
                                       transition-all duration-200 active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center
                                       text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800
                                       transition-all duration-200 active:scale-95"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Row */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(147,51,234,0.4) transparent',
                    }}
                >
                    {VideoStyles.map((style) => {
                        const isSelected = formData.visuals?.styleId === style.id;
                        return (
                            <div
                                key={style.id}
                                onClick={() => handleStyleSelect(style)}
                                className={`group relative flex-shrink-0 cursor-pointer rounded-[20px] overflow-hidden
                                            transition-all duration-300
                                            ${isSelected
                                        ? 'ring-2 ring-purple-500 shadow-[0_0_24px_rgba(147,51,234,0.35)] scale-[1.02]'
                                        : 'ring-1 ring-zinc-800/60 hover:ring-zinc-600/80 hover:scale-[1.01]'
                                    }`}
                                style={{
                                    width: '180px',          /* fixed card width */
                                    aspectRatio: '9 / 16',   /* enforce 9:16 portrait ratio */
                                }}
                            >
                                {/* Full-bleed Image */}
                                <Image
                                    src={style.preview}
                                    alt={style.name}
                                    fill
                                    sizes="180px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    draggable={false}
                                />

                                {/* Gradient Overlay — always present, stronger at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                                {/* Selected Glow Overlay */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-purple-600/15 transition-opacity duration-300" />
                                )}

                                {/* Checkmark Badge */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-purple-600
                                                    flex items-center justify-center shadow-lg
                                                    animate-in zoom-in duration-200">
                                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                    </div>
                                )}

                                {/* Bottom Info */}
                                <div className="absolute bottom-0 left-0 right-0 z-10 p-3 space-y-1.5">
                                    <h4 className={`font-black text-sm leading-tight transition-colors duration-200
                                                   ${isSelected ? 'text-purple-300' : 'text-white group-hover:text-purple-200'}`}>
                                        {style.name}
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {style.tags.slice(0, 2).map(tag => (
                                            <span
                                                key={tag}
                                                className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full transition-colors
                                                           ${isSelected
                                                        ? 'bg-purple-600/50 text-purple-200'
                                                        : 'bg-white/10 text-zinc-300 group-hover:bg-white/20'
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Count hint */}
                <p className="text-xs text-zinc-600 font-medium">
                    {VideoStyles.length} styles available — scroll to explore →
                </p>
            </div>
        </div>
    );
}
