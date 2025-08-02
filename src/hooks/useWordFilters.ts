import { useState, useCallback, useMemo, useEffect } from "react";
import { WordFilters } from "@/components/forms/word-filters/types";
import { useWordStore } from "@/lib/store/useWordStore";

export function useWordFilters() {
  const { currentFilters, clearFilters: clearStoreFilters } = useWordStore();

  const [filters, setFilters] = useState<WordFilters>({});
  const [booleanFilters, setBooleanFilters] = useState<Record<string, boolean>>(
    {}
  );

  // Sincronizar con los filtros del store
  useEffect(() => {
    if (currentFilters && Object.keys(currentFilters).length > 0) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  // Inicializar con filtros por defecto si no hay filtros en el store
  useEffect(() => {
    if (!currentFilters || Object.keys(currentFilters).length === 0) {
      setFilters({});
    }
  }, [currentFilters]);

  // Actualizar filtros individuales
  const updateFilter = useCallback((key: keyof WordFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Actualizar filtros booleanos
  const updateBooleanFilter = useCallback((key: string, value: boolean) => {
    setBooleanFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    setBooleanFilters({});
    clearStoreFilters(); // Limpiar también los filtros del store
  }, [clearStoreFilters]);

  // Obtener filtros combinados para la API
  const combinedFilters = useMemo(() => {
    const apiFilters = { ...filters } as any;

    // Agregar filtros booleanos
    Object.entries(booleanFilters).forEach(([key, value]) => {
      if (value) {
        apiFilters[key] = value;
      }
    });

    return apiFilters;
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

    // Filtros básicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        if (key === "level" && typeof value === "string") {
          const levels = value.split(",");
          if (levels.length === 1) {
            descriptions.push(`Nivel: ${levels[0]}`);
          } else {
            descriptions.push(`Niveles: ${levels.join(", ")}`);
          }
        } else if (key === "language" && typeof value === "string") {
          const languages = value.split(",");
          if (languages.length === 1) {
            descriptions.push(`Idioma: ${languages[0]}`);
          } else {
            descriptions.push(`Idiomas: ${languages.join(", ")}`);
          }
        } else if (key === "type" && typeof value === "string") {
          const types = value.split(",");
          if (types.length === 1) {
            descriptions.push(`Tipo: ${types[0]}`);
          } else {
            descriptions.push(`Tipos: ${types.join(", ")}`);
          }
        } else if (key === "wordUser") {
          descriptions.push(`Palabra: "${value}"`);
        } else if (key === "definition") {
          descriptions.push(`Definición: "${value}"`);
        } else if (key === "IPA") {
          descriptions.push(`IPA: "${value}"`);
        } else if (key === "spanishWord") {
          descriptions.push(`Español: "${value}"`);
        } else if (key === "spanishDefinition") {
          descriptions.push(`Def. Español: "${value}"`);
        } else if (key === "seenMin" || key === "seenMax") {
          descriptions.push(
            `${key === "seenMin" ? "Mín" : "Máx"} vistas: ${value}`
          );
        } else if (key === "sortBy") {
          descriptions.push(`Ordenar por: ${value}`);
        } else if (key === "sortOrder") {
          descriptions.push(`Orden: ${value}`);
        } else if (key.includes("After") || key.includes("Before")) {
          descriptions.push(`${key}: ${value}`);
        }
      }
    });

    // Filtros booleanos
    Object.entries(booleanFilters).forEach(([key, value]) => {
      if (value === true) {
        const labels: Record<string, string> = {
          hasImage: "Con imagen",
          hasExamples: "Con ejemplos",
          hasSynonyms: "Con sinónimos",
          hasCodeSwitching: "Con code-switching",
        };
        descriptions.push(labels[key] || key);
      }
    });

    return descriptions;
  }, [filters, booleanFilters]);

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
