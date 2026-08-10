import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { translateText, TranslationError } from "./translate.server";

const schema = z.object({
  text: z.string().max(20000),
  source: z.string().min(2).max(10),
  target: z.string().min(2).max(10),
});

export type TranslateResponse =
  | { ok: true; translatedText: string; detectedLanguage: string | null }
  | { ok: false; code: string; message: string };

export const translate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<TranslateResponse> => {
    try {
      const result = await translateText(data);
      return {
        ok: true,
        translatedText: result.translatedText,
        detectedLanguage: result.detectedLanguage,
      };
    } catch (error) {
      if (error instanceof TranslationError) {
        return { ok: false, code: error.code, message: error.message };
      }
      console.error("translate failed", error);
      return { ok: false, code: "server_error", message: "Translation failed. Please try again." };
    }
  });
