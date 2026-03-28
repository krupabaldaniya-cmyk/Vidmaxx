import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { inngest } from '@/lib/inngest';
import { isValidCaptionStyle } from '@/lib/caption-styles';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { formData } = body;

        if (!formData) {
            return new NextResponse('Missing form data', { status: 400 });
        }

        if (!supabaseAdmin) {
            console.error('Supabase Admin client not initialized');
            return new NextResponse('Database connection error', { status: 500 });
        }

        // Map the multi-step formData to the database schema
        const seriesData = {
            user_id: userId,

            // Step 1: Niche
            niche_type: formData.niche.type,
            niche_selected: formData.niche.selected,
            niche_custom_description: formData.niche.customDescription,

            // Step 2: Identity
            language_config: formData.identity.language.language, // Store as string
            voice_config: formData.identity.voice,           // Store as object (JSONB)

            // Step 3: Acoustics
            selected_music_ids: formData.acoustics.selectedMusicIds,
            background_music_volume: formData.acoustics.volume,

            // Step 4: Visuals
            visual_style_id: formData.visuals.styleId,
            visual_style_name: formData.visuals.styleName,

            // Step 5: Typography
            caption_style: formData.typography.styleId,      // Fixed column name

            // Step 6: Schedule
            series_name: formData.schedule.name,
            video_duration: formData.schedule.duration,
            target_platforms: formData.schedule.platforms,
            publish_time: formData.schedule.publishTime,

            status: 'scheduled'
        };

        // ── Validation ───────────────────────────────────────────────────
        if (!isValidCaptionStyle(seriesData.caption_style)) {
            console.error(`[SERIES_POST] Invalid caption_style: "${seriesData.caption_style}"`);
            return new NextResponse(`Invalid caption_style: ${seriesData.caption_style}`, { status: 400 });
        }

        console.log('[SERIES_POST] Inserting:', seriesData);

        const { data, error } = await supabaseAdmin
            .from('series')
            .insert([seriesData])
            .select()
            .single();

        if (error) {
            console.error('Error inserting series:', error);
            return new NextResponse(error.message, { status: 500 });
        }

        // Create initial video record
        const { data: videoRecord, error: videoError } = await supabaseAdmin
            .from('videos')
            .insert({
                series_id: data.id,
                status: 'generating',
                title: 'Generating...',
                script: ''
            })
            .select('id')
            .single();

        if (videoError) {
            console.error('Error creating initial video record:', videoError);
            // We don't necessarily want to fail the whole series creation if video record fails, 
            // but for consistency we should probably handle it.
        }

        // Trigger the video generation background job
        await inngest.send({
            name: 'video/generate.series',
            data: {
                seriesId: data.id,
                videoId: videoRecord?.id,
                formData
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('[SERIES_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!supabaseAdmin) {
            return new NextResponse('Database connection error', { status: 500 });
        }

        if (id) {
            const { data, error } = await supabaseAdmin
                .from('series')
                .select('*')
                .eq('user_id', userId)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching series:', error);
                // PGRST116 = "no rows found" — return 404 rather than 500
                const status = (error as any).code === 'PGRST116' ? 404 : 500;
                return new NextResponse(error.message, { status });
            }
            return NextResponse.json(data);
        } else {
            const { data, error } = await supabaseAdmin
                .from('series')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching series:', error);
                return new NextResponse(error.message, { status: 500 });
            }
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('[SERIES_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        const body = await req.json();
        const { id, status, formData } = body;

        if (!id) {
            return new NextResponse('Missing ID', { status: 400 });
        }

        if (!supabaseAdmin) return new NextResponse('Database error', { status: 500 });

        let updateData: any = {};

        if (status) {
            updateData.status = status;
        }

        if (formData) {
            updateData = {
                ...updateData,
                niche_type: formData.niche.type,
                niche_selected: formData.niche.selected,
                niche_custom_description: formData.niche.customDescription,
                language_config: formData.identity.language.language, // Flattened
                voice_config: formData.identity.voice,           // Object
                selected_music_ids: formData.acoustics.selectedMusicIds,
                background_music_volume: formData.acoustics.volume,
                visual_style_id: formData.visuals.styleId,
                visual_style_name: formData.visuals.styleName,
                caption_style: formData.typography.styleId,      // Fixed
                series_name: formData.schedule.name,
                video_duration: formData.schedule.duration,
                target_platforms: formData.schedule.platforms,
                publish_time: formData.schedule.publishTime,
            };

            // ── Validation ───────────────────────────────────────────────────
            if (updateData.caption_style && !isValidCaptionStyle(updateData.caption_style)) {
                console.error(`[SERIES_PATCH] Invalid caption_style: "${updateData.caption_style}"`);
                return new NextResponse(`Invalid caption_style: ${updateData.caption_style}`, { status: 400 });
            }
        }

        // Update with ownership check
        const { data, error } = await supabaseAdmin
            .from('series')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating series:', error);
            return new NextResponse(error.message, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('[SERIES_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
