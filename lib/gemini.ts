import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export const generateScriptPrompt = (niche: string, duration: number, style: string) => {
    const sceneCount = duration <= 40 ? 5 : 6;

    return `
You are a professional video script writer. Generate a high-quality video script for a video series about "${niche}".
The video duration is approximately ${duration} seconds.
The video style is "${style}".

Requirements:
1. Provide a catchy "title" for the video.
2. Provide a natural, conversational "script" for a voiceover. It should be engaging and fit the niche perfectly.
3. Provide exactly ${sceneCount} "scenes". Each scene must have:
    - "text": The specific part of the script for this scene.
    - "imagePrompt": A highly detailed, cinematic image generation prompt for this scene that fits the style "${style}".

Response Format:
Return ONLY a valid JSON object. No raw text, no markdown code blocks.
JSON structure:
{
    "title": "...",
    "script": "...",
    "scenes": [
        { "text": "...", "imagePrompt": "..." }
    ]
}
`;
};

export async function generateVideoScriptData(niche: string, duration: number, style: string) {
    const prompt = generateScriptPrompt(niche, duration, style);

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.text || "";

    try {
        // Clean up the response if Gemini wraps it in markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Failed to parse Gemini JSON response:", text);
        throw new Error("Invalid AI response format");
    }
}
