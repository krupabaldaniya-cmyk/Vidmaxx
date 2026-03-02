'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Languages, DeepgramVoices, FonadalabVoices } from '@/lib/constants';

interface LanguageVoiceSelectionProps {
    formData: any;
    updateFormData: (step: string, data: any) => void;
}

export default function LanguageVoiceSelection({ formData, updateFormData }: LanguageVoiceSelectionProps) {
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef = useRef<string | null>(null);

    const handleLanguageChange = (lang: typeof Languages[0]) => {
        updateFormData('identity', { language: lang, voice: null });
    };

    const getVoicesForModel = (modelName: string) => {
        const voices = modelName === 'deepgram' ? DeepgramVoices : FonadalabVoices;
        return voices.filter(v => v.language === formData.identity.language.language);
    };

    const togglePreview = async (voice: any) => {
        if (playingVoice === voice.modelName) {
            audioRef.current?.pause();
            setPlayingVoice(null);
            return;
        }

        if (previewLoading) return;

        try {
            setPreviewLoading(voice.modelName);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const response = await fetch('/api/voice/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: voice.model,
                    voice: voice.modelName,
                    text: `Hello, this is ${voice.modelName}. I am an AI voice from ${voice.model}.`,
                    language: formData.identity.language.language
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle specific FondaLabs voice error
                if (errorData.detail?.error === 'unsupported_voice') {
                    const availableVoices = errorData.detail.available_voices || [];
                    const availableVoicesStr = availableVoices.length > 0 ? availableVoices.join(', ') : 'none';
                    throw new Error(`Voice '${voice.modelName}' is not supported. Available voices: ${availableVoicesStr}`);
                }

                // Handle other API errors
                const errorMsg = errorData.detail?.message || errorData.details || errorData.error || 'Failed to fetch preview';
                const details = errorData.detail?.error ? ` (${errorData.detail.error})` : '';
                throw new Error(`${errorMsg}${details}`);
            }

            const blob = await response.blob();
            
            // Clean up previous URL
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
            }
            
            // Create new URL and set up audio
            const url = URL.createObjectURL(blob);
            audioUrlRef.current = url;

            // Create new audio element to avoid conflicts
            const audio = new Audio();
            audio.src = url;
            audio.preload = 'auto';
            
            // Set up event listeners
            audio.addEventListener('ended', () => {
                setPlayingVoice(null);
                URL.revokeObjectURL(url);
                audioUrlRef.current = null;
            });
            
            audio.addEventListener('error', (e) => {
                console.error('Audio playback error:', {
                    event: e,
                    audioElement: audio,
                    src: audio.src,
                    blobUrl: url,
                    error: (e.target as HTMLAudioElement)?.error
                });
                setPlayingVoice(null);
                URL.revokeObjectURL(url);
                audioUrlRef.current = null;
                toast.error('Audio playback failed. Please try again.');
            });

            try {
                await audio.play();
                setPlayingVoice(voice.modelName);
                audioRef.current = audio;
            } catch (playError) {
                console.error('Audio play error:', playError);
                URL.revokeObjectURL(url);
                audioUrlRef.current = null;
                toast.error('Audio playback failed. Please try again.');
            }
        } catch (err: any) {
            console.error("Audio preview failed:", err);

            // Production-ready error messages
            let errorMessage = 'Voice preview failed';

            if (err.name === 'AbortError') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (err.message.includes('unsupported_voice')) {
                errorMessage = err.message;
            } else if (err.message.includes('network') || err.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            } else if (err.message) {
                errorMessage = `Voice preview failed: ${err.message}`;
            }

            toast.error(errorMessage);
        } finally {
            setPreviewLoading(null);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setPlayingVoice(null);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
        }
    }, []);

    return (
        <div className="space-y-10 relative z-10 flex flex-col h-full">
            <audio ref={audioRef} className="hidden" />
            <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight">Language & Voice</h2>
                <p className="text-zinc-400 text-lg">Choose the perfect identity for your video series.</p>
            </div>

            <div className="space-y-8">
                {/* Language Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">Select Language</label>
                    <div className="flex flex-wrap gap-3">
                        {Languages.map((lang) => (
                            <button
                                key={lang.language}
                                onClick={() => handleLanguageChange(lang)}
                                className={`px-6 py-3 rounded-2xl border font-bold transition-all flex items-center gap-3 ${formData.identity.language.language === lang.language
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                    }`}
                            >
                                <span className="text-xl">{lang.countryFlag}</span>
                                {lang.language}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Voice Selection */}
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">
                        Available Voices for {formData.identity.language.language}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                        {getVoicesForModel(formData.identity.language.modelName).map((voice: any) => (
                            <div
                                key={voice.modelName}
                                onClick={() => updateFormData('identity', { voice })}
                                className={`group relative p-6 rounded-[24px] border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${formData.identity.voice?.modelName === voice.modelName
                                    ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                                    : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/60'
                                    }`}
                            >
                                <div className="flex flex-col gap-2">
                                    <h4 className="font-bold text-white text-lg tracking-tight">
                                        {voice.name}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500">
                                            {voice.gender}
                                        </span>
                                        <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                                            {voice.model}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePreview(voice);
                                        }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${playingVoice === voice.modelName
                                            ? 'bg-purple-600 text-white animate-pulse'
                                            : previewLoading === voice.modelName
                                                ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                                                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700 hover:text-white hover:scale-105 active:scale-95'
                                            }`}
                                        disabled={!!previewLoading && previewLoading !== voice.modelName}
                                        title="Preview Voice"
                                    >
                                        {previewLoading === voice.modelName ? (
                                            <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                        ) : playingVoice === voice.modelName ? (
                                            <Pause className="w-4 h-4 fill-current" />
                                        ) : (
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        )}
                                    </button>

                                    {formData.identity.voice?.modelName === voice.modelName && (
                                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
