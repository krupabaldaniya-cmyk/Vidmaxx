export const Languages = [
    {
        language: "English",
        countryCode: "US",
        countryFlag: "🇺🇸",
        modelName: "deepgram",
        modelLangCode: "en-US",
    },
    {
        language: "Spanish",
        countryCode: "MX",
        countryFlag: "🇲🇽",
        modelName: "deepgram",
        modelLangCode: "es-MX",
    },
    {
        language: "German",
        countryCode: "DE",
        countryFlag: "🇩🇪",
        modelName: "deepgram",
        modelLangCode: "de-DE",
    },
    {
        language: "Hindi",
        countryCode: "IN",
        countryFlag: "🇮🇳",
        modelName: "fonadalab",
        modelLangCode: "hi-IN",
    },
    {
        language: "French",
        countryCode: "FR",
        countryFlag: "🇫🇷",
        modelName: "deepgram",
        modelLangCode: "fr-FR",
    },
    {
        language: "Japanese",
        countryCode: "JP",
        countryFlag: "🇯🇵",
        modelName: "deepgram",
        modelLangCode: "ja-JP",
    },
];

export const DeepgramVoices = [
    // English (US) - Aura 2 Voices (Latest Canonical Names)
    { model: "deepgram", modelName: "aura-2-apollo-en", name: "Apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", language: "English" },
    { model: "deepgram", modelName: "aura-2-andromeda-en", name: "Andromeda", preview: "/voice/deepgram-aura-2-andromeda-en.wav", gender: "female", language: "English" },
    { model: "deepgram", modelName: "aura-2-thalia-en", name: "Thalia", preview: "/voice/deepgram-aura-2-thalia-en.wav", gender: "female", language: "English" },
    { model: "deepgram", modelName: "aura-2-amalthea-en", name: "Amalthea", preview: "/voice/deepgram-aura-2-amalthea-en.wav", gender: "female", language: "English" },
    { model: "deepgram", modelName: "aura-2-odysseus-en", name: "Odysseus", preview: "/voice/deepgram-aura-2-odysseus-en.wav", gender: "male", language: "English" },

    // Spanish (MX) - Aura 2 Voices (Latest Canonical Names)
    { model: "deepgram", modelName: "aura-2-alvaro-es", name: "Alvaro", preview: "/voice/deepgram-aura-2-alvaro-es.wav", gender: "male", language: "Spanish" },
    { model: "deepgram", modelName: "aura-2-estrella-es", name: "Estrella", preview: "/voice/deepgram-aura-2-luna-es.wav", gender: "female", language: "Spanish" },
    { model: "deepgram", modelName: "aura-2-nestor-es", name: "Nestor", preview: "/voice/deepgram-aura-2-nestor-es.wav", gender: "male", language: "Spanish" },
    { model: "deepgram", modelName: "aura-2-celeste-es", name: "Celeste", preview: "/voice/deepgram-aura-2-celeste-es.wav", gender: "female", language: "Spanish" },

    // German (DE) - Fallback to working English models 
    { model: "deepgram", modelName: "aura-2-apollo-en", name: "Apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", language: "German" },
    { model: "deepgram", modelName: "aura-2-thalia-en", name: "Thalia", preview: "/voice/deepgram-aura-2-thalia-en.wav", gender: "female", language: "German" },

    // French (FR) - Fallback to working English models
    { model: "deepgram", modelName: "aura-2-odysseus-en", name: "Odysseus", preview: "/voice/deepgram-aura-2-odysseus-en.wav", gender: "male", language: "French" },
    { model: "deepgram", modelName: "aura-2-andromeda-en", name: "Andromeda", preview: "/voice/deepgram-aura-2-andromeda-en.wav", gender: "female", language: "French" },

    // Japanese (JP) - Fallback to working English models
    { model: "deepgram", modelName: "aura-2-apollo-en", name: "Apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", language: "Japanese" },
    { model: "deepgram", modelName: "aura-2-andromeda-en", name: "Andromeda", preview: "/voice/deepgram-aura-2-andromeda-en.wav", gender: "female", language: "Japanese" },
];

export const FonadalabVoices = [
    {
        model: "fonadalab",
        modelName: "Vaanee",
        name: "Vaanee",
        preview: "/voice/fonadalab-Vaanee.mp3",
        gender: "female",
        language: "Hindi"
    }
];

