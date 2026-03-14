
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

    // Map language names or codes if necessary
    let lang = languageCode;
    if (lang === "Hindi") lang = "hi";
    if (lang === "English") lang = "en-US";
    if (lang === "Spanish") lang = "es-MX";
    if (lang === "French") lang = "fr-FR";
    if (lang === "German") lang = "de-DE";
    if (lang === "Japanese") lang = "ja-JP";

    const queryParams = new URLSearchParams({
        model: "nova-2",
        smart_format: "true",
        utterances: "true",
        punctuate: "true",
        words: "true",
        language: lang,
    });

    const response = await fetch(`https://api.deepgram.com/v1/listen?${queryParams.toString()}`, {
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
    const words: CaptionWord[] = (results.words || []).map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end,
        confidence: w.confidence
    }));

    return {
        transcript,
        words
    };
}
