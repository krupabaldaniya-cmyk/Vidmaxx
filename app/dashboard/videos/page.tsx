'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Video, Loader2, PlayCircle, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface VideoData {
    id: string;
    series_id: string;
    title: string | null;
    status: string;
    video_url: string | null;
    image_urls: string[] | null;
    created_at: string;
    series_name?: string;
}

export default function VideosPage({ searchParams }: { searchParams: { generating?: string } }) {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null);

    const fetchVideos = useCallback(async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        try {
            const response = await fetch('/api/videos');
            if (response.ok) {
                const data = await response.json();
                setVideos(data);
                
                // Check if any video is still generating
                const hasGenerating = data.some((v: VideoData) => v.status === 'generating');
                setIsPolling(hasGenerating);
            } else {
                toast.error('Failed to fetch videos');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('An error occurred while loading videos');
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    const handlePlay = (video: VideoData) => {
        if (video.video_url) {
            setPlayingVideo({ url: video.video_url, title: video.title || 'Untitled Video' });
        } else {
            toast.info('This video is still processing or has no URL.');
        }
    };

    useEffect(() => {
        fetchVideos(true);
    }, [fetchVideos]);

    // Polling logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPolling) {
            interval = setInterval(() => {
                fetchVideos(false);
            }, 5000); // Poll every 5 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPolling, fetchVideos]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-white tracking-tight">Your Videos</h1>
                    <p className="text-zinc-400 text-lg">Manage and download your generated video assets.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse border rounded-[32px] p-5 bg-zinc-900/40 border-zinc-800/50 h-[400px]">
                            <div className="w-full flex-1 rounded-[24px] bg-zinc-800 mb-4" />
                            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-zinc-800 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">Your Videos</h1>
                <p className="text-zinc-400 text-lg">Manage and download your generated video assets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {videos.map((video) => {
                    const isGenerating = video.status === 'generating';
                    const isFailed = video.status === 'failed';

                    return (
                        <div key={video.id} className={`group relative border rounded-[32px] p-5 transition-all duration-300 flex flex-col h-[400px] ${
                            isGenerating 
                                ? 'bg-zinc-900/40 border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.15)] animate-pulse' 
                                : isFailed
                                ? 'bg-zinc-900/40 border-red-500/30'
                                : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60 hover:shadow-2xl hover:-translate-y-1'
                        }`}>
                            {/* Thumbnail / Status Area */}
                            <div className="relative w-full flex-1 rounded-[24px] overflow-hidden mb-4 bg-zinc-900 shadow-xl border border-zinc-800 flex flex-col items-center justify-center">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                                        <p className="text-purple-400 font-bold uppercase tracking-widest text-xs">Generating AI Video...</p>
                                        <p className="text-zinc-500 text-[10px] mt-2 text-center px-4">This usually takes about a minute. Grab a coffee! ☕</p>
                                    </>
                                ) : isFailed ? (
                                    <>
                                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                        <p className="text-red-400 font-bold uppercase tracking-widest text-xs">Generation Failed</p>
                                        <p className="text-zinc-500 text-[10px] mt-2 text-center px-4">Something went wrong during generation. Please try again.</p>
                                    </>
                                ) : video.image_urls && video.image_urls.length > 0 ? (
                                    <>
                                        <Image
                                            src={video.image_urls[0]}
                                            alt={video.title || "Video thumbnail"}
                                            fill
                                            loading="lazy"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                                        
                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button 
                                                onClick={() => handlePlay(video)}
                                                className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all transform hover:scale-110 flex items-center justify-center min-w-[100px]"
                                            >
                                                {video.video_url ? (
                                                    <PlayCircle className="w-10 h-10" />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <Loader2 className="w-6 h-6 animate-spin mb-1" />
                                                        <span className="text-[10px] font-bold uppercase">Processing...</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Video className="w-12 h-12 text-zinc-700" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                {!isGenerating && (
                                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md border ${
                                        isFailed 
                                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    }`}>
                                        {isFailed ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                        {video.status}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="px-2 flex flex-col justify-end">
                                <h3 className={`text-lg font-black leading-tight line-clamp-2 mb-2 transition-colors ${
                                    isGenerating ? 'text-zinc-500' : 'text-white group-hover:text-purple-400'
                                }`}>
                                    {video.title || (isGenerating ? "Generation in progress..." : "Untitled Video")}
                                </h3>
                                <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {format(new Date(video.created_at), 'MMM dd, yyyy')}
                                    </span>
                                    <span className="truncate max-w-[100px] text-zinc-600">
                                        {video.series_name || "Unknown Series"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {videos.length === 0 && (
                    <div className="col-span-full mt-12 p-16 rounded-[40px] border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center bg-zinc-900/20">
                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                            <Video className="w-10 h-10 text-zinc-700" />
                        </div>
                        <h2 className="text-2xl font-black mb-3 text-white">No videos generated yet</h2>
                        <p className="text-zinc-500 mb-8 max-w-sm font-medium">Head over to your series to generate your first AI video.</p>
                        <a href="/dashboard" className="px-8 py-3 rounded-full bg-white text-black font-black hover:bg-zinc-200 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                            Go to Series
                        </a>
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setPlayingVideo(null)}
                >
                    <div
                        className="relative w-full max-w-sm mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setPlayingVideo(null)}
                            className="absolute -top-10 right-0 text-white text-sm flex items-center gap-1 hover:text-gray-300 transition-colors"
                        >
                            <X size={16} /> Close
                        </button>

                        {/* Video title */}
                        <p className="text-white text-sm font-bold mb-3 truncate px-2">{playingVideo.title}</p>

                        {/* The video player — 9:16 vertical format for Shorts-style video */}
                        <video
                            src={playingVideo.url}
                            controls
                            autoPlay
                            className="w-full rounded-[32px] border-4 border-white/10 shadow-2xl overflow-hidden"
                            style={{ aspectRatio: "9/16", maxHeight: "80vh", objectFit: "cover", background: "#000" }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}
