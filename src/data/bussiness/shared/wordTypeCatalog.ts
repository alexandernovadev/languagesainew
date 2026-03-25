import type { WordType } from "@/types/business";
import { wordTypesList } from "./wordTypes";

const ENGLISH_SPECIFIC: WordType[] = ["phrasal verb"];

const NOT_IN_PORTUGUESE: WordType[] = ["modal verb", "phrasal verb"];

/** Tipos gramaticales permitidos para el idioma de la palabra o del mazo (misma regla que el back). */
export function getWordTypesForLanguage(language: string): WordType[] {
  if (language === "en") {
    return [...wordTypesList];
  }
  if (language === "pt") {
    return wordTypesList.filter((t) => !NOT_IN_PORTUGUESE.includes(t));
  }
  return wordTypesList.filter((t) => !ENGLISH_SPECIFIC.includes(t));
}
