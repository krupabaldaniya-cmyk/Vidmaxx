import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { seriesId } = body;

        if (!seriesId) {
            return new NextResponse('Missing series ID', { status: 400 });
        }

        if (!supabaseAdmin) {
            console.error('[VIDEO_GENERATE_POST] Supabase Admin client not initialized');
            return new NextResponse('Database connection error', { status: 500 });
        }

        const { data: video, error: videoError } = await supabaseAdmin
            .from('videos')
            .insert({
                series_id: seriesId,
                status: 'generating',
                title: 'Generating...',
                script: ''
            })
            .select('id')
            .single();

        if (videoError) {
            console.error('[VIDEO_GENERATE_POST] Error creating video record:', videoError);
            return new NextResponse(`Failed to initialize video generation: ${videoError.message}`, { status: 500 });
        }

        // Trigger the Inngest video generation pipeline
        await inngest.send({
            name: 'video/generate.series',
            data: {
                seriesId,
                videoId: video?.id
            }
        });

        return NextResponse.json({ success: true, message: 'Video generation queued', videoId: video?.id });
    } catch (error: any) {
        console.error('[VIDEO_GENERATE_POST] Catch Error:', error);
        return new NextResponse(error.message || 'Internal Error', { status: 500 });
    }
}
