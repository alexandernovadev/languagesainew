/**
 * Maps language codes (en, es, pt, fr) to BCP 47 locales for Speech Synthesis API.
 * Used by TTS/speaker functionality across the app.
 */
const LANG_TO_LOCALE: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
};

export function getSpeechLocale(lang?: string | null): string {
  if (!lang) return "en-US";
  return LANG_TO_LOCALE[lang] || LANG_TO_LOCALE.en || "en-US";
}
