# Vidmaxx Project Architecture & Documentation

Vidmaxx is a premium AI-driven automated video creation platform designed for speed, visual excellence, and ease of use.

---

## � Project Structure

```text
vidmaxx/
├── app/                      # Next.js App Router (Routes & API)
│   ├── api/                  # Backend API Endpoints
│   │   └── voice/preview/     # Dynamic TTS synthesis proxy
│   ├── dashboard/            # Authenticated User Dashboard
│   │   ├── create/           # Multi-step video generation form
│   │   ├── series/           # User's created video series
│   │   └── videos/           # Individual video management
│   ├── (auth)/               # Login / Signup pages (Clerk)
│   ├── layout.tsx            # Root layout with Sidebar & Header
│   └── page.tsx              # Public Landing Page
├── components/               # React Components
│   ├── dashboard/            # Feature-specific dashboard components
│   │   ├── language-voice-selection.tsx
│   │   └── niche-selection.tsx
│   └── ui/                   # Shadcn UI primitives (Buttons, Inputs, etc.)
├── lib/                      # Shared Logic & Data
│   ├── constants.ts          # Central config (Voices, Languages, Niches)
│   ├── supabase.ts           # Database client initialization
│   └── utils.ts              # Tailwind styles & helper functions
├── public/                   # Static browser assets
│   ├── logo.png              # App Branding
│   └── voice/                # Static audio storage (Legacy)
├── hooks/                    # Custom React Hooks
│   └── use-mobile.ts         # Device detection logic
├── .env.local                # Private Credentials & API Keys
└── ARCHITECTURE.md           # This Documentation
```

---

## 🔑 Environment Variables (.env.local)

The following keys are required for the application to function correctly:

| Key | Usage |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint for the Supabase database. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for client-side database interaction. |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key for backend operations (Never expose on client). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for Clerk Authentication. |
| `CLERK_SECRET_KEY` | Private key for server-side auth validation. |
| `FONADAVOICE_API_KEY` | API Key for **Fonada** (Hindi/Indian AI Voices). |
| `DEEPGRAM_API_KEY` | API Key for **Deepgram** (International Conversational Voices). |

---

## 🤖 AI Models Usage

Vidmaxx leverages a combination of state-of-the-art AI models to provide a premium experience:

### 1. **Deepgram Aura-2**
- **Usage**: Global Text-to-Speech (English, Spanish, French, etc.)
- **Why**: Extreme low-latency and high conversational realism. It makes the AI sound like a real person during previews and video generation.

### 2. **Fonada TTS**
- **Usage**: Specialized Indian / Hindi Voices.
- **Why**: Provides the most authentic Indian accents and regional language support with emotional inflection.

### 3. **Google Gemini 1.5 Flash** (Planned)
- **Usage**: Content Generation & Scriptwriting.
- **Why**: High context window and speed, allowing for long-form scripts and deep niche analysis in seconds.

---

## 🧩 Architectural Highlights

### The TTS Proxy Gateway
To prevent leaking expensive API keys, the frontend **never** calls Deepgram or Fonada directly. Instead:
1. The UI calls `/api/voice/preview`.
2. The server script verifies the session and proxies the request using the private API key.
3. The server streams the audio back to the browser as a binary blob.

### Multi-Step State Management
The 6-step video creation form uses a **Lifting State Up** pattern in `app/dashboard/create/page.tsx`. This ensures that data from "Niche Selection" survives when the user moves to "Voice Selection", and allows for a "Back" button that remembers previous choices.
