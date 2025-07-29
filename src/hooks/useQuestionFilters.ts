import { useState, useMemo, useEffect } from "react";
import {
  QuestionFiltersState,
  QuestionBooleanFilters,
} from "@/components/forms/question-filters/types";
import { useQuestionStore } from "@/lib/store/useQuestionStore";

export function useQuestionFilters() {
  const { currentFilters } = useQuestionStore();

  const [filters, setFilters] = useState<QuestionFiltersState>({});
  const [booleanFilters, setBooleanFilters] = useState<QuestionBooleanFilters>({
    hasMedia: false,
  });

  // Sincronizar con los filtros del store
  useEffect(() => {
    // Siempre actualizar los filtros locales con los del store
    setFilters(currentFilters || {});
  }, [currentFilters]);

  // Combinar filtros normales con booleanos
  const combinedFilters = useMemo(() => {
    const combined = { ...filters };

    // Convertir booleanos a strings para la API
    if (booleanFilters.hasMedia) {
      combined.hasMedia = "true";
    }

    return combined;
  }, [filters, booleanFilters]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    const hasBasicFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== "" && value !== null
    );
    const hasBooleanFilters = Object.values(booleanFilters).some(
      (value) => value === true
    );

    return hasBasicFilters || hasBooleanFilters;
  }, [filters, booleanFilters]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    // Contar filtros básicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        // Para filtros múltiples, contar cada valor separado por comas
        if (typeof value === "string" && value.includes(",")) {
          count += value.split(",").length;
        } else {
          count++;
        }
      }
    });

    // Contar filtros booleanos
    Object.values(booleanFilters).forEach((value) => {
      if (value === true) {
        count++;
      }
    });

    return count;
  }, [filters, booleanFilters]);

  // Obtener descripción de filtros activos
  const getActiveFiltersDescription = useMemo(() => {
    const descriptions: string[] = [];

    if (filters.level) descriptions.push(`Nivel: ${filters.level}`);
    if (filters.type) descriptions.push(`Tipo: ${filters.type}`);
    if (filters.topic) descriptions.push(`Tema: ${filters.topic}`);
    if (filters.difficulty)
      descriptions.push(`Dificultad: ${filters.difficulty}`);
    if (filters.tags) descriptions.push(`Etiquetas: ${filters.tags}`);
    if (booleanFilters.hasMedia) descriptions.push("Con multimedia");
    if (filters.createdAfter)
      descriptions.push(`Creado después: ${filters.createdAfter}`);
    if (filters.createdBefore)
      descriptions.push(`Creado antes: ${filters.createdBefore}`);
    if (filters.sortBy) descriptions.push(`Ordenar por: ${filters.sortBy}`);

    return descriptions;
  }, [filters, booleanFilters]);

  // Actualizar filtro normal
  const updateFilter = (key: keyof QuestionFiltersState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Actualizar filtro booleano
  const updateBooleanFilter = (
    key: keyof QuestionBooleanFilters,
    value: boolean
  ) => {
    setBooleanFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({});
    setBooleanFilters({
      hasMedia: false,
    });
  };

  return {
    filters,
    booleanFilters,
    combinedFilters,
    hasActiveFilters,
    activeFiltersCount,
    getActiveFiltersDescription,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  };
}
