import { useState, useEffect } from "react";
import { useExpressionStore } from "@/lib/store/useExpressionStore";

export function useExpressionFilters() {
  const { filters, setFilters } = useExpressionStore();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  useEffect(() => {
    const count = Object.values(filters).filter((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const getActiveFiltersDescription = () => {
    const activeFilters = [];

    if (filters.difficulty) {
      const difficulties = Array.isArray(filters.difficulty)
        ? filters.difficulty
        : [filters.difficulty];
      activeFilters.push(`Nivel: ${difficulties.join(", ")}`);
    }

    if (filters.language) {
      const languages = Array.isArray(filters.language)
        ? filters.language
        : [filters.language];
      activeFilters.push(`Idioma: ${languages.join(", ")}`);
    }

    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      activeFilters.push(`Tipo: ${types.join(", ")}`);
    }

    if (filters.hasImage) {
      activeFilters.push(
        `Imagen: ${filters.hasImage === "true" ? "Sí" : "No"}`
      );
    }

    if (filters.hasExamples) {
      activeFilters.push(
        `Ejemplos: ${filters.hasExamples === "true" ? "Sí" : "No"}`
      );
    }

    if (filters.expression) {
      activeFilters.push(`Expresión: "${filters.expression}"`);
    }

    if (filters.definition) {
      activeFilters.push(`Definición: "${filters.definition}"`);
    }

    if (filters.context) {
      activeFilters.push(`Contexto: "${filters.context}"`);
    }

    if (filters.spanishExpression) {
      activeFilters.push(`Español: "${filters.spanishExpression}"`);
    }

    if (filters.spanishDefinition) {
      activeFilters.push(`Def. Español: "${filters.spanishDefinition}"`);
    }

    if (filters.createdAfter || filters.createdBefore) {
      const dateRange = [];
      if (filters.createdAfter)
        dateRange.push(`Desde: ${filters.createdAfter}`);
      if (filters.createdBefore)
        dateRange.push(`Hasta: ${filters.createdBefore}`);
      activeFilters.push(`Fecha: ${dateRange.join(" - ")}`);
    }

    return activeFilters.join(", ");
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    setFilters,
    activeFiltersCount,
    getActiveFiltersDescription,
    clearFilters,
  };
}