// Strict Voice Mapping Configuration
export const VOICE_MAP: Record<string, { provider: "deepgram" | "fondalabs"; voices: Record<string, string>; modelLangCode: string }> = {
    // Deepgram Languages (Aura)
    English: {
        provider: "deepgram",
        modelLangCode: "en-US",
        voices: {
            "aura-2-apollo-en": "aura-2-apollo-en",
            "aura-2-andromeda-en": "aura-2-andromeda-en",
            "aura-2-thalia-en": "aura-2-thalia-en",
            "aura-2-amalthea-en": "aura-2-amalthea-en",
            "aura-2-odysseus-en": "aura-2-odysseus-en"
        }
    },
    Spanish: {
        provider: "deepgram",
        modelLangCode: "es-MX",
        voices: {
            "aura-2-alvaro-es": "aura-2-alvaro-es",
            "aura-2-estrella-es": "aura-2-estrella-es",
            "aura-2-nestor-es": "aura-2-nestor-es",
            "aura-2-celeste-es": "aura-2-celeste-es"
        }
    },
    French: {
        provider: "deepgram",
        modelLangCode: "fr-FR",
        voices: {
            "aura-2-odysseus-en": "aura-2-odysseus-en",
            "aura-2-andromeda-en": "aura-2-andromeda-en"
        }
    },
    German: {
        provider: "deepgram",
        modelLangCode: "de-DE",
        voices: {
            "aura-2-apollo-en": "aura-2-apollo-en",
            "aura-2-thalia-en": "aura-2-thalia-en"
        }
    },
    Japanese: {
        provider: "deepgram",
        modelLangCode: "ja-JP",
        voices: {
            "aura-2-apollo-en": "aura-2-apollo-en",
            "aura-2-andromeda-en": "aura-2-andromeda-en"
        }
    },

    // FondaLabs Languages - Only supported voices from API
    Hindi: {
        provider: "fondalabs",
        modelLangCode: "Hindi",
        voices: {
            "Vaanee": "Vaanee"
        }
    }
};

// Background Music Options
export const BackgroundMusic = [
    {
        id: 'zen',
        name: 'That Zen Moment',
        description: 'Peaceful and calm atmosphere for meditation or relaxing content.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/That%20Zen%20Moment.mp3',
        tags: ['Zen', 'Chill', 'Calm']
    },
    {
        id: 'horror-1',
        name: 'Horror Atmosphere',
        description: 'Tense and scary background for horror stories or mystery.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/delosound-scary-horror-music-horror-483782.mp3',
        tags: ['Horror', 'Scary', 'Mystery']
    },
    {
        id: 'ai-promo',
        name: 'AI Promo',
        description: 'Modern, tech-focused beat perfect for digital promotions.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/alisiabeats-ai-promo-469594.mp3',
        tags: ['Tech', 'Promo', 'Digital']
    },
    {
        id: 'corporate',
        name: 'Corporate Pulse',
        description: 'Professional and driving background for business or explanations.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/paulyudin-background-music-478744.mp3',
        tags: ['Corporate', 'Business', 'Steady']
    },
    {
        id: 'motivational-1',
        name: 'Inspirational Spirit',
        description: 'Uplifting and emotional music for motivational series.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/mfcc-inspirational-inspirational-motivational-music-357760.mp3',
        tags: ['Inspiring', 'Success', 'Uplifting']
    },
    {
        id: 'chill-vibes',
        name: 'Chill Vibes',
        description: 'Modern, catchy chill music for lifestyle or casual content.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/loksii-no-copyright-music-211881.mp3',
        tags: ['Modern', 'Catchy', 'Lifestyle']
    },
    {
        id: 'motivational-2',
        name: 'Motivational Power',
        description: 'High-energy and inspiring tracks for peak achievement.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/tatamusic-motivational-motivation-music-485391.mp3',
        tags: ['Energy', 'Power', 'Goal']
    },
    {
        id: 'health',
        name: 'Healthy Living',
        description: 'Soft and rejuvenating music for health or wellness tips.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/nastelbom-health-344166.mp3',
        tags: ['Health', 'Wellness', 'Soft']
    },
    {
        id: 'horror-2',
        name: 'Dark Horror',
        description: 'Deep, dark, and uncomfortable music for suspense.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/lnplusmusic-scary-horror-dark-music-372674.mp3',
        tags: ['Dark', 'Suspense', 'Deep']
    },
    {
        id: 'epic-fantasy',
        name: 'Lord of the Rangs',
        description: 'Grand, epic cinematic orchestral for heroic stories.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/Lord%20of%20the%20Rangs.mp3',
        tags: ['Epic', 'Fantasy', 'Orchestral']
    },
    {
        id: 'tech-news',
        name: 'Tech Breaking News',
        description: 'Fast-paced, high-tech news reporting style music.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/sonican-breaking-news-club-tech-version-479440.mp3',
        tags: ['Tech', 'News', 'Fast']
    },
    {
        id: 'tech-logo',
        name: 'Digital Momentum',
        description: 'Short, impactful tech logos for quick news or intros.',
        preview: 'https://ik.imagekit.io/ngahngoejw/Bg%20Music/absounds-tech-news-logo-311346.mp3',
        tags: ['Intro', 'Digital', 'Quick']
    }
];

