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

export const VOICES = [
  // ── Male English Voices (Aura-1 — Free Tier) ──
  { id: "aura-zeus-en",    name: "Zeus",    gender: "Male",   language: "English", provider: "cloudflare" },
  { id: "aura-orpheus-en", name: "Orpheus", gender: "Male",   language: "English", provider: "cloudflare" },
  { id: "aura-arcas-en",   name: "Arcas",   gender: "Male",   language: "English", provider: "cloudflare" },
  { id: "aura-angus-en",   name: "Angus",   gender: "Male",   language: "English", provider: "cloudflare" },
  { id: "aura-helios-en",  name: "Helios",  gender: "Male",   language: "English", provider: "cloudflare" },
  { id: "aura-orion-en",   name: "Orion",   gender: "Male",   language: "English", provider: "cloudflare" },
  { id: "aura-perseus-en", name: "Perseus", gender: "Male",   language: "English", provider: "cloudflare" },
  // ── Female English Voices (Aura-1 — Free Tier) ──
  { id: "aura-asteria-en", name: "Asteria", gender: "Female", language: "English", provider: "cloudflare" },
  { id: "aura-luna-en",    name: "Luna",    gender: "Female", language: "English", provider: "cloudflare" },
  { id: "aura-stella-en",  name: "Stella",  gender: "Female", language: "English", provider: "cloudflare" },
  { id: "aura-athena-en",  name: "Athena",  gender: "Female", language: "English", provider: "cloudflare" },
  { id: "aura-hera-en",    name: "Hera",    gender: "Female", language: "English", provider: "cloudflare" },
  // ── Hindi Voices (Fonada) ──
  { id: "Naad",   name: "Hindi Male (Naad)",   gender: "Male",   language: "Hindi", provider: "fonada" },
  { id: "Vaanee", name: "Hindi Female (Vaanee)", gender: "Female", language: "Hindi", provider: "fonada" },
  { id: "Dhwani", name: "Hindi Female (Dhwani)", gender: "Female", language: "Hindi", provider: "fonada" },
];

// Languages supported for content generation (Gemini writes script in these)
export const SUPPORTED_LANGUAGES = [
  "English", "Hindi", "German", "French", "Spanish",
  "Portuguese", "Italian", "Japanese", "Korean"
];

export const DEEPGRAM_SUPPORTED_LANGUAGES = [
  "English", "German", "French", "Dutch", "Italian", "Japanese"
];

export const FONADA_LANGUAGES = [
  "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada"
];

// Important note in UI: voice is always English Aura-1 for non-Hindi languages.
// The script TEXT will be in the selected language but spoken by English voice.
// For native-language voice, Hindi + Fonada is the only fully supported option.
export const DEFAULT_VOICE_PER_LANGUAGE: Record<string, string> = {
  "English":    "aura-zeus-en",
  "German":     "aura-zeus-en",
  "French":     "aura-arcas-en",
  "Dutch":      "aura-zeus-en",
  "Italian":    "aura-zeus-en",
  "Japanese":   "aura-zeus-en",
  "Spanish":    "aura-zeus-en",
  "Hindi":      "Naad",
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

import { VALID_CAPTION_STYLES, type CaptionStyleId } from './caption-styles';

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
        id: 'modern',
        name: 'Modern Clean',
        description: 'Professional sans-serif with high contrast and smooth sliding.',
        font: 'Inter-Bold',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.9)',
        animation: 'slide-up',
        textTransform: 'none' as const,
        tags: ['Modern', 'Corporate', 'Clean']
    },
];

export const CAPTION_STYLE_MAP: Record<CaptionStyleId | 'default', typeof CaptionStyles[0]> = {
    hormozi: CaptionStyles[0],
    mrbeast: CaptionStyles[1],
    minimalist: CaptionStyles[2],
    neon: CaptionStyles[3],
    'red-highlight': CaptionStyles[4],
    modern: CaptionStyles[5],
    default: CaptionStyles[5], // Modern is default
};

export type MoodMusic = "calm" | "upbeat" | "dramatic" | "none";

export const VISUAL_STYLE_TO_MUSIC: Record<string, MoodMusic> = {
  "Food & Cuisine":    "calm",
  "Nature & Wildlife": "calm",
  "Nature":            "calm",
  "Technology":        "upbeat",
  "Tech":              "upbeat",
  "Sports":            "upbeat",
  "Fitness":           "upbeat",
  "Health & Wellness": "calm",
  "Health":            "calm",
  "Horror":            "dramatic",
  "Dark":              "dramatic",
  "Mystery":           "dramatic",
  "Motivational":      "upbeat",
  "Education":         "calm",
  "Travel":            "upbeat",
  "Business":          "upbeat",
  "Finance":           "upbeat",
  "Comedy":            "upbeat",
  "Fashion":           "upbeat",
  "Advertise":         "upbeat",
  "General":           "calm",
};

// Map mood to actual file in public/music/
export const MUSIC_FILE_MAP: Record<MoodMusic, string | null> = {
  calm:     "/music/bg-calm.mp3",
  upbeat:   "/music/bg-upbeat.mp3",
  dramatic: "/music/bg-dramatic.mp3",
  none:     null,
};

export const VISUAL_STYLES = [
  "Food & Cuisine", "Nature & Wildlife", "Technology", "Sports",
  "Health & Wellness", "Horror", "Dark", "Motivational", "Education",
  "Travel", "Business", "Finance", "Comedy", "Fashion", "Advertise", "General"
];
