'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    MoreVertical,
    Edit,
    Pause,
    Play,
    Trash2,
    Video,
    Zap,
    MoreHorizontal,
    Pencil
} from 'lucide-react';
import { VideoStyles } from '@/lib/constants';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Series {
    id: string;
    series_name: string;
    visual_style_id: string;
    status: string;
    created_at: string;
    target_platforms: string[];
}

export default function SeriesList() {
    const router = useRouter();
    const [series, setSeries] = useState<Series[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePopover, setActivePopover] = useState<string | null>(null);

    const fetchSeries = async () => {
        try {
            const response = await fetch('/api/series');
            if (response.ok) {
                const data = await response.json();
                setSeries(data);
            }
        } catch (error) {
            console.error('Failed to fetch series:', error);
            toast.error('Failed to load series');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    const handleDelete = async (id: string) => {
        // Placeholder for delete logic
        toast.info('Delete functionality coming soon');
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'paused' ? 'scheduled' : 'paused';
        const previousSeries = [...series];

        // Optimistic Update
        setSeries(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        setActivePopover(null);

        try {
            const response = await fetch('/api/series', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Series ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully!`);
        } catch (error) {
            console.error('Status toggle error:', error);
            setSeries(previousSeries); // Revert on failure
            toast.error('Failed to update series status. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-4">
                        <div className="aspect-[9/16] bg-zinc-900 rounded-[32px]" />
                        <div className="h-6 bg-zinc-900 rounded w-2/3" />
                        <div className="h-4 bg-zinc-900 rounded w-1/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (series.length === 0) {
        return (
            <div className="mt-12 p-16 rounded-[40px] border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center bg-zinc-900/20">
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                    <Video className="w-10 h-10 text-zinc-700" />
                </div>
                <h2 className="text-2xl font-black mb-3">No series scheduled</h2>
                <p className="text-zinc-500 mb-10 max-w-sm font-medium">Create your first automated video series to start growing your channel.</p>
                <a href="/dashboard/create" className="px-10 py-4 rounded-full bg-white text-black font-black hover:bg-zinc-200 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                    Create New Series
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {series.map((item) => {
                const style = VideoStyles.find(s => s.id === item.visual_style_id);
                const isPaused = item.status === 'paused';

                return (
                    <div key={item.id} className={`group relative border rounded-[40px] p-5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${isPaused
                        ? 'bg-zinc-900/20 border-zinc-800/40 opacity-75 grayscale-[0.3]'
                        : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700/50'
                        }`}>
                        {/* Thumbnail */}
                        <div className="relative aspect-[9/16] rounded-[32px] overflow-hidden mb-6 shadow-2xl">
                            <Image
                                src={style?.preview || '/placeholder-video.jpg'}
                                alt={item.series_name}
                                fill
                                className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isPaused ? 'opacity-40' : ''}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                            {isPaused && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                        <Pause className="w-8 h-8 text-yellow-500" fill="currentColor" />
                                    </div>
                                </div>
                            )}

                            {/* Edit Icon on Top Right */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/dashboard/edit/${item.id}`);
                                }}
                                className="absolute top-4 right-4 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black shadow-xl"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>

                            {/* Status Badge */}
                            <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isPaused
                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-white animate-pulse'}`} />
                                {item.status}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-2 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className={`text-xl font-black transition-colors uppercase tracking-tight ${isPaused ? 'text-zinc-500' : 'text-white group-hover:text-purple-400'
                                        }`}>
                                        {item.series_name}
                                    </h3>
                                    <p className="text-sm text-zinc-500 font-bold">
                                        Created {format(new Date(item.created_at), 'MMM dd, yyyy')}
                                    </p>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setActivePopover(activePopover === item.id ? null : item.id)}
                                        className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-500 transition-colors"
                                    >
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>

                                    {activePopover === item.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setActivePopover(null)}
                                            />
                                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 animate-in zoom-in-95 duration-200 origin-bottom-right">
                                                <button
                                                    onClick={() => router.push(`/dashboard/edit/${item.id}`)}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800 text-sm font-bold transition-all text-white"
                                                >
                                                    <Edit className="w-4 h-4" /> Edit Series
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(item.id, item.status)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800 text-sm font-bold transition-all ${isPaused ? 'text-yellow-500' : 'text-white'
                                                        }`}
                                                >
                                                    {isPaused ? <Play className="w-4 h-4" fill="currentColor" /> : <Pause className="w-4 h-4" fill="currentColor" />}
                                                    {isPaused ? 'Resume Series' : 'Pause Series'}
                                                </button>
                                                <div className="h-px bg-zinc-800 my-1" />
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-bold transition-all text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50" disabled={isPaused}>
                                    <Video className="w-4 h-4" /> View Videos
                                </button>
                                <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-lg ${isPaused
                                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20'
                                    }`} disabled={isPaused}>
                                    <Zap className="w-4 h-4 fill-current" /> Generate
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
