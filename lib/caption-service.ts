import { fetchWithRetry } from "./fetch-utils";

interface CaptionWord {
    word: string;
    start: number;
    end: number;
    confidence: number;
}

interface CaptionResult {
    transcript: string;
    words: CaptionWord[];
}

export async function generateCaptions(audioUrl: string, languageCode: string = "en-US"): Promise<CaptionResult> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        throw new Error("DEEPGRAM_API_KEY is not set in environment variables.");
    }

    console.log(`Generating captions for: ${audioUrl} with language: ${languageCode}`);

    // Map language display names / locale codes → Deepgram language codes
    const LANGUAGE_MAP: Record<string, string> = {
        // Display name → code
        "English": "en",
        "Hindi": "hi",
        "Spanish": "es",
        "French": "fr",
        "German": "de",
        "Japanese": "ja",
        "Korean": "ko",
        "Portuguese": "pt",
        "Italian": "it",
        "Dutch": "nl",
        "Chinese": "zh",
        "Arabic": "ar",
        "Russian": "ru",
        "Turkish": "tr",
        "Swedish": "sv",
        "Norwegian": "no",
        "Danish": "da",
        "Finnish": "fi",
        "Polish": "pl",
        "Ukrainian": "uk",
        // Locale codes → Deepgram code
        "en-US": "en",
        "en-GB": "en",
        "hi-IN": "hi",
        "es-MX": "es",
        "es-ES": "es",
        "fr-FR": "fr",
        "de-DE": "de",
        "ja-JP": "ja",
        "ko-KR": "ko",
        "pt-BR": "pt",
        "pt-PT": "pt",
        "it-IT": "it",
        "nl-NL": "nl",
        "zh-CN": "zh",
        "zh-TW": "zh",
    };

    // Resolve: exact match → strip locale suffix → fallback to "en"
    let lang = LANGUAGE_MAP[languageCode]
        ?? LANGUAGE_MAP[languageCode.split("-")[0]]
        ?? languageCode.split("-")[0]  // pass-through short code (e.g. "de")
        ?? "en";

    const queryParams = new URLSearchParams({
        model: "nova-2",
        smart_format: "true",
        utterances: "true",
        punctuate: "true",
        words: "true",
        language: lang,
    });

    const response = await fetchWithRetry(`https://api.deepgram.com/v1/listen?${queryParams.toString()}`, {
        method: "POST",
        headers: {
            "Authorization": `Token ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: audioUrl }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepgram Transcription Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    const results = data.results?.channels?.[0]?.alternatives?.[0];
    if (!results) {
        throw new Error("Deepgram returned no transcription results.");
    }

    const transcript = results.transcript || "";
    const words: any[] = (results.words || []).map((w: any) => ({
        word: w.word,
        punctuated_word: w.punctuated_word || w.word,
        start: w.start,
        end: w.end,
        confidence: w.confidence
    }));

    return {
        transcript,
        words
    };
}
