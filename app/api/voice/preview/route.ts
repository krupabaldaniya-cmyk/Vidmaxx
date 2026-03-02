import { NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/tts-service';

export async function POST(request: Request) {
    try {
        const { provider, voice, text: originalText, language } = await request.json();
        console.log('Voice Preview Request:', { provider, voice, originalText, language });

        // Generate language-specific greeting if it's a default request
        let text = originalText;
        if (text.includes("Hello, this is")) {
            const greetings: Record<string, string> = {
                'English': `Hello, this is ${voice}. I am an AI voice from ${provider}.`,
                'Spanish': `Hola, soy ${voice}. Soy una voz de inteligencia artificial de ${provider}.`,
                'German': `Hallo, ich bin ${voice}. Ich bin eine KI-Stimme von ${provider}.`,
                'French': `Bonjour, je suis ${voice}. Je suis une voix d'intelligence artificielle de ${provider}.`,
                'Japanese': `こんにちは、${voice}です。${provider}のAI音声です。`,
                'Hindi': `नमस्ते, मैं ${voice} हूँ। मैं ${provider} की एक एआई आवाज़ हूँ।`
            };
            text = greetings[language] || originalText;
        }

        const { audioBuffer, mimeType } = await synthesizeSpeech({
            text,
            language,
            voiceId: voice
        });

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache',
            },
        });

    } catch (error: any) {
        console.error('Voice preview error:', error);
        return NextResponse.json({
            error: 'TTS Generation Failed',
            details: error.message || 'Unknown error',
        }, { status: 500 });
    }
}
