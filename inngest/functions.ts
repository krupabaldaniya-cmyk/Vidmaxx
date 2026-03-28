import { inngest } from "@/lib/inngest";
import { supabaseAdmin, uploadAudio, uploadImage } from "@/lib/supabase";
import { generateVideoScriptData } from "@/lib/gemini";
import { synthesizeSpeech } from "@/lib/tts-service";
import { DEFAULT_VOICE_PER_LANGUAGE } from "@/lib/constants";
import { generateCaptions } from "@/lib/caption-service";
import { generateImage } from "@/lib/generate-image";
import { renderVideo } from "../lib/render-video";
import {
    CaptionWord,
    CaptionStyle,
    VIDEO_FPS,
} from "../remotion/video.types";
import { VISUAL_STYLE_TO_MUSIC, type MoodMusic } from "../lib/constants";
import { CaptionStyles as CAPTION_STYLES } from "../lib/constants";




// ─────────────────────────────────────────────
// Hello World (dev / smoke-test function)
// ─────────────────────────────────────────────
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return {
            message: `Hello ${event.data.name ?? "World"}! Welcome to Vidmaxx.`,
            status: "success",
        };
    }
);

// ─────────────────────────────────────────────
// Main Video Generation Pipeline
// ─────────────────────────────────────────────
export const generateVideo = inngest.createFunction(
    { id: "generate-video-series" },
    { event: "video/generate.series" },
    async ({ event, step }) => {
        const { seriesId, videoId } = event.data;

        try {
            // ── Step 1: Fetch Series Data ──────────────────────────────────────
            const seriesData = await step.run("fetch-series-data", async () => {
                if (!supabaseAdmin) {
                    throw new Error("Supabase Admin client not initialized.");
                }

                const { data, error } = await supabaseAdmin
                    .from("series")
                    .select("*")
                    .eq("id", seriesId)
                    .single();

                if (error || !data) {
                    throw new Error(
                        `Failed to fetch series ${seriesId}: ${error?.message ?? "Not found"}`
                    );
                }

                // voice_config may be stored as a JSON object: { voice: "...", language: "..." }
                const voiceConfig =
                    typeof data.voice_config === "object" && data.voice_config !== null
                        ? data.voice_config
                        : {};

                const lang = (voiceConfig.language ?? data.language_config ?? "English") as string;

                // Map common language codes/names to VOICE_MAP keys if necessary
                const normalizedLang = lang === "hi" || lang === "hi-IN" ? "Hindi" :
                    lang === "en" || lang === "en-US" ? "English" : lang;

                // Get default voice for the language from DEFAULT_VOICE_PER_LANGUAGE
                const defaultVoice = DEFAULT_VOICE_PER_LANGUAGE[normalizedLang] || DEFAULT_VOICE_PER_LANGUAGE["English"];

                const normalized = {
                    id: data.id as string,
                    niche: (data.niche_selected ?? "General") as string,
                    voice: (voiceConfig.modelName ?? voiceConfig.voice ?? defaultVoice) as string,
                    language: normalizedLang,
                    visualStyle: (data.visual_style_name ?? "cinematic") as string,
                    duration: (data.video_duration ?? 35) as number,
                    platform: ((data.target_platforms ?? ["Youtube"])[0]) as string,
                    captionStyle: (data.caption_style ?? "default") as string,
                };

                console.log("SERIES DATA:", normalized);
                return normalized;
            });

            // ── Step 2: Generate Video Script via Gemini AI ───────────────────
            const scriptData = await step.run("generate-video-script", async () => {
                console.log(`STEP 2 — Generating video script for niche: ${seriesData.niche} in language: ${seriesData.language}`);

                const result = await generateVideoScriptData(
                    seriesData.niche,
                    seriesData.duration,
                    seriesData.visualStyle,
                    seriesData.language
                );

                console.log("SCRIPT DATA:", result.title);
                return result;
            });


            // ── Step 3: Generate Voice (Deepgram / Fonada) ────────────────────
            const audioData = await step.run("generate-voice", async () => {
                console.log("STEP 3 — Generating voice | Lang:", seriesData.language, "| Voice:", seriesData.voice);

                if (!scriptData.script) {
                    throw new Error("No script generated in Step 2. Cannot generate audio.");
                }

                // ── Call the correct TTS provider based on language ──
                const ttsResult = await synthesizeSpeech({
                    text: scriptData.script,
                    voiceId: seriesData.voice,
                    language: seriesData.language,
                });

                // ── Upload audio to Supabase Storage ──
                const fileName = `audio/${seriesId}_${Date.now()}.mp3`;
                const audioUrl = await uploadAudio(ttsResult.audioBuffer, fileName);

                console.log("AUDIO URL:", audioUrl);
                return {
                    audioUrl,
                    mimeType: ttsResult.mimeType,
                    duration: seriesData.duration, // approximate; real duration comes after transcription
                };
            });


            // ── Step 4: Generate Captions via Deepgram ───────────────────────
            const captionData = await step.run("generate-captions", async () => {
                console.log("STEP 4 — Generating captions for audio:", audioData.audioUrl);

                if (!audioData.audioUrl) {
                    throw new Error("No audio URL available from Step 3. Cannot generate captions.");
                }

                const result = await generateCaptions(
                    audioData.audioUrl,
                    seriesData.language
                );

                console.log(`Generated ${result.words.length} word timestamps.`);

                return {
                    transcript: result.transcript,
                    words: result.words,
                    srtUrl: "" // Optional: Generate and upload SRT if needed
                };
            });


            // ── Step 5: Generate Images via Hugging Face (Parallel) ───────────
            const imageData = await step.run("generate-images", async () => {
                const scenes = scriptData.scenes || [];
                console.log(`STEP 5 — Generating ${scenes.length} images in parallel...`);

                if (scenes.length === 0) {
                    console.warn("No scenes found for image generation.");
                    return { images: [] };
                }

                const images = await Promise.all(
                    scenes.map(async (scene: any, index: number) => {
                        const sceneId = index + 1;
                        const prompt = scene.imagePrompt;

                        // Enrich prompt with visual style
                        const enrichedPrompt = `cinematic wide shot of ${prompt}, style of ${seriesData.visualStyle}, ultra realistic, dramatic lighting, 8k, wide angle lens, movie still`;

                        console.log(`Generating image for scene ${sceneId}...`);
                        const image = await generateImage(enrichedPrompt);
                        const fileName = `images/${Date.now()}-${sceneId}.png`;
                        const url = await uploadImage(image, fileName);

                        return {
                            sceneId,
                            url
                        };
                    })
                );

                console.log(`Successfully generated ${images.length} images in parallel.`);
                return { images };
            });

            // ── Step 6: Save Video Data ───────────────────────────────────────
            const savedRecord = await step.run("save-video-data", async () => {
                console.log("STEP 6 — Saving video data for series:", seriesId);

                if (!supabaseAdmin) {
                    throw new Error("Supabase Admin client not initialized.");
                }

                const imageUrls = imageData.images.map((item: { sceneId: number, url: string }) => item.url);

                if (videoId) {
                    const { data, error } = await supabaseAdmin
                        .from("videos")
                        .update({
                            title: scriptData.title,
                            script: scriptData.script,
                            audio_url: audioData.audioUrl,
                            image_urls: imageUrls,
                            captions: captionData.words,
                            status: "completed"
                        })
                        .eq('id', videoId)
                        .select("id")
                        .single();

                    if (error) {
                        console.error("Database Update Error:", error);
                        throw new Error(`Failed to update video record: ${error.message}`);
                    }

                    return {
                        videoId: data.id,
                    };
                } else {
                    // Fallback for old events or failed initial creation
                    const { data, error } = await supabaseAdmin
                        .from("videos")
                        .insert({
                            series_id: seriesId,
                            title: scriptData.title,
                            script: scriptData.script,
                            audio_url: audioData.audioUrl,
                            image_urls: imageUrls,
                            captions: captionData.words,
                            status: "completed"
                        })
                        .select("id")
                        .single();

                    if (error) {
                        console.error("Database Insert Error:", error);
                        throw new Error(`Failed to insert video record: ${error.message}`);
                    }

                    return {
                        videoId: data.id,
                    };
                }
            });

            // Calculate exact audio duration from captions
            const audioDurationSeconds = captionData.words.length > 0 
                ? captionData.words[captionData.words.length - 1].end 
                : (audioData.duration || 30);

            // ── Step 8: Render final MP4 video using Remotion ─────────────────────────────
            const renderResult = await step.run("render-final-video", async () => {
                if (!audioData.audioUrl) throw new Error("Step 8: audioUrl is missing");
                
                const urls = imageData.images.map((item: { sceneId: number, url: string }) => item.url);
                if (!urls || urls.length === 0) throw new Error("Step 8: imageUrls missing");

                const bgMusic: MoodMusic = VISUAL_STYLE_TO_MUSIC[seriesData.visualStyle] ?? "calm";

                // Debug log — helps trace NaN / undefined issues before they crash Remotion
                console.log("[inngest] renderVideo inputs:", {
                    videoId: savedRecord.videoId,
                    audioUrl: audioData.audioUrl,
                    imageUrlsCount: urls.length,
                    captionsCount: captionData.words?.length ?? 0,
                    captionStyle: seriesData.captionStyle,
                    bgMusic,
                    language: seriesData.language,
                    audioDurationSeconds,
                });
                
                return await renderVideo({
                    videoId: savedRecord.videoId,
                    audioUrl: audioData.audioUrl,
                    imageUrls: urls,
                    captions: captionData.words ?? [],
                    captionStyle: (seriesData.captionStyle as CaptionStyle) ?? "default",
                    audioDurationSeconds,
                    bgMusic,
                });
            });

            // ── Step 9: Save final video URL to database ──────────────────────────────────
            await step.run("save-video-url", async () => {
                if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

                const { error } = await supabaseAdmin
                    .from("videos")
                    .update({
                        video_url: renderResult.videoUrl,
                        status: "completed",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", savedRecord.videoId);

                if (error) {
                    console.error("[Step 9] Failed to update video record:", error);
                    throw new Error(`DB update failed: ${error.message}`);
                }
            });

            // ── Final Response ─────────────────────────────────────────────────
            return {
                seriesId,
                videoId: savedRecord.videoId,
                status: "completed",
                message: "Video generation pipeline successfully orchestrated",
            };
        } catch (error: any) {
            console.error("Video Generation Pipeline Error:", error);

            // Update status to failed if possible
            if (videoId && supabaseAdmin) {
                await step.run("update-failed-status", async () => {
                    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized.");
                    await supabaseAdmin
                        .from("videos")
                        .update({ status: "failed" })
                        .eq("id", videoId);
                });
            }

            throw error; // Re-throw to let Inngest handle retries if configured
        }
    }
);

