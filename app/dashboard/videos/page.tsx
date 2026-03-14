'use client';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
    Video, 
    Loader2, 
    PlayCircle, 
    Clock, 
    CheckCircle2, 
    Calendar,
    LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoRecord {
    id: string;
    title: string | null;
    status: 'generating' | 'completed' | 'failed';
    image_urls: string[] | null;
    created_at: string;
    series: { series_name: string } | null;
}

const POLL_INTERVAL_MS = 3000;

function VideosContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const generatingSeriesId = searchParams.get('generating');

    const [videos, setVideos] = useState<VideoRecord[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Fetch all videos ──────────────────────────────────────────────────────
    const fetchVideos = useCallback(async () => {
        try {
            const res = await fetch('/api/videos');
            if (!res.ok) throw new Error('Failed to fetch videos');
            const data: VideoRecord[] = await res.json();
            setVideos(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load videos.');
        } finally {
            setIsLoadingVideos(false);
        }
    }, []);

    // ── Poll for generation status ────────────────────────────────────────────
    const pollStatus = useCallback(async (seriesId: string) => {
        try {
            const res = await fetch(`/api/videos/status?seriesId=${seriesId}`);
            if (!res.ok) return;

            const data = await res.json();

            if (data.status === 'completed') {
                if (pollingRef.current) clearInterval(pollingRef.current);
                await fetchVideos(); // Refresh the list
                toast.success('🎉 Your video is ready!');
                
                // Clear the ?generating param from URL
                const url = new URL(window.location.href);
                url.searchParams.delete('generating');
                router.replace(url.pathname, { scroll: false });
            } else if (data.status === 'failed') {
                if (pollingRef.current) clearInterval(pollingRef.current);
                toast.error('Video generation failed.');
                const url = new URL(window.location.href);
                url.searchParams.delete('generating');
                router.replace(url.pathname, { scroll: false });
                await fetchVideos();
            } else if (data.status === 'generating') {
                // Keep polling, occasionally refresh list to see if placeholder appeared
                fetchVideos();
            }
        } catch (err) {
            console.error('Polling error:', err);
        }
    }, [fetchVideos, router]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    useEffect(() => {
        if (!generatingSeriesId) return;

        // Ensure we refresh frequently while generating
        pollStatus(generatingSeriesId);
        pollingRef.current = setInterval(() => {
            pollStatus(generatingSeriesId);
        }, POLL_INTERVAL_MS);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [generatingSeriesId, pollStatus]);

    // ── Pre-process list to ensure generating card is at top ──
    const displayVideos = [...videos];
    
    // Check if we need to inject a placeholder for an active generation that isn't in DB yet
    const hasActiveGenerationInList = videos.some(v => v.status === 'generating');
    const showPlaceholder = generatingSeriesId && !hasActiveGenerationInList;

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">Generated Videos</h1>
                <p className="text-zinc-500 text-lg">Manage and view all your generated content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-12">
                
                {/* ── Active Generation Placeholder (before DB reflects it) ── */}
                {showPlaceholder && (
                    <div className="bg-zinc-900/40 rounded-[40px] border border-zinc-800/50 shadow-2xl overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden">
                            {/* Processing Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-blue-600/90 backdrop-blur-md text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">
                                    Processing
                                </span>
                            </div>

                            {/* Center Spinner UI matching the image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
                                        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white/80 animate-spin" />
                                    </div>
                                    <div className="bg-black/60 backdrop-blur-xl px-7 py-3 rounded-full text-white text-md font-black shadow-2xl border border-white/10 flex items-center gap-2">
                                        Generating...
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1 justify-between gap-8">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-blue-400 leading-tight">
                                    Untitled Video
                                </h3>
                                <div className="flex items-center gap-3 text-zinc-500 font-bold">
                                    <LayoutGrid className="w-5 h-5 text-blue-500" />
                                    <span className="animate-pulse">Starting pipeline...</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-zinc-500 font-bold text-sm pt-6 border-t border-zinc-800/50">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(), 'MMM dd, yyyy')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {format(new Date(), 'hh:mm a')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Video List ── */}
                {displayVideos.map((video) => {
                    const isProcessing = video.status === 'generating';
                    const isReady = video.status === 'completed';
                    const isFailed = video.status === 'failed';
                    
                    return (
                        <div 
                            key={video.id} 
                            className={`group bg-zinc-900/40 rounded-[40px] border border-zinc-800/50 shadow-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:border-zinc-700/50 ${isProcessing && 'ring-2 ring-blue-500/20 ring-offset-4 ring-offset-[#070708]'}`}
                        >
                            {/* Thumbnail Area */}
                            <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden">
                                {isReady && video.image_urls?.[0] ? (
                                    <Image
                                        src={video.image_urls[0]}
                                        alt={video.title || "Video"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Video className={`w-14 h-14 ${isProcessing ? 'text-blue-500/20 animate-pulse' : 'text-zinc-800'}`} />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-6 left-6 z-10">
                                    {isProcessing && (
                                        <span className="bg-blue-600/90 backdrop-blur-md text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">
                                            Processing
                                        </span>
                                    )}
                                    {isReady && (
                                        <span className="bg-emerald-600/90 backdrop-blur-md text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20">
                                            Ready
                                        </span>
                                    )}
                                    {isFailed && (
                                        <span className="bg-red-600/90 backdrop-blur-md text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20">
                                            Failed
                                        </span>
                                    )}
                                </div>

                                {/* Processing Overlay */}
                                {isProcessing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
                                                <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white/80 animate-spin" />
                                            </div>
                                            <div className="bg-black/80 backdrop-blur-xl px-7 py-3 rounded-full text-white text-md font-black shadow-2xl border border-white/10 flex items-center gap-2">
                                                Generating...
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Play Button for Ready Videos */}
                                {isReady && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                                        <button className="bg-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-black">
                                            <PlayCircle className="w-10 h-10" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="p-8 flex flex-col flex-1 justify-between gap-8">
                                <div className="space-y-4">
                                    <h3 className={`text-2xl font-black leading-tight line-clamp-2 transition-colors ${isProcessing ? 'text-blue-400' : 'text-white group-hover:text-purple-400'}`}>
                                        {video.title || "Untitled Video"}
                                    </h3>
                                    
                                    <div className="flex items-center gap-3 text-zinc-400 font-bold group-hover:text-zinc-200 transition-colors">
                                        <LayoutGrid className={`w-5 h-5 ${isProcessing ? 'text-blue-500' : 'text-purple-500'}`} />
                                        <span>{video.series?.series_name || "Untitled Series"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-zinc-500 font-bold text-sm pt-6 border-t border-zinc-800/50">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(video.created_at), 'MMM dd, yyyy')}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {format(new Date(video.created_at), 'hh:mm a')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* ── Initial Loading Mask ── */}
                {isLoadingVideos && !generatingSeriesId && (
                    <>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900/20 rounded-[40px] border border-zinc-800/40 h-[450px] animate-pulse" />
                        ))}
                    </>
                )}

                {/* ── Empty State ── */}
                {videos.length === 0 && !generatingSeriesId && !isLoadingVideos && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl">
                            <Video className="w-12 h-12 text-zinc-700" />
                        </div>
                        <h2 className="text-3xl font-black mb-4">No videos found</h2>
                        <p className="text-zinc-500 max-w-sm font-medium mb-12">Head back to your series dashboard to generate your first AI video.</p>
                        <a href="/dashboard" className="bg-white text-black px-12 py-4 rounded-full font-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                            Go to Series
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VideosPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto p-12 flex justify-center">
                <Loader2 className="w-10 h-10 text-zinc-800 animate-spin" />
            </div>
        }>
            <VideosContent />
        </Suspense>
    );
}
