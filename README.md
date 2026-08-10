# AI Language Translation Tool

## Project Overview

A production-ready web application that translates text between 28+ languages using a real
AI translation API. The app provides source/target language selection (including automatic
language detection), a live character counter, language swapping, copy-to-clipboard,
text-to-speech, downloadable translations, local translation history, and a dark/light theme.

## CodeAlpha Internship

**Task 1: Language Translation Tool** — CodeAlpha Artificial Intelligence Internship.

## Features

- Enter text and translate it instantly (max 5,000 characters)
- Source language selection with a **Detect Language** option
- Target language selection from 28+ languages
- **Real translation API** call through a secure server function (no mock data)
- Loading state, success toast, and friendly error handling for every failure mode
- **Copy Translation** button with confirmation
- **Listen** button (Web Speech API) with Stop control and target-language voice matching
- **Download** the translation as a `.txt` file
- **Swap languages** (swaps text as well when a translation exists)
- **Clear** button and character counter
- **Translation history** stored locally, with reuse and delete
- Example prompts, dark/light theme toggle
- Fully responsive (mobile, tablet, laptop, desktop) and accessible

## Technologies Used

- React 19 + TypeScript
- TanStack Start (SSR framework) + TanStack Router / Query
- Vite 7
- Tailwind CSS v4 + shadcn/ui components
- Lucide icons, Sonner toasts, Zod validation
- Web Speech API (text-to-speech)
- Server functions (`createServerFn`) as the secure backend layer

## Translation API

Translation is performed by the **Lovable AI Gateway** (`https://ai.gateway.lovable.dev/v1/chat/completions`),
an OpenAI-compatible endpoint, using the `google/gemini-3-flash-preview` model as the
translation engine. The request is made **only from the server** in
`src/lib/translate.server.ts`; the API key is never sent to the browser.

The same architecture works with Google Cloud Translation API or Microsoft Translator —
only the `fetch` call inside `translateText()` would change.

## Supported Languages

English, Urdu, Pashto, Arabic, Hindi, Bengali, Punjabi, Persian, Turkish, French, German,
Spanish, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Indonesian, Malay, Dutch,
Polish, Ukrainian, Swahili, Tamil, Telugu, Thai, Vietnamese — plus automatic detection.

## How the Translation Process Works

```text
User Input
   -> Source Language (or Detect Language)
   -> Target Language
   -> Secure Backend (server function: src/lib/translate.functions.ts)
   -> Translation API (Lovable AI Gateway, key from environment)
   -> Translated Response (JSON: translation + detected language)
   -> User Interface (display, copy, listen, download, history)
```

## Installation

```bash
git clone <repository-url>
cd ai-language-translator
bun install     # or: npm install
```

## Environment Variables

| Variable           | Where it is used                 | Purpose                             |
| ------------------ | -------------------------------- | ----------------------------------- |
| `LOVABLE_API_KEY`  | Server only (`process.env`)      | Authenticates calls to the AI Gateway |

The key is read inside the server handler and is never exposed to the client bundle.
On Lovable it is provisioned automatically; locally, create a `.env` file:

```
LOVABLE_API_KEY=your_key_here
```

If the key is missing the app shows: *"Translation service is not configured. Please add the
required API credentials."* — it never fakes a translation.

### Using Google Cloud Translation instead

1. Enable the Cloud Translation API in Google Cloud Console and create an API key.
2. Store it as `GOOGLE_TRANSLATE_API_KEY` (server-side secret).
3. In `src/lib/translate.server.ts`, replace the gateway `fetch` with:
   `POST https://translation.googleapis.com/language/translate/v2?key=${process.env['GOOGLE_TRANSLATE_API_KEY']}`
   with body `{ q, source, target, format: "text" }` and read
   `data.translations[0].translatedText`.

## How to Run Locally

```bash
bun run dev      # http://localhost:8080
```

## How to Deploy

Click **Publish** in Lovable, or build and deploy the output of `bun run build` to any
platform that supports TanStack Start (Cloudflare Workers, Vercel, Netlify). Configure
`LOVABLE_API_KEY` as an environment secret on the hosting platform.

## API Setup Instructions

1. Obtain a translation API credential (Lovable AI key, Google Cloud API key, or Azure
   Translator key).
2. Save it as an environment secret — never in source code.
3. Restart the server so the secret is loaded.
4. Open the app and run a test translation (e.g. English → Urdu).

## Project Structure

```text
src/
  components/translator/   UI components (Translator, LanguageSelect, HistoryList, ThemeToggle)
  lib/languages.ts         Language configuration, codes, RTL and speech tags
  lib/translate.server.ts  Translation service + validation (server-only)
  lib/translate.functions.ts  Secure server function endpoint
  lib/history.ts           Local history management
  lib/speech.ts            Text-to-speech logic
  lib/download.ts          Copy + download utilities
  routes/index.tsx         Page layout
```

## Screenshots

_Add screenshots of the desktop and mobile views here._

## Future Improvements

- Document (PDF/DOCX) translation
- Speech-to-text input
- Cloud-synced history with user accounts
- Glossary and tone controls (formal/informal)

## Author

**Syed Arif Shah**
BS Computer Science Student
AI Enthusiast / Future AI Engineer
