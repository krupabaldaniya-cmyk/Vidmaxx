import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export const generateScriptPrompt = (
    niche: string,
    duration: number,
    style: string,
    language: string
) => {
    const sceneCount = 6;
    const wordCount = Math.floor(duration * 2.3); // ~2.3 wps is comfortable TTS pace
    const secondsPerScene = Math.floor(duration / sceneCount);

    return `
You are an expert short-form video scriptwriter.

Create a compelling, specific, and educational video STRICTLY about: "${niche}"

STRICT REQUIREMENTS:
1. Language: Write ALL narration fields in ${language}. Do NOT mix languages. Only "imagePrompt" uses English.
2. Niche accuracy: EVERY sentence must be DIRECTLY about "${niche}". Zero off-topic content.
3. Script length: Approximately ${wordCount} words for the full narration (read aloud by TTS).
4. Visual style: ${style} — all image prompts must match this aesthetic.
5. Structure: Strong hook in first 5 seconds, deliver value, clear call-to-action at end.
6. Scenes: Exactly ${sceneCount} scenes, each ~${secondsPerScene} seconds.

For EACH scene, write a DETAILED image prompt in English that:
- Directly shows what is narrated in that scene
- Matches the "${style}" visual style
- Is photorealistic and cinematic
- Is 15–25 words with lighting, mood, and composition details

Return ONLY this exact JSON — no markdown, no commentary, no code fences:
{
  "title": "video title in ${language}",
  "script": "complete narration in ${language} (~${wordCount} words, spoken continuously)",
  "scenes": [
    {
      "sceneNumber": 1,
      "narrationSegment": "part of script spoken during this scene, in ${language}",
      "imagePrompt": "detailed English prompt: specific visual, ${style} style, cinematic lighting, high quality",
      "duration": ${secondsPerScene}
    },
    {
      "sceneNumber": 2,
      "narrationSegment": "...",
      "imagePrompt": "...",
      "duration": ${secondsPerScene}
    },
    {
      "sceneNumber": 3,
      "narrationSegment": "...",
      "imagePrompt": "...",
      "duration": ${secondsPerScene}
    },
    {
      "sceneNumber": 4,
      "narrationSegment": "...",
      "imagePrompt": "...",
      "duration": ${secondsPerScene}
    },
    {
      "sceneNumber": 5,
      "narrationSegment": "...",
      "imagePrompt": "...",
      "duration": ${secondsPerScene}
    },
    {
      "sceneNumber": 6,
      "narrationSegment": "...",
      "imagePrompt": "...",
      "duration": ${secondsPerScene}
    }
  ]
}

EXAMPLE — niche="Cricket batting tips", language="Hindi", style="Sports":
{
  "title": "बल्लेबाजी के 6 राज़",
  "script": "क्रिकेट में बेहतरीन बल्लेबाज बनना चाहते हैं? ये 6 राज़ आपको प्रो बना देंगे...",
  "scenes": [
    {
      "sceneNumber": 1,
      "narrationSegment": "क्रिकेट में बेहतरीन बल्लेबाज बनना चाहते हैं?",
      "imagePrompt": "Professional cricket batsman in white uniform taking stance at crease, stadium floodlights, dramatic sports photography, sharp focus, bokeh background",
      "duration": 6
    }
  ]
}
`.trim();
};

export async function generateVideoScriptData(
    niche: string,
    duration: number,
    style: string,
    language: string
) {
    const prompt = generateScriptPrompt(niche, duration, style, language);

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.text || "";

    try {
        // Robustly extract JSON — strips markdown code fences if Gemini adds them
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : text;
        const parsed = JSON.parse(cleanJson);

        console.log("SCRIPT TITLE:", parsed.title);
        console.log("SCENE COUNT:", parsed.scenes?.length);
        parsed.scenes?.forEach((s: any, i: number) =>
            console.log(`Scene ${i + 1} imagePrompt: ${s.imagePrompt?.slice(0, 80)}...`)
        );

        return parsed;
    } catch (error) {
        console.error("Failed to parse Gemini JSON response:", text);
        throw new Error("Invalid AI response format");
    }
}
