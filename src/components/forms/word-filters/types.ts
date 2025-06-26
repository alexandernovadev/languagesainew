export interface WordFilters {
  // Filtros básicos
  wordUser?: string;
  level?: string; // "easy" | "medium" | "hard" | "easy,medium" | etc.
  language?: string; // "english" | "spanish" | "english,spanish" | etc.
  type?: string; // "verb" | "noun" | "verb,noun" | etc.

  // Filtros de contenido
  definition?: string;
  IPA?: string;
  spanishWord?: string;
  spanishDefinition?: string;

  // Filtros de vistas
  seenMin?: number;
  seenMax?: number;

  // Filtros booleanos
  hasImage?: boolean;
  hasExamples?: boolean;
  hasSynonyms?: boolean;
  hasCodeSwitching?: boolean;

  // Filtros de fecha
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;

  // Ordenamiento
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "word"
    | "level"
    | "seen"
    | "language"
    | "definition";
  sortOrder?: "asc" | "desc";

  // Paginación
  page?: number;
  limit?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  filters: FilterOption[];
}
