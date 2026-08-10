import { speechTag } from "./languages";

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function speak(text: string, languageCode: string, onEnd?: () => void): boolean {
  if (!speechSupported() || !text.trim()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const tag = speechTag(languageCode);
  utterance.lang = tag;
  const voices = window.speechSynthesis.getVoices();
  const match =
    voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(languageCode.toLowerCase()));
  if (match) utterance.voice = match;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}
