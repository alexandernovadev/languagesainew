import { useState, useCallback, useMemo, useEffect } from "react";
import { useLectureStore } from "@/lib/store/useLectureStore";

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
  const { currentFilters, setFilters: setStoreFilters } = useLectureStore();

  const [filters, setFilters] = useState<LectureFilters>({});
  const [booleanFilters, setBooleanFilters] = useState<Record<string, boolean>>({});

  // Sync from store to local hook state (like words hook)
  useEffect(() => {
    if (currentFilters && Object.keys(currentFilters).length > 0) {
      setFilters(currentFilters);
      // Boolean filters may be present in store as string 'true'; coerce
      const bools: Record<string, boolean> = {};
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (k === "hasImg" || k === "hasUrlAudio") {
          bools[k] = v === true || v === "true";
        }
      });
      // Always set, so clearing in store resets local booleans too
      setBooleanFilters(bools);
    } else {
      // When store filters are cleared, reset local state as well
      setFilters({});
      setBooleanFilters({});
    }
  }, [currentFilters]);

  const updateFilter = useCallback((key: keyof LectureFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateBooleanFilter = useCallback((key: string, value: boolean) => {
    setBooleanFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setBooleanFilters({});
    // Clear in store so other hook instances (e.g., in page) update too
    setStoreFilters({});
  }, [setStoreFilters]);

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

  // Combined filters to send to API
  const combinedFilters = useMemo(() => {
    const apiFilters: Record<string, any> = { ...filters };
    Object.entries(booleanFilters).forEach(([k, v]) => {
      if (v) apiFilters[k] = v;
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
      if (value) {
        const labels: Record<string, string> = {
          hasImg: "Con imagen",
          hasUrlAudio: "Con audio",
        };
        desc.push(labels[key] || key);
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
    activeFiltersCount: activeFiltersTotal,
    getActiveFiltersDescription,
  };
} 