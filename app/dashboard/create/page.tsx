'use client';

import React, { useState } from 'react';
import {
    ChevronRight,
    Ghost,
    Flame,
    Lightbulb,
    HeartPulse,
    Cpu,
    BrainCircuit,
    Plus,
    Check,
    Play,
    Volume2
} from 'lucide-react';
import { Languages, DeepgramVoices, FonadalabVoices } from '@/lib/constants';
import LanguageVoiceSelection from '@/components/dashboard/language-voice-selection';
import AcousticsSelection from '@/components/dashboard/acoustics-selection';
import VisualsSelection from '@/components/dashboard/visuals-selection';
import TypographySelection from '@/components/dashboard/typography-selection';
import ScheduleSelection from '@/components/dashboard/schedule-selection';

const steps = [
    { name: 'Niche', description: 'Topic selection' },
    { name: 'Identity', description: 'Language & Voice' },
    { name: 'Acoustics', description: 'Background Music' },
    { name: 'Visuals', description: 'Video Style' },
    { name: 'Typography', description: 'Caption Style' },
    { name: 'Schedule', description: 'Details & Time' },
];

const availableNiches = [
    {
        id: 'scary',
        name: 'Scary Stories',
        description: 'Chilling tales and urban legends for horror fans.',
        icon: Ghost,
        color: 'text-purple-500'
    },
    {
        id: 'motivational',
        name: 'Motivational',
        description: 'Powerful quotes and stories to inspire your audience.',
        icon: Flame,
        color: 'text-orange-500'
    },
    {
        id: 'facts',
        name: 'Mind-Blowing Facts',
        description: 'Interesting trivia and educational tidbits.',
        icon: Lightbulb,
        color: 'text-yellow-500'
    },
    {
        id: 'health',
        name: 'Health & Fitness',
        description: 'Tips for a better lifestyle and wellness.',
        icon: HeartPulse,
        color: 'text-red-500'
    },
    {
        id: 'tech',
        name: 'Tech News',
        description: 'Latest updates from the world of technology.',
        icon: Cpu,
        color: 'text-cyan-500'
    },
    {
        id: 'ai',
        name: 'AI Insights',
        description: 'Deep dives into artificial intelligence and automation.',
        icon: BrainCircuit,
        color: 'text-blue-500'
    },
];

interface FormData {
    niche: {
        type: 'available' | 'custom';
        selected: string | null;
        customDescription: string;
    };
    identity: {
        language: typeof Languages[0];
        voice: typeof DeepgramVoices[0] | typeof FonadalabVoices[0] | null;
    };
    acoustics: {
        selectedMusicIds: string[];
        volume: number;
    };
    visuals: {
        styleId: string | null;
        styleName: string;
    };
    typography: {
        styleId: string | null;
        styleName: string;
    };
    schedule: {
        name: string;
        duration: string;
        platforms: string[];
        publishTime: string;
    };
}

const initialFormData: FormData = {
    niche: {
        type: 'available',
        selected: null,
        customDescription: '',
    },
    identity: {
        language: Languages[0],
        voice: null,
    },
    acoustics: {
        selectedMusicIds: [],
        volume: 30,
    },
    visuals: {
        styleId: null,
        styleName: '',
    },
    typography: {
        styleId: null,
        styleName: '',
    },
    schedule: {
        name: '',
        duration: '30-50',
        platforms: [],
        publishTime: '12:00',
    },
};