// Video Style Options
export const VideoStyles = [
    {
        id: 'cinematic',
        name: 'Cinematic',
        description: 'Dramatic, high-contrast visuals with a moody cinematic feel.',
        preview: '/video_Style/darksouls1-gothic-1282594_1920.jpg',
        tags: ['Dramatic', 'Moody', 'Epic']
    },
    {
        id: 'ai-fantasy',
        name: 'AI Fantasy',
        description: 'Vibrant AI-generated art with surreal, dream-like aesthetics.',
        preview: '/video_Style/artvizual-fantasy-7529695_1920.jpg',
        tags: ['Creative', 'Artistic', 'Surreal']
    },
    {
        id: 'nature',
        name: 'Nature & Wildlife',
        description: 'Breathtaking natural landscapes and outdoor scenery.',
        preview: '/video_Style/alan_frijns-river-7500096_1920.jpg',
        tags: ['Nature', 'Calm', 'Organic']
    },
    {
        id: 'tech-futuristic',
        name: 'Tech & Future',
        description: 'Cutting-edge technology visuals with a futuristic vibe.',
        preview: '/video_Style/techmanic-ai-8420360_1920.jpg',
        tags: ['Tech', 'Digital', 'Innovation']
    },
    {
        id: 'ai-digital',
        name: 'AI Digital Art',
        description: 'Modern AI-generated imagery for tech and digital content.',
        preview: '/video_Style/alexandra_koch-ai-7977960_1920.jpg',
        tags: ['AI', 'Digital', 'Vibrant']
    },
    {
        id: 'urban',
        name: 'Urban & City',
        description: 'Dynamic city scenes and urban architecture.',
        preview: '/video_Style/geralt-city-3317493_1920.jpg',
        tags: ['Urban', 'City', 'Modern']
    },
    {
        id: 'horror-dark',
        name: 'Horror & Dark',
        description: 'Eerie, unsettling visuals perfect for horror stories.',
        preview: '/video_Style/creatifrankenstein-skull-4248008_1920.jpg',
        tags: ['Horror', 'Dark', 'Eerie']
    },
    {
        id: 'mysterious',
        name: 'Mysterious',
        description: 'Atmospheric abandoned places and enigmatic environments.',
        preview: '/video_Style/652234-lost-places-1798611_1920.jpg',
        tags: ['Mystery', 'Abandoned', 'Atmospheric']
    },
    {
        id: 'wildlife',
        name: 'Animals & Wildlife',
        description: 'Beautiful creature photography for nature content.',
        preview: '/video_Style/alan_frijns-chicken-7627629_1920.jpg',
        tags: ['Animals', 'Wildlife', 'Nature']
    },
    {
        id: 'portrait',
        name: 'Portrait & People',
        description: 'Professional portrait photography with rich character.',
        preview: '/video_Style/claudio_scott-woman-7781266_1920.jpg',
        tags: ['Portrait', 'People', 'Emotion']
    },
    {
        id: 'sci-space',
        name: 'Space & Cosmos',
        description: 'Awe-inspiring space and telescope photography.',
        preview: '/video_Style/hans-telescope-187472_1920.jpg',
        tags: ['Space', 'Science', 'Cosmos']
    },
    {
        id: 'tech-engineering',
        name: 'Engineering & Science',
        description: 'Professional engineering and scientific visuals.',
        preview: '/video_Style/this_is_engineering-engineer-4922418_1920.jpg',
        tags: ['Engineering', 'Science', 'Professional']
    },
    {
        id: 'fantasy-owl',
        name: 'Fantasy & Magic',
        description: 'Mystical, enchanting visuals with a magical quality.',
        preview: '/video_Style/artvizual-owl-7431340_1920.jpg',
        tags: ['Magic', 'Fantasy', 'Mystical']
    },
    {
        id: 'sunset-landscape',
        name: 'Sunset & Landscape',
        description: 'Golden hour scenic landscapes with warm tones.',
        preview: '/video_Style/c1ri-sunset-3875817_1920.jpg',
        tags: ['Sunset', 'Warm', 'Scenic']
    },
    {
        id: 'health-fitness',
        name: 'Health & Fitness',
        description: 'Energetic visuals for wellness and fitness content.',
        preview: '/video_Style/ryanmcguire-stretching-498256_1280.jpg',
        tags: ['Health', 'Fitness', 'Energy']
    },
    {
        id: 'food',
        name: 'Food & Cuisine',
        description: 'Appetizing food photography for culinary content.',
        preview: '/video_Style/susan-lu4esm-burger-7690927_1920.jpg',
        tags: ['Food', 'Culinary', 'Lifestyle']
    },
    {
        id: 'sports',
        name: 'Sports & Action',
        description: 'High-energy sports visuals for athletic content.',
        preview: '/video_Style/marijana1-tennis-3554019_1920.jpg',
        tags: ['Sports', 'Action', 'Energy']
    },
    {
        id: 'motivation-people',
        name: 'Motivational',
        description: 'Inspiring human-focused visuals for motivational content.',
        preview: '/video_Style/alexas_fotos-self-confidence-2121159_1920.jpg',
        tags: ['Motivation', 'Inspiring', 'Human']
    },
];

