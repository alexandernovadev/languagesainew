import type { WordType } from "@/types/business";

/**
 * Etiquetas por idioma de interfaz (`user.language` en perfil). Valores en BD: canónicos.
 */
export const WORD_TYPE_LABEL_LOCALES = ["es", "en", "fr", "it", "pt"] as const;
export type WordTypeLabelLocale = (typeof WORD_TYPE_LABEL_LOCALES)[number];

const ES: Record<WordType, string> = {
  noun: "Sustantivo",
  verb: "Verbo",
  "auxiliary verb": "Verbo auxiliar",
  "modal verb": "Verbo modal",
  "phrasal verb": "Verbo frasal",
  infinitive: "Infinitivo",
  participle: "Participio",
  gerund: "Gerundio",
  adjective: "Adjetivo",
  adverb: "Adverbio",
  pronoun: "Pronombre",
  preposition: "Preposición",
  conjunction: "Conjunción",
  determiner: "Determinante",
  interjection: "Interjección",
  particle: "Partícula",
};

const EN: Record<WordType, string> = {
  noun: "Noun",
  verb: "Verb",
  "auxiliary verb": "Auxiliary verb",
  "modal verb": "Modal verb",
  "phrasal verb": "Phrasal verb",
  infinitive: "Infinitive",
  participle: "Participle",
  gerund: "Gerund",
  adjective: "Adjective",
  adverb: "Adverb",
  pronoun: "Pronoun",
  preposition: "Preposition",
  conjunction: "Conjunction",
  determiner: "Determiner",
  interjection: "Interjection",
  particle: "Particle",
};

const FR: Record<WordType, string> = {
  noun: "Nom",
  verb: "Verbe",
  "auxiliary verb": "Verbe auxiliaire",
  "modal verb": "Verbe modal",
  "phrasal verb": "Verbe à particule",
  infinitive: "Infinitif",
  participle: "Participe",
  gerund: "Gérondif",
  adjective: "Adjectif",
  adverb: "Adverbe",
  pronoun: "Pronom",
  preposition: "Préposition",
  conjunction: "Conjonction",
  determiner: "Déterminant",
  interjection: "Interjection",
  particle: "Particule",
};

const IT: Record<WordType, string> = {
  noun: "Sostantivo",
  verb: "Verbo",
  "auxiliary verb": "Verbo ausiliare",
  "modal verb": "Verbo modale",
  "phrasal verb": "Frase verbale",
  infinitive: "Infinito",
  participle: "Participio",
  gerund: "Gerundio",
  adjective: "Aggettivo",
  adverb: "Avverbio",
  pronoun: "Pronome",
  preposition: "Preposizione",
  conjunction: "Congiunzione",
  determiner: "Determinante",
  interjection: "Interiezione",
  particle: "Particella",
};

const PT: Record<WordType, string> = {
  noun: "Substantivo",
  verb: "Verbo",
  "auxiliary verb": "Verbo auxiliar",
  "modal verb": "Verbo modal",
  "phrasal verb": "Verbo frasal",
  infinitive: "Infinitivo",
  participle: "Particípio",
  gerund: "Gerúndio",
  adjective: "Adjetivo",
  adverb: "Advérbio",
  pronoun: "Pronome",
  preposition: "Preposição",
  conjunction: "Conjunção",
  determiner: "Determinante",
  interjection: "Interjeição",
  particle: "Partícula",
};

const LABELS_BY_LOCALE: Record<WordTypeLabelLocale, Record<WordType, string>> = {
  es: ES,
  en: EN,
  fr: FR,
  it: IT,
  pt: PT,
};

export function resolveWordTypeLabelLocale(
  locale: string | undefined | null
): WordTypeLabelLocale {
  if (
    locale &&
    (WORD_TYPE_LABEL_LOCALES as readonly string[]).includes(locale)
  ) {
    return locale as WordTypeLabelLocale;
  }
  return "es";
}

/** Etiqueta para mostrar; `type` es el valor canónico guardado en BD. */
export function getWordTypeLabel(
  type: string,
  locale: string | undefined | null
): string {
  const l = resolveWordTypeLabelLocale(locale);
  const map = LABELS_BY_LOCALE[l];
  if (type in map) {
    return map[type as WordType];
  }
  return type;
}
