import { FONADA_LANGUAGES, DEFAULT_VOICE_PER_LANGUAGE, VOICES } from './constants';
import { fetchWithRetry } from './fetch-utils';

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

// (Language arrays are now imported from constants.ts)


export async function synthesizeSpeech({ text, language, voiceId }: TTSParams): Promise<TTSResult> {
    console.log(`TTS Request: Lang=${language}, Voice=${voiceId}`);

    // Route to Fonada for Indian languages regardless of voiceId
    if (FONADA_LANGUAGES.includes(language)) {
        console.log(`[tts] Routing to Fonada for language: ${language}`);
        
        // FondaLabs requires Hindi Unicode text for Hindi voices
        if (language === 'Hindi' && !isHindiText(text)) {
            console.warn(`Hindi requested but text is not Devanagari. Attempting translation...`);
            text = await translateToHindi(text);
        }

        return await fondaTTS(text, voiceId, language);
    }

    // For all other languages, use Deepgram with the correct language voice
    // Validate that voiceId exists in our VOICES list
    const voiceExists = VOICES.find((v) => v.id === voiceId);
    const resolvedVoiceId = voiceExists
        ? voiceId
        : DEFAULT_VOICE_PER_LANGUAGE[language] ?? "aura-2-apollo-en";

    if (!voiceExists) {
        console.warn(`[tts] Voice "${voiceId}" not found. Falling back to: "${resolvedVoiceId}"`);
    }

    console.log(`[tts] Cloudflare TTS: voice=${resolvedVoiceId}, language=${language}`);
    return await cloudflareTTS(text, resolvedVoiceId);
}

async function cloudflareTTS(text: string, voiceId: string): Promise<TTSResult> {
    const accountId = process.env.CF_ACCOUNT_ID?.trim();
    const apiToken = process.env.CF_API_TOKEN?.trim();

    if (!accountId || !apiToken) {
        throw new Error("Missing CF_ACCOUNT_ID or CF_API_TOKEN");
    }

    const response = await fetchWithRetry(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/deepgram/aura-1`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                voice: voiceId,
                encoding: "mp3",
            }),
            timeoutMs: 45000,  // 45 seconds — TTS is slow for long scripts
            maxRetries: 5,
            baseDelayMs: 3000,
        }
    );

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cloudflare TTS error: ${response.status} — ${errText}`);
    }

    return {
        audioBuffer: await response.arrayBuffer(),
        mimeType: 'audio/mpeg'
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
        const response = await fetchWithRetry("https://api.fonada.ai/tts/generate-audio-large", {
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
            mimeType: 'audio/wav'
        };
    }

    // Properly merge WAV files
    // WAV header is typically 44 bytes. We assume all chunks have the exact same format.
    let totalDataLength = 0;
    const dataChunks: Uint8Array[] = [];
    
    // First chunk keeps its header (first 44 bytes) plus its data
    const firstChunk = new Uint8Array(audioBuffers[0]);
    totalDataLength += firstChunk.length - 44;
    dataChunks.push(firstChunk);

    // Subsequent chunks strip the first 44 bytes
    for (let i = 1; i < audioBuffers.length; i++) {
        const chunk = new Uint8Array(audioBuffers[i]);
        const dataOnly = chunk.slice(44);
        totalDataLength += dataOnly.length;
        dataChunks.push(dataOnly);
    }

    // Allocate new buffer for exact required size
    const mergedLength = 44 + totalDataLength;
    const mergedBuffer = new Uint8Array(mergedLength);

    // Write all data
    let offset = 0;
    for (const chunk of dataChunks) {
        mergedBuffer.set(chunk, offset);
        offset += chunk.length;
    }

    // Update File Size (Bytes 4-7, Little Endian 32-bit) = Total Data Length + 36
    const view = new DataView(mergedBuffer.buffer);
    view.setUint32(4, totalDataLength + 36, true);
    // Update Data Size (Bytes 40-43, Little Endian 32-bit) = Total Data Length
    view.setUint32(40, totalDataLength, true);

    return {
        audioBuffer: mergedBuffer.buffer,
        mimeType: 'audio/wav'
    };
}
