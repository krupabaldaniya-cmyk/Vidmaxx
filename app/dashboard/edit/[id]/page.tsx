'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SeriesForm, { SeriesFormData } from '@/components/dashboard/series-form';
import { toast } from 'sonner';

export default function EditSeriesPage() {
    const { id } = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<SeriesFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await fetch(`/api/series?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch series');

                const data = await response.json();

                // Map DB schema back to SeriesFormData
                const mappedData: SeriesFormData = {
                    niche: {
                        type: data.niche_type,
                        selected: data.niche_selected,
                        customDescription: data.niche_custom_description || '',
                    },
                    identity: {
                        language: data.language_config,
                        voice: data.voice_config,
                    },
                    acoustics: {
                        selectedMusicIds: data.selected_music_ids || [],
                        volume: data.background_music_volume || 30,
                    },
                    visuals: {
                        styleId: data.visual_style_id,
                        styleName: data.visual_style_name,
                    },
                    typography: {
                        styleId: data.caption_style_id,
                        styleName: data.caption_style_name,
                    },
                    schedule: {
                        name: data.series_name,
                        duration: data.video_duration,
                        platforms: data.target_platforms || [],
                        publishTime: data.publish_time,
                    }
                };

                setInitialData(mappedData);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load series data');
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchSeries();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!initialData) return null;

    return (
        <SeriesForm mode="edit" initialData={initialData} seriesId={id as string} />
    );
}
