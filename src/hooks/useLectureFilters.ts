import { useState, useCallback, useMemo } from "react";

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
}

export function useLectureFilters() {
  const [filters, setFilters] = useState<LectureFilters>({});
  const [booleanFilters, setBooleanFilters] = useState<Record<string, boolean>>({});

  const updateFilter = useCallback((key: keyof LectureFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateBooleanFilter = useCallback((key: string, value: boolean) => {
    setBooleanFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    const basic = Object.values(filters).some((v)=>v!==undefined&&v!==""&&v!==null);
    const bool  = Object.values(booleanFilters).some((v)=>v===true);
    return basic||bool;
  },[filters,booleanFilters]);

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
    return count;
  }, [filters]);

  // include boolean count
   const activeFiltersTotal = useMemo(()=>{
     let c=activeFiltersCount;
     Object.values(booleanFilters).forEach(v=>{if(v) c++;});
     return c;
   },[activeFiltersCount,booleanFilters]);

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
    return desc;
  }, [filters, booleanFilters]);

  return {
    filters,
    booleanFilters,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount: activeFiltersTotal,
    getActiveFiltersDescription,
  };
} 