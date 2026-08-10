export type Language = { code: string; name: string; native?: string; rtl?: boolean };

export const AUTO_DETECT = "auto";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "ur", name: "Urdu", native: "اردو", rtl: true },
  { code: "ps", name: "Pashto", native: "پښتو", rtl: true },
  { code: "ar", name: "Arabic", native: "العربية", rtl: true },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "fa", name: "Persian", native: "فارسی", rtl: true },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
];

export const MAX_CHARS = 5000;

export function languageName(code: string): string {
  if (code === AUTO_DETECT) return "Detect Language";
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

export function isRtl(code: string): boolean {
  return LANGUAGES.find((l) => l.code === code)?.rtl ?? false;
}

/** BCP-47 tag used for speech synthesis voice selection. */
export function speechTag(code: string): string {
  const map: Record<string, string> = {
    en: "en-US",
    ur: "ur-PK",
    ps: "ps-AF",
    ar: "ar-SA",
    hi: "hi-IN",
    bn: "bn-BD",
    pa: "pa-IN",
    fa: "fa-IR",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
    pt: "pt-BR",
    ms: "ms-MY",
    id: "id-ID",
    sw: "sw-KE",
    ta: "ta-IN",
    te: "te-IN",
    th: "th-TH",
    vi: "vi-VN",
    uk: "uk-UA",
  };
  return map[code] ?? code;
}

export const EXAMPLES = [
  "Good morning! I hope you have a wonderful day ahead.",
  "Artificial intelligence is transforming the way we communicate.",
  "Could you please tell me the way to the nearest railway station?",
  "Thank you for your help. I really appreciate it.",
];
