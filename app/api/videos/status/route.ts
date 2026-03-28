import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/videos/status?seriesId=<id>
 *
 * Polls the `videos` table for the latest record associated with a `series_id`.
 * Returns the current status and video ID so the frontend can stop spinning
 * when the pipeline finishes.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const seriesId = searchParams.get('seriesId');

        if (!seriesId) {
            return NextResponse.json({ error: 'Missing seriesId' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Fetch the most recent video record for this series
        const { data, error } = await supabaseAdmin
            .from('videos')
            .select('id, status, title, image_urls, created_at')
            .eq('series_id', seriesId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            // No row yet — pipeline hasn't inserted the placeholder yet
            if (error.code === 'PGRST116') {
                return NextResponse.json({ status: 'pending' });
            }
            console.error('[VIDEO_STATUS_GET]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            videoId: data.id,
            status: data.status,          // 'generating' | 'completed' | 'failed'
            title: data.title,
            thumbnail: data.image_urls?.[0] ?? null,
        });
    } catch (err) {
        console.error('[VIDEO_STATUS_GET]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
