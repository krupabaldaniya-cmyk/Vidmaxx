'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Check, Volume2, Plus, X } from 'lucide-react';
import { BackgroundMusic } from '@/lib/constants';

interface AcousticsSelectionProps {
    formData: any;
    updateFormData: (step: string, data: any) => void;
}

export default function AcousticsSelection({ formData, updateFormData }: AcousticsSelectionProps) {
    const [playingMusic, setPlayingMusic] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Default values if not present
    const selectedMusicIds = formData.acoustics?.selectedMusicIds || [];
    const volume = formData.acoustics?.volume ?? 30;

    const togglePreview = (music: typeof BackgroundMusic[0]) => {
        if (!music.preview) return;

        if (playingMusic === music.id) {
            audioRef.current?.pause();
            setPlayingMusic(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = music.preview;
                audioRef.current.play().catch(err => {
                    console.error("Audio playback failed:", err);
                });
                setPlayingMusic(music.id);
            }
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setPlayingMusic(null);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
        }
    }, []);

    const handleMusicToggle = (music: typeof BackgroundMusic[0]) => {
        let newSelection = [...selectedMusicIds];
        if (newSelection.includes(music.id)) {
            newSelection = newSelection.filter(id => id !== music.id);
        } else {
            newSelection.push(music.id);
        }

        updateFormData('acoustics', {
            ...formData.acoustics,
            selectedMusicIds: newSelection
        });
    };

    const handleVolumeChange = (newVolume: number) => {
        updateFormData('acoustics', {
            ...formData.acoustics,
            volume: newVolume
        });
    };

    return (
        <div className="space-y-10 relative z-10 flex flex-col h-full">
            <audio ref={audioRef} className="hidden" />

            <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                    Acoustics
                </h2>
                <p className="text-zinc-400 text-lg">Pick one or more tracks to set the perfect mood for your series.</p>
            </div>

            <div className="space-y-8 flex-1 flex flex-col min-h-0">
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                            Available Tracks ({selectedMusicIds.length} Selected)
                        </label>
                        {selectedMusicIds.length > 0 && (
                            <button
                                onClick={() => updateFormData('acoustics', { ...formData.acoustics, selectedMusicIds: [] })}
                                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Clear All
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {BackgroundMusic.map((music) => {
                            const isSelected = selectedMusicIds.includes(music.id);
                            return (
                                <div
                                    key={music.id}
                                    onClick={() => handleMusicToggle(music)}
                                    className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${isSelected
                                            ? 'bg-purple-600/10 border-purple-500/50 shadow-lg shadow-purple-500/5'
                                            : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/60'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-950 ring-1 ring-white/5 flex items-center justify-center transition-all ${isSelected ? 'text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'text-zinc-500 group-hover:text-zinc-300'
                                            }`}>
                                            <Music className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 pr-4">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white truncate text-lg">
                                                    {music.name}
                                                </h4>
                                                <div className="flex gap-1">
                                                    {music.tags.slice(0, 2).map(tag => (
                                                        <span key={tag} className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-500 border border-white/5">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-500 truncate mt-0.5">
                                                {music.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePreview(music);
                                            }}
                                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xl ${playingMusic === music.id
                                                    ? 'bg-purple-600 text-white animate-pulse'
                                                    : 'bg-zinc-800 text-zinc-400 hover:bg-white hover:text-black hover:scale-105 active:scale-95'
                                                }`}
                                        >
                                            {playingMusic === music.id ? (
                                                <Pause className="w-5 h-5 fill-current" />
                                            ) : (
                                                <Play className="w-5 h-5 fill-current ml-0.5" />
                                            )}
                                        </button>

                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${isSelected
                                                ? 'bg-purple-600 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                                : 'border-zinc-800 group-hover:border-zinc-600'
                                            }`}>
                                            {isSelected ? (
                                                <Check className="w-6 h-6 text-white" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Volume2 className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white uppercase tracking-widest leading-none">Music Volume</label>
                                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">Recommended: 20-30%</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                            <span className="text-purple-400 font-mono font-bold text-lg">{volume}%</span>
                        </div>
                    </div>

                    <div className="relative group px-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                            className="relative w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all border border-white/5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
