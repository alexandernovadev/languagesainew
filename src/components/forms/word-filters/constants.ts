import { FilterGroup } from "./types";

export const WORD_LEVELS = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difícil" },
];

export const LANGUAGES = [
  { value: 'es', label: 'Español', icon: '🇪🇸' },
  { value: 'en', label: 'Inglés', icon: '🇬🇧' },
  { value: 'pt', label: 'Portugués', icon: '🇵🇹' },
];

export const WORD_TYPES = [
  { value: "noun", label: "Noun", spanishLabel: "Sustantivo" },
  { value: "verb", label: "Verb", spanishLabel: "Verbo" },
  { value: "adjective", label: "Adjective", spanishLabel: "Adjetivo" },
  { value: "adverb", label: "Adverb", spanishLabel: "Adverbio" },
  { value: "personal pronoun", label: "Personal Pronoun", spanishLabel: "Pronombre Personal" },
  { value: "possessive pronoun", label: "Possessive Pronoun", spanishLabel: "Pronombre Posesivo" },
  { value: "preposition", label: "Preposition", spanishLabel: "Preposición" },
  { value: "conjunction", label: "Conjunction", spanishLabel: "Conjunción" },
  { value: "determiner", label: "Determiner", spanishLabel: "Determinante" },
  { value: "article", label: "Article", spanishLabel: "Artículo" },
  { value: "quantifier", label: "Quantifier", spanishLabel: "Cuantificador" },
  { value: "interjection", label: "Interjection", spanishLabel: "Interjección" },
  { value: "auxiliary verb", label: "Auxiliary Verb", spanishLabel: "Verbo Auxiliar" },
  { value: "modal verb", label: "Modal Verb", spanishLabel: "Verbo Modal" },
  { value: "infinitive", label: "Infinitive", spanishLabel: "Infinitivo" },
  { value: "participle", label: "Participle", spanishLabel: "Participio" },
  { value: "gerund", label: "Gerund", spanishLabel: "Gerundio" },
  { value: "phrasal verb", label: "Phrasal Verb", spanishLabel: "Verbo Frasal" },
  { value: "other", label: "Other", spanishLabel: "Otro" },
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
