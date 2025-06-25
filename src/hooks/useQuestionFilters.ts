import { useState, useMemo } from "react";
import { QuestionFiltersState, QuestionBooleanFilters } from "@/components/forms/question-filters/types";

export function useQuestionFilters() {
  const [filters, setFilters] = useState<QuestionFiltersState>({});
  const [booleanFilters, setBooleanFilters] = useState<QuestionBooleanFilters>({
    hasMedia: false,
  });

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
    return Object.values(filters).some(value => value !== undefined && value !== "") ||
           Object.values(booleanFilters).some(value => value === true);
  }, [filters, booleanFilters]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    // Contar filtros normales
    Object.values(filters).forEach(value => {
      if (value !== undefined && value !== "") count++;
    });
    
    // Contar filtros booleanos
    Object.values(booleanFilters).forEach(value => {
      if (value === true) count++;
    });
    
    return count;
  }, [filters, booleanFilters]);

  // Obtener descripción de filtros activos
  const getActiveFiltersDescription = useMemo(() => {
    const descriptions: string[] = [];
    
    if (filters.level) descriptions.push(`Nivel: ${filters.level}`);
    if (filters.type) descriptions.push(`Tipo: ${filters.type}`);
    if (filters.topic) descriptions.push(`Tema: ${filters.topic}`);
    if (filters.difficulty) descriptions.push(`Dificultad: ${filters.difficulty}`);
    if (filters.tags) descriptions.push(`Etiquetas: ${filters.tags}`);
    if (booleanFilters.hasMedia) descriptions.push("Con multimedia");
    if (filters.createdAfter) descriptions.push(`Creado después: ${filters.createdAfter}`);
    if (filters.createdBefore) descriptions.push(`Creado antes: ${filters.createdBefore}`);
    if (filters.sortBy) descriptions.push(`Ordenar por: ${filters.sortBy}`);
    
    return descriptions;
  }, [filters, booleanFilters]);

  // Actualizar filtro normal
  const updateFilter = (key: keyof QuestionFiltersState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Actualizar filtro booleano
  const updateBooleanFilter = (key: keyof QuestionBooleanFilters, value: boolean) => {
    setBooleanFilters(prev => ({
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