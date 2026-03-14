import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/videos
 *
 * Returns all video records (with nested series name) ordered newest-first.
 * Used by the client-side Videos page to render the list.
 */
export async function GET() {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const { data, error } = await supabaseAdmin
            .from('videos')
            .select(`
                id,
                title,
                status,
                image_urls,
                created_at,
                series (
                    series_name
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[VIDEOS_GET]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data ?? []);
    } catch (err) {
        console.error('[VIDEOS_GET]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