// Caption Style Options
export const CaptionStyles = [
    {
        id: 'hormozi',
        name: 'High Impact',
        description: 'Large, colorful text with pop-in animation (Hormozi style).',
        font: 'Inter-Black',
        color: '#facc15', // Yellow
        backgroundColor: 'rgba(0,0,0,0.85)',
        animation: 'pop',
        textTransform: 'uppercase' as const,
        tags: ['Viral', 'High Energy', 'Bold']
    },
    {
        id: 'mrbeast',
        name: 'Bold Emphasis',
        description: 'Heavy strokes and bounce animation for maximum focus.',
        font: 'Inter-ExtraBold',
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: '4px',
        animation: 'bounce',
        textTransform: 'uppercase' as const,
        tags: ['Attention', 'Modern', 'Gaming']
    },
    {
        id: 'minimalist',
        name: 'Clean Minimal',
        description: 'Elegant white text with subtle shadow and fade animation.',
        font: 'Inter-Medium',
        color: '#ffffff',
        animation: 'fade',
        textTransform: 'none' as const,
        tags: ['Professional', 'Calm', 'Clean']
    },
    {
        id: 'neon',
        name: 'Cyberpunk Neon',
        description: 'Neon glow aesthetics with a subtle flicker effect.',
        font: 'Inter-Bold',
        color: '#00f2ff',
        glowColor: 'rgba(0, 242, 255, 0.6)',
        animation: 'flicker',
        textTransform: 'uppercase' as const,
        tags: ['Neon', 'Future', 'Tech']
    },
    {
        id: 'red-highlight',
        name: 'Red Highlight',
        description: 'Bold text with energetic red background highlights.',
        font: 'Inter-Black',
        color: '#ffffff',
        backgroundColor: '#ef4444',
        animation: 'slide-up',
        textTransform: 'uppercase' as const,
        tags: ['Energetic', 'Action', 'Alert']
    },
    {
        id: 'classic',
        name: 'Classic Subtitles',
        description: 'Standard, non-intrusive subtitling style.',
        font: 'Roboto-Medium',
        color: '#ffffff',
        animation: 'scale',
        textTransform: 'none' as const,
        tags: ['Traditional', 'Simple', 'Readable']
    },
];
