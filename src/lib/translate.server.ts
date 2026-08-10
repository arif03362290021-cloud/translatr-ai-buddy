import { LANGUAGES, MAX_CHARS, AUTO_DETECT } from "./languages";

export type TranslateResult = {
  translatedText: string;
  detectedLanguage: string | null;
};

export class TranslationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const SUPPORTED = new Set(LANGUAGES.map((l) => l.code));

export function validate(input: { text: string; source: string; target: string }) {
  const text = input.text.trim();
  if (!text) throw new TranslationError("empty", "Please enter some text to translate.");
  if (text.length > MAX_CHARS)
    throw new TranslationError("too_long", `Text is too long. Limit is ${MAX_CHARS} characters.`);
  if (input.source !== AUTO_DETECT && !SUPPORTED.has(input.source))
    throw new TranslationError("unsupported", "The selected source language is not supported.");
  if (!SUPPORTED.has(input.target))
    throw new TranslationError("unsupported", "The selected target language is not supported.");
  if (input.source === input.target)
    throw new TranslationError(
      "same_language",
      "Source and target languages are the same. Please choose different languages.",
    );
  return text;
}

function nameOf(code: string) {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

/**
 * Calls the Lovable AI Gateway (OpenAI-compatible) to perform a real
 * machine translation. The API key never leaves the server.
 */
export async function translateText(input: {
  text: string;
  source: string;
  target: string;
}): Promise<TranslateResult> {
  const text = validate(input);
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new TranslationError(
      "not_configured",
      "Translation service is not configured. Please add the required API credentials.",
    );
  }

  const sourceInstruction =
    input.source === AUTO_DETECT
      ? "Automatically detect the source language."
      : `The source language is ${nameOf(input.source)}.`;

  let response: Response;
  try {
    response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a professional translation engine. " +
              sourceInstruction +
              ` Translate the user's text into ${nameOf(input.target)}.` +
              " Preserve meaning, tone, formatting and line breaks. Do not add explanations, notes or quotes." +
              ' Respond ONLY with strict JSON: {"translation": string, "detected_language_name": string}.',
          },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });
  } catch {
    throw new TranslationError(
      "network",
      "Unable to connect to the translation service. Please try again.",
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new TranslationError(
      "not_configured",
      "Translation service credentials are invalid. Please check the API configuration.",
    );
  }
  if (response.status === 429) {
    throw new TranslationError(
      "rate_limit",
      "Translation limit exceeded. Please wait a moment and try again.",
    );
  }
  if (response.status === 402) {
    throw new TranslationError(
      "credits",
      "The translation service has run out of credits. Please top up to continue.",
    );
  }
  if (!response.ok) {
    throw new TranslationError("api_error", "Translation failed. Please try again.");
  }

  let content = "";
  try {
    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    content = json.choices?.[0]?.message?.content ?? "";
  } catch {
    throw new TranslationError("api_error", "Translation failed. Please try again.");
  }
  if (!content.trim()) {
    throw new TranslationError("api_error", "Translation failed. Please try again.");
  }

  let translatedText = "";
  let detected: string | null = null;
  try {
    const parsed = JSON.parse(content) as {
      translation?: string;
      detected_language_name?: string;
    };
    translatedText = (parsed.translation ?? "").trim();
    detected = parsed.detected_language_name?.trim() || null;
  } catch {
    translatedText = content.trim();
  }

  if (!translatedText) {
    throw new TranslationError("api_error", "Translation failed. Please try again.");
  }

  return { translatedText, detectedLanguage: input.source === AUTO_DETECT ? detected : null };
}
