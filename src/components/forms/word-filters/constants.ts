import { FilterGroup } from "./types";
import { WORD_TYPES as BASE_WORD_TYPES } from "@/utils/constants/wordTypes";

export const WORD_LEVELS = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difícil" },
];

export const LANGUAGES = [
  { value: "es", label: "Español", icon: "🇪🇸" },
  { value: "en", label: "Inglés", icon: "🇬🇧" },
  { value: "fr", label: "Francés", icon: "🇫🇷" },
  { value: "de", label: "Alemán", icon: "🇩🇪" },
  { value: "it", label: "Italiano", icon: "🇮🇹" },
  { value: "pt", label: "Portugués", icon: "🇵🇹" },
];

// Usar las constantes centralizadas en lugar de duplicar
export const WORD_TYPES_FOR_FILTERS = BASE_WORD_TYPES.map(type => ({
  value: type.key,
  label: type.key, // Usar la clave como label para consistencia
  spanishLabel: type.label
}));

// Alias para compatibilidad con componentes que importan { WORD_TYPES } de este módulo
export { WORD_TYPES_FOR_FILTERS as WORD_TYPES };

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
