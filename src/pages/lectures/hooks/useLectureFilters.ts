import { useState, useCallback, useMemo, useEffect } from "react";
import { useLectureStore } from "../store/useLectureStore";

interface LectureFilters {
  level?: string;
  language?: string;
  typeWrite?: string;
  timeMin?: number;
  timeMax?: number;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  sortBy?: string;
  sortOrder?: string;
  hasImg?: boolean;
  hasUrlAudio?: boolean;
}

export function useLectureFilters() {
  const { currentFilters, setFilters: setStoreFilters } = useLectureStore();

  const [filters, setFilters] = useState<LectureFilters>({});
  const [booleanFilters, setBooleanFilters] = useState<Record<string, boolean>>({});

  // Sync from store to local hook state
  useEffect(() => {
    if (currentFilters && Object.keys(currentFilters).length > 0) {
      const newFilters: LectureFilters = {};
      const bools: Record<string, boolean> = {};
      
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (k === "hasImg" || k === "hasUrlAudio") {
          bools[k] = v === true || v === "true";
        } else {
          newFilters[k as keyof LectureFilters] = v;
        }
      });
      
      setFilters(newFilters);
      setBooleanFilters(bools);
    } else {
      setFilters({});
      setBooleanFilters({});
    }
  }, [currentFilters]);

  const updateFilter = useCallback((key: keyof LectureFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateBooleanFilter = useCallback(
    (key: string, value: boolean | undefined) => {
      setBooleanFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setBooleanFilters({});
    // Clear in store so other hook instances (e.g., in page) update too
    setStoreFilters({});
  }, [setStoreFilters]);

  const hasActiveFilters = useMemo(() => {
    const basic = Object.values(filters).some((v) => v !== undefined && v !== "" && v !== null);
    const bool = Object.values(booleanFilters).some((v) => v !== undefined);
    return basic || bool;
  }, [filters, booleanFilters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([_, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        if (typeof value === "string" && value.includes(",")) {
          count += value.split(",").length;
        } else {
          count += 1;
        }
      }
    });
    
    // Contar filtros booleanos activos
    Object.values(booleanFilters).forEach(value => {
      if (value !== undefined) {
        count += 1;
      }
    });
    
    return count;
  }, [filters, booleanFilters]);



  // Combined filters to send to API
  const combinedFilters = useMemo(() => {
    const apiFilters: Record<string, any> = { ...filters };
    
    // Convertir filtros booleanos a strings para la API
    Object.entries(booleanFilters).forEach(([k, v]) => {
      if (v !== undefined) {
        apiFilters[k] = v ? "true" : "false";
      }
    });
    
    return apiFilters;
  }, [filters, booleanFilters]);

  const getActiveFiltersDescription = useMemo(() => {
    const desc: string[] = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) return;
      switch (key) {
        case "level":
          desc.push(`Nivel: ${value}`);
          break;
        case "language":
          desc.push(`Idioma: ${value}`);
          break;
        case "typeWrite":
          desc.push(`Tipo: ${value}`);
          break;
        case "timeMin":
        case "timeMax":
          desc.push(`${key === "timeMin" ? "Mín" : "Máx"} tiempo: ${value}`);
          break;
        case "createdAfter":
        case "createdBefore":
          desc.push(`${key}: ${value}`);
          break;
        case "sortBy":
          desc.push(`Ordenar por: ${value}`);
          break;
        case "sortOrder":
          desc.push(`Orden: ${value}`);
          break;
        default:
          desc.push(`${key}: ${value}`);
      }
    });
    // Boolean descriptions
    Object.entries(booleanFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        const labels: Record<string, string> = {
          hasImg: value ? "Con imagen" : "Sin imagen",
          hasUrlAudio: value ? "Con audio" : "Sin audio",
        };
        desc.push(labels[key] || `${key}: ${value}`);
      }
    });
    return desc;
  }, [filters, booleanFilters]);

  return {
    filters,
    booleanFilters,
    combinedFilters,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
    getActiveFiltersDescription,
  };
} 