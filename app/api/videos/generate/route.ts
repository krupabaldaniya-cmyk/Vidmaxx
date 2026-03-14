import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';

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

        // Trigger the Inngest video generation pipeline
        await inngest.send({
            name: 'video/generate.series',
            data: {
                seriesId
            }
        });

        return NextResponse.json({ success: true, message: 'Video generation queued' });
    } catch (error) {
        console.error('[VIDEO_GENERATE_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
