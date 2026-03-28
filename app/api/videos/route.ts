import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!supabaseAdmin) {
            return new NextResponse('Database connection error', { status: 500 });
        }

        // Fetch videos for the current user's series
        const { data: videos, error } = await supabaseAdmin
            .from('videos')
            .select(`
                id, title, status, video_url, image_urls, created_at, series_id,
                series!inner (
                    series_name,
                    user_id
                )
            `)
            .eq('series.user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching videos:', error);
            return new NextResponse(error.message, { status: 500 });
        }

        // Flatten the response
        const flattenedVideos = videos.map((v: any) => ({
            ...v,
            series_name: v.series?.series_name
        }));

        return NextResponse.json(flattenedVideos, {
            headers: {
                "Cache-Control": "private, max-age=10, stale-while-revalidate=30",
            },
        });
    } catch (error) {
        console.error('[VIDEOS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
