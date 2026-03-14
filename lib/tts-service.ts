import { VOICE_MAP } from './constants';

interface TTSParams {
    text: string;
    language: string; // "English", "Hindi", etc.
    voiceId: string; // "aura-2-apollo-en", "Vaanee", etc.
}

interface TTSResult {
    audioBuffer: ArrayBuffer;
    mimeType: 'audio/wav' | 'audio/mpeg';
}

// Utility: Check if text contains Hindi (Devanagari) characters
function isHindiText(text: string): boolean {
    return /[\u0900-\u097F]/.test(text);
}

// Utility: Translate English to Hindi (Devanagari) - Placeholder
async function translateToHindi(text: string): Promise<string> {
    console.warn(`Translation service not implemented. Using fallback Hindi text.`);
    // In production, use Google Translate or similar
    return text; // For now return as is, but Fonadalab expects Hindi
}

/**
 * Split text into chunks to respect API limits (e.g., Fonadalab 450 chars)
 */
function splitTextIntoChunks(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = "";

    // Split by sentences or punctuation for natural breaks
    const sentences = text.match(/[^.!?]+[.!?]*|[^.!?]+/g) || [text];

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxLength) {
            currentChunk += sentence;
        } else {
            if (currentChunk) chunks.push(currentChunk.trim());

            if (sentence.length > maxLength) {
                // If a single sentence is too long, split by words
                const words = sentence.split(" ");
                let wordChunk = "";
                for (const word of words) {
                    if ((wordChunk + word).length <= maxLength) {
                        wordChunk += word + " ";
                    } else {
                        chunks.push(wordChunk.trim());
                        wordChunk = word + " ";
                    }
                }
                currentChunk = wordChunk;
            } else {
                currentChunk = sentence;
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}

export async function synthesizeSpeech({ text, language, voiceId }: TTSParams): Promise<TTSResult> {
    console.log(`TTS Request: Lang=${language}, Voice=${voiceId}`);

    const config = VOICE_MAP[language];
    if (!config) {
        throw new Error(`Unsupported language: ${language}. Check VOICE_MAP configuration.`);
    }

    // Provider Switching
    if (config.provider === 'deepgram') {
        return deepgramTTS(text, voiceId);
    } else if (config.provider === 'fondalabs') {
        // FondaLabs requires Hindi Unicode text for Hindi voices
        if (language === 'Hindi' && !isHindiText(text)) {
            console.warn(`Hindi requested but text is not Devanagari. Attempting translation...`);
            text = await translateToHindi(text);
        }

        console.log(`Calling FondaLabs with text for voice: ${voiceId}`);
        return await fondaTTS(text, voiceId, language);
    }

    throw new Error(`Unknown provider for language ${language}`);
}

async function deepgramTTS(text: string, voiceId: string): Promise<TTSResult> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) throw new Error("Deepgram API key missing");

    // Deepgram Aura 2 is canonical. Ensure we use the full model name.
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

async function fondaTTS(text: string, voiceId: string, language: string): Promise<TTSResult> {
    const apiKey = process.env.FONADAVOICE_API_KEY;
    if (!apiKey) throw new Error("FondaLabs API key missing");

    // Fonada has a 450 character limit
    const chunks = splitTextIntoChunks(text, 450);
    const audioBuffers: ArrayBuffer[] = [];

    for (const chunk of chunks) {
        console.log(`Processing Fonada chunk: ${chunk.substring(0, 50)}...`);
        const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: chunk,
                voice: voiceId,
                language: language // "Hindi" or "English"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`FondaLabs Error (${response.status}): ${errorText}`);
        }

        audioBuffers.push(await response.arrayBuffer());
    }

    // Concatenate buffers if multiple chunks
    if (audioBuffers.length === 1) {
        return {
            audioBuffer: audioBuffers[0],
            mimeType: 'audio/mpeg'
        };
    }

    // Simple concatenation of MP3 buffers (usually works for standard MP3s)
    const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.byteLength, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of audioBuffers) {
        combinedBuffer.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
    }

    return {
        audioBuffer: combinedBuffer.buffer,
        mimeType: 'audio/mpeg'
    };
}
