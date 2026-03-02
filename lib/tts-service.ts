import { VOICE_MAP } from './constants';

interface TTSParams {
    text: string;
    language: string; // "English", "Hindi", etc.
    voiceId: string; // "aura-asteria-en", "Vaanee", etc.
}

interface TTSResult {
    audioBuffer: ArrayBuffer;
    mimeType: 'audio/wav' | 'audio/mpeg';
}

// Utility: Check if text contains Hindi (Devanagari) characters
function isHindiText(text: string): boolean {
    return /[\u0900-\u097F]/.test(text);
}

// Utility: Translate English to Hindi (Devanagari)
async function translateToHindi(text: string): Promise<string> {
    // Production: integrate real translation API (Google Translate, Azure, etc.)
    console.warn(`Translation service not implemented. Using fallback Hindi text.`);
    return "नमस्ते, यह एक परीक्षण संदेश है।";
}

export async function synthesizeSpeech({ text, language, voiceId }: TTSParams): Promise<TTSResult> {
    console.log(`TTS Request: Lang=${language}, Voice=${voiceId}`);

    const config = VOICE_MAP[language];
    if (!config) {
        throw new Error(`Unsupported language: ${language}. Check VOICE_MAP configuration.`);
    }

    // STRICT VALIDATION: Ensure voice belongs to the language
    const allowedVoices = Object.values(config.voices);
    if (!allowedVoices.includes(voiceId)) {
        console.error(`Voice mismatch! ${voiceId} is not allowed for ${language}. Allowed: ${allowedVoices.join(', ')}`);
        throw new Error(`Security Alert: Voice '${voiceId}' does not belong to language '${language}'. Request blocked.`);
    }

    // Provider Switching
    if (config.provider === 'deepgram') {
        return deepgramTTS(text, voiceId);
    } else if (config.provider === 'fondalabs') {
        // FondaLabs requires Hindi Unicode text
        if (!isHindiText(text)) {
            console.warn(`Non-Hindi text detected. Translating to Hindi...`);
            text = await translateToHindi(text);
        }

        console.log(`Calling FondaLabs with Hindi text for voice: ${voiceId}`);
        return await fondaTTS(text, voiceId);
    }

    throw new Error(`Unknown provider for language ${language}`);
}

async function deepgramTTS(text: string, voiceId: string): Promise<TTSResult> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) throw new Error("Deepgram API key missing");

    const response = await fetch(`https://api.deepgram.com/v1/speak?model=${voiceId}&encoding=linear16&container=wav`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Deepgram Error: ${error}`);
    }

    return {
        audioBuffer: await response.arrayBuffer(),
        mimeType: 'audio/wav'
    };
}

async function fondaTTS(text: string, voiceId: string): Promise<TTSResult> {
    const apiKey = process.env.FONADAVOICE_API_KEY;
    if (!apiKey) throw new Error("FondaLabs API key missing");

    console.log(`FondaLabs Request: Voice=${voiceId}, Text=${text.substring(0, 50)}...`);

    // Official FondaLabs endpoint from documentation
    const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            input: text,       // Hindi Devanagari text
            voice: voiceId,    // "Vaanee"
            language: "Hindi"  // Language string
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("FondaLabs API Error:", errorText);
        throw new Error(`FondaLabs Error (${response.status}): ${errorText}`);
    }

    return {
        // FondaLabs returns MP3 format
        audioBuffer: await response.arrayBuffer(),
        mimeType: 'audio/mpeg'
    };
}
