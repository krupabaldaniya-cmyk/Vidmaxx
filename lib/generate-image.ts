import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

/**
 * Generates an image using Hugging Face's FLUX.1 Schnell model.
 * 
 * @param prompt - The text prompt for image generation.
 * @r
 * turns A Blob representing the generated image.
 */
export async function generateImage(prompt: string): Promise<Blob> {
    if (!process.env.HF_TOKEN) {
        throw new Error("HF_TOKEN is not set in environment variables.");
    }

    console.log(`Generating image for prompt: ${prompt}`);

    const response = await hf.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
        parameters: {
            // @ts-ignore
            width: 1024,
            height: 1024,
            // @ts-ignore
            use_cache: false,
            wait_for_model: true,
        },
    });

    return response as any as Blob;
}
