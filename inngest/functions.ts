import { inngest } from "@/lib/inngest";
import { supabaseAdmin, uploadAudio, uploadImage } from "@/lib/supabase";
import { generateVideoScriptData } from "@/lib/gemini";
import { synthesizeSpeech } from "@/lib/tts-service";
import { VOICE_MAP } from "@/lib/constants";
import { generateCaptions } from "@/lib/caption-service";
import { generateImage } from "@/lib/generate-image";




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
        const { seriesId } = event.data;

        // ── Step 0: Create a placeholder "generating" record ──────────────────
        // This lets the frontend poll for status immediately after triggering.
        const placeholderRecord = await step.run("create-placeholder-record", async () => {
            if (!supabaseAdmin) {
                throw new Error("Supabase Admin client not initialized.");
            }

            const { data, error } = await supabaseAdmin
                .from("videos")
                .insert({
                    series_id: seriesId,
                    status: "generating",
                    title: null,
                    script: null,
                    audio_url: null,
                    image_urls: [],
                    captions: [],
                })
                .select("id")
                .single();

            if (error || !data) {
                throw new Error(`Failed to create placeholder record: ${error?.message ?? "Unknown error"}`);
            }

            console.log("Created placeholder video record:", data.id);
            return { videoId: data.id as string };
        });

        const videoId = placeholderRecord.videoId;

        // Helper to mark the record as failed (used in catch block)
        const markFailed = async (reason: string) => {
            if (!supabaseAdmin) return;
            await supabaseAdmin
                .from("videos")
                .update({ status: "failed" })
                .eq("id", videoId);
            console.error(`Video ${videoId} marked as failed: ${reason}`);
        };

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

                // Get default voice for the language from VOICE_MAP
                const langConfig = (VOICE_MAP as any)[normalizedLang] || VOICE_MAP.English;
                const defaultVoice = Object.keys(langConfig.voices)[0];

                const normalized = {
                    id: data.id as string,
                    niche: (data.niche_selected ?? "General") as string,
                    voice: (voiceConfig.modelName ?? voiceConfig.voice ?? defaultVoice) as string,
                    language: normalizedLang,
                    visualStyle: (data.visual_style_name ?? "cinematic") as string,
                    duration: (data.video_duration ?? 35) as number,
                    platform: ((data.target_platforms ?? ["Youtube"])[0]) as string,
                };

                console.log("SERIES DATA:", normalized);
                return normalized;
            });

            // ── Step 2: Generate Video Script via Gemini AI ───────────────────
            const scriptData = await step.run("generate-video-script", async () => {
                console.log("STEP 2 — Generating video script for niche:", seriesData.niche);

                const result = await generateVideoScriptData(
                    seriesData.niche,
                    seriesData.duration,
                    seriesData.visualStyle
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
                    language: seriesData.language,
                    voiceId: seriesData.voice,
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

            // ── Step 6: Update placeholder record with completed data ─────────
            const savedRecord = await step.run("save-video-data", async () => {
                console.log("STEP 6 — Updating video record for series:", seriesId, "video:", videoId);

                if (!supabaseAdmin) {
                    throw new Error("Supabase Admin client not initialized.");
                }

                const imageUrls = imageData.images.map((item: { sceneId: number, url: string }) => item.url);

                const { data, error } = await supabaseAdmin
                    .from("videos")
                    .update({
                        title: scriptData.title,
                        script: scriptData.script,
                        audio_url: audioData.audioUrl,
                        image_urls: imageUrls,
                        captions: captionData.words, // Storing word-level data for animations
                        status: "completed",
                    })
                    .eq("id", videoId)
                    .select("id")
                    .single();

                if (error) {
                    console.error("Database Update Error:", error);
                    throw new Error(`Failed to update video record: ${error.message}`);
                }

                return {
                    videoId: data.id,
                };
            });

            // ── Final Response ─────────────────────────────────────────────────
            return {
                seriesId,
                videoId: savedRecord.videoId,
                status: "completed",
                message: "Video generation pipeline successfully orchestrated",
            };

        } catch (err: any) {
            // Mark the placeholder record as failed so the frontend stops polling
            await markFailed(err?.message ?? "Unknown pipeline error");
            throw err; // Re-throw so Inngest marks the run as failed too
        }
    }
);
