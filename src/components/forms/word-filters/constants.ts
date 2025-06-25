import { FilterGroup } from "./types";

export const WORD_LEVELS = [
  { value: "easy", label: "Fácil", icon: "🟢" },
  { value: "medium", label: "Medio", icon: "🟡" },
  { value: "hard", label: "Difícil", icon: "🔴" },
];

export const LANGUAGES = [
  { value: "english", label: "Inglés", icon: "🇺🇸" },
  { value: "spanish", label: "Español", icon: "🇪🇸" },
  { value: "french", label: "Francés", icon: "🇫🇷" },
  { value: "german", label: "Alemán", icon: "🇩🇪" },
  { value: "italian", label: "Italiano", icon: "🇮🇹" },
  { value: "portuguese", label: "Portugués", icon: "🇵🇹" },
];

export const WORD_TYPES = [
  { value: "noun", label: "Sustantivo" },
  { value: "verb", label: "Verbo" },
  { value: "adjective", label: "Adjetivo" },
  { value: "adverb", label: "Adverbio" },
  { value: "personal pronoun", label: "Pronombre Personal" },
  { value: "possessive pronoun", label: "Pronombre Posesivo" },
  { value: "preposition", label: "Preposición" },
  { value: "conjunction", label: "Conjunción" },
  { value: "determiner", label: "Determinante" },
  { value: "article", label: "Artículo" },
  { value: "quantifier", label: "Cuantificador" },
  { value: "interjection", label: "Interjección" },
  { value: "auxiliary verb", label: "Verbo Auxiliar" },
  { value: "modal verb", label: "Verbo Modal" },
  { value: "infinitive", label: "Infinitivo" },
  { value: "participle", label: "Participio" },
  { value: "gerund", label: "Gerundio" },
  { value: "phrasal verb", label: "Verbo Frasal" },
  { value: "other", label: "Otro" },
];

export const SORT_OPTIONS = [
  { value: "word", label: "Palabra" },
  { value: "level", label: "Nivel" },
  { value: "seen", label: "Vistas" },
  { value: "language", label: "Idioma" },
  { value: "definition", label: "Definición" },
  { value: "createdAt", label: "Fecha de Creación" },
  { value: "updatedAt", label: "Fecha de Actualización" },
];

export const SORT_ORDERS = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
];

export const BOOLEAN_FILTERS = [
  { value: "hasImage", label: "Con Imagen" },
  { value: "hasExamples", label: "Con Ejemplos" },
  { value: "hasSynonyms", label: "Con Sinónimos" },
  { value: "hasCodeSwitching", label: "Con Code-Switching" },
];

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "basic",
    label: "Filtros Básicos",
    filters: [
      { value: "level", label: "Nivel" },
      { value: "language", label: "Idioma" },
      { value: "type", label: "Tipo Gramatical" },
    ],
  },
  {
    id: "content",
    label: "Contenido",
    filters: [
      { value: "definition", label: "Definición" },
      { value: "IPA", label: "Fonética" },
      { value: "spanishWord", label: "Palabra en Español" },
      { value: "spanishDefinition", label: "Definición en Español" },
    ],
  },
  {
    id: "views",
    label: "Vistas",
    filters: [
      { value: "seenMin", label: "Mínimo de Vistas" },
      { value: "seenMax", label: "Máximo de Vistas" },
    ],
  },
  {
    id: "dates",
    label: "Fechas",
    filters: [
      { value: "createdAfter", label: "Creado Después" },
      { value: "createdBefore", label: "Creado Antes" },
      { value: "updatedAfter", label: "Actualizado Después" },
      { value: "updatedBefore", label: "Actualizado Antes" },
    ],
  },
]; 