import { QuestionFilters } from "@/models/Question";

export interface QuestionFiltersState {
  // Filtros básicos
  level?: string;
  type?: string;
  topic?: string;
  difficulty?: string;

  // Filtros de contenido
  tags?: string;
  hasMedia?: string;

  // Filtros avanzados
  createdAfter?: string;
  createdBefore?: string;

  // Ordenamiento
  sortBy?: "createdAt" | "updatedAt" | "text" | "level" | "type" | "difficulty";
  sortOrder?: "asc" | "desc";
}

export interface QuestionBooleanFilters {
  hasMedia: boolean;
  [key: string]: boolean;
}

export interface QuestionFiltersProps {
  onFiltersChange: (filters: Partial<QuestionFilters>) => void;
  className?: string;
}
