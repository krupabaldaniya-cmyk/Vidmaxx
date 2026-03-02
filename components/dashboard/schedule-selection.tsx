'use client';

import React from 'react';
import {
    Clock,
    Edit3,
    Youtube,
    Instagram,
    Mail,
    Timer,
    MonitorCheck,
    AlertCircle
} from 'lucide-react';

interface ScheduleSelectionProps {
    formData: any;
    updateFormData: (step: string, data: any) => void;
}

const platforms = [
    {
        id: 'tiktok', name: 'TikTok', icon: (props: any) => (
            <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
        )
    },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'email', name: 'Email', icon: Mail },
];

const durations = [
    { id: '30-50', name: '30-50 Sec Video', description: 'Fast-paced, high engagement' },
    { id: '60-70', name: '60-70 Sec Video', description: 'More depth, storytelling' },
];

export default function ScheduleSelection({ formData, updateFormData }: ScheduleSelectionProps) {
    const togglePlatform = (platformId: string) => {
        const currentPlatforms = formData.schedule?.platforms || [];
        const newPlatforms = currentPlatforms.includes(platformId)
            ? currentPlatforms.filter((id: string) => id !== platformId)
            : [...currentPlatforms, platformId];
        updateFormData('schedule', { platforms: newPlatforms });
    };

    return (
        <div className="space-y-10 relative z-10 flex flex-col h-full">
            <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight">Final Details</h2>
                <p className="text-zinc-400 text-lg">Set up your series identity and automation schedule.</p>
            </div>

            <div className="space-y-10 flex-1 flex flex-col min-h-0">
                {/* Series Name */}
                <div className="space-y-4">
                    <label className="block text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Series Name
                    </label>
                    <input
                        type="text"
                        value={formData.schedule?.name || ''}
                        onChange={(e) => updateFormData('schedule', { name: e.target.value })}
                        placeholder="e.g. Daily Tech Insights"
                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-[28px] px-8 py-5 text-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all shadow-inner font-black"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Duration Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            Video Duration
                        </label>
                        <div className="relative group">
                            <select
                                value={formData.schedule?.duration || '30-50'}
                                onChange={(e) => updateFormData('schedule', { duration: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-[24px] px-8 py-5 text-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-bold cursor-pointer"
                            >
                                {durations.map(d => (
                                    <option key={d.id} value={d.id} className="bg-zinc-900">{d.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Publish Time */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Publish Time
                        </label>
                        <div className="relative group">
                            <input
                                type="time"
                                value={formData.schedule?.publishTime || '12:00'}
                                onChange={(e) => updateFormData('schedule', { publishTime: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-[24px] px-8 py-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-bold cursor-pointer [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-5">
                    <label className="block text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <MonitorCheck className="w-4 h-4" />
                        Publish On
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {platforms.map((platform) => {
                            const isSelected = formData.schedule?.platforms?.includes(platform.id);
                            return (
                                <div
                                    key={platform.id}
                                    onClick={() => togglePlatform(platform.id)}
                                    className={`p-6 rounded-[28px] border transition-all duration-500 cursor-pointer flex flex-col items-center gap-4 group/platform ${isSelected
                                        ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_25px_rgba(147,51,234,0.15)] ring-1 ring-purple-500/50'
                                        : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/60'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl transition-all duration-500 group-hover/platform:scale-110 ${isSelected ? 'bg-purple-600 text-white shadow-lg' : 'bg-zinc-950 text-zinc-500 border border-zinc-800'}`}>
                                        <platform.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-purple-300' : 'text-zinc-500'}`}>
                                        {platform.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Important Note */}
                <div className="mt-auto group">
                    <div className="p-6 rounded-[32px] bg-zinc-900/50 border border-zinc-800/80 flex items-start gap-4 transition-all duration-500 hover:bg-purple-600/5 hover:border-purple-500/20 group-hover:px-8">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 shadow-inner">
                            <AlertCircle className="w-5 h-5 font-black" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-zinc-400 group-hover:text-purple-300 transition-colors">Important Scheduling Note</p>
                            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                                Video will generate <span className="text-purple-400 font-black">3-6 hours</span> before video publish to ensure perfect delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