export default function CreateSeriesPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final submission
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("Final Form Data:", formData);
            // Redirect or show success
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Failed to create series:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateFormData = (step: string, data: any) => {
        setFormData(prev => ({
            ...prev,
            [step]: { ...prev[step as keyof FormData], ...data }
        }));
    };

    const FormFooter = ({ canContinue = true }: { canContinue?: boolean }) => (
        <div className="pt-8 flex justify-between items-center relative z-10 mt-auto">
            <div>
                {currentStep > 0 && (
                    <button
                        onClick={handleBack}
                        className="px-8 py-4 rounded-full border border-zinc-800 text-white font-bold hover:bg-zinc-900 transition-all active:scale-95"
                    >
                        Back
                    </button>
                )}
            </div>
            <button
                onClick={handleNext}
                disabled={!canContinue || isSubmitting}
                className="group relative flex items-center gap-3 px-12 py-5 rounded-full bg-white text-black font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
                {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-zinc-300 border-t-black rounded-full animate-spin" />
                ) : currentStep === steps.length - 1 ? (
                    'Schedule'
                ) : (
                    <>
                        Continue
                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Progress Bar Stepper */}
            <div className="mb-12 space-y-4">
                <div className="flex gap-2">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${index <= currentStep
                                ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                                : 'bg-zinc-800'
                                }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center px-1">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-1">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <h3 className="text-xl font-bold text-white">
                            {steps[currentStep].name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="glass-dark rounded-[32px] border border-zinc-800/50 p-8 md:p-12 shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

                <div className="flex-1 flex flex-col">
                    {currentStep === 0 && (
                        <div className="space-y-10 relative z-10 flex flex-col h-full">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black tracking-tight">Select your Niche</h2>
                                <p className="text-zinc-400 text-lg">Choose a proven niche or define your own custom topic.</p>
                            </div>

                            {/* Tabs */}
                            <div className="flex p-1.5 bg-zinc-900/80 backdrop-blur-xl rounded-2xl w-fit border border-zinc-800/50 shadow-inner">
                                <button
                                    onClick={() => updateFormData('niche', { type: 'available' })}
                                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${formData.niche.type === 'available'
                                        ? 'bg-zinc-800 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] ring-1 ring-zinc-700'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    Available Niche
                                </button>
                                <button
                                    onClick={() => updateFormData('niche', { type: 'custom' })}
                                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${formData.niche.type === 'custom'
                                        ? 'bg-zinc-800 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] ring-1 ring-zinc-700'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    Custom Niche
                                </button>
                            </div>

                            {formData.niche.type === 'available' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[480px] overflow-y-auto pr-4 custom-scrollbar group/list">
                                    {availableNiches.map((niche) => (
                                        <button
                                            key={niche.id}
                                            onClick={() => updateFormData('niche', { selected: niche.id })}
                                            className={`p-6 rounded-[24px] border transition-all duration-300 text-left flex items-start gap-4 group relative overflow-hidden ${formData.niche.selected === niche.id
                                                ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                                                : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/50'
                                                }`}
                                        >
                                            <div className={`p-4 rounded-2xl bg-zinc-950 ring-1 ring-zinc-800/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${niche.color} shadow-lg`}>
                                                <niche.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-xl mb-1 text-white group-hover:text-purple-400 transition-colors">{niche.name}</h4>
                                                <p className="text-sm text-zinc-500 leading-relaxed font-medium line-clamp-2">{niche.description}</p>
                                            </div>
                                            {formData.niche.selected === niche.id && (
                                                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent transition-opacity duration-500 ${formData.niche.selected === niche.id ? 'opacity-100' : 'opacity-0'}`} />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">Describe your custom niche</label>
                                        <textarea
                                            value={formData.niche.customDescription}
                                            onChange={(e) => updateFormData('niche', { customDescription: e.target.value })}
                                            placeholder="e.g. Daily Stoic Quotes, Space Explorations..."
                                            className="w-full h-40 bg-zinc-900/50 border border-zinc-800/50 rounded-[24px] p-6 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 transition-all text-lg leading-relaxed shadow-inner"
                                        />
                                    </div>
                                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                            <Lightbulb className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm text-zinc-500 leading-relaxed">
                                            Try to be specific! The more detail you provide about your custom niche, the better our AI can tailor your content.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <FormFooter
                                canContinue={
                                    formData.niche.type === 'available'
                                        ? !!formData.niche.selected
                                        : formData.niche.customDescription.length > 3
                                }
                            />
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="flex-1 flex flex-col">
                            <LanguageVoiceSelection
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                            <FormFooter canContinue={!!formData.identity.voice} />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="flex-1 flex flex-col">
                            <AcousticsSelection
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                            <FormFooter canContinue={formData.acoustics.selectedMusicIds.length > 0} />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex-1 flex flex-col">
                            <VisualsSelection
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                            <FormFooter canContinue={!!formData.visuals.styleId} />
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="flex-1 flex flex-col">
                            <TypographySelection
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                            <FormFooter canContinue={!!formData.typography.styleId} />
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="flex-1 flex flex-col">
                            <ScheduleSelection
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                            <FormFooter canContinue={formData.schedule.name.length > 2 && formData.schedule.platforms.length > 0} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
