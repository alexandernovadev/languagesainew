import { useState, useEffect, useMemo } from "react";

export interface ExpressionFilters {
  // Basic filters
  difficulty?: string[];
  language?: string[];
  type?: string[];
  
  // Text filters
  expression?: string;
  definition?: string;
  spanishExpression?: string;
  spanishDefinition?: string;
  
  // Boolean filters
  hasExamples?: boolean;
  hasImage?: boolean;
  hasSpanish?: boolean;
  
  // Date filters
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  
  // Sort filters
  sortBy?: string;
  sortOrder?: string;
}

export interface ExpressionBooleanFilters {
  hasExamples: boolean | undefined;
  hasImage: boolean | undefined;
  hasSpanish: boolean | undefined;
}

export function useExpressionFilters() {
  const [filters, setFilters] = useState<ExpressionFilters>({});
  const [booleanFilters, setBooleanFilters] = useState<ExpressionBooleanFilters>({
    hasExamples: undefined,
    hasImage: undefined,
    hasSpanish: undefined,
  });

  // Update basic filters
  const updateFilter = (key: keyof ExpressionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update boolean filters
  const updateBooleanFilter = (key: keyof ExpressionBooleanFilters, value: boolean | undefined) => {
    setBooleanFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Combine filters for API calls
  const combinedFilters = useMemo(() => {
    const apiFilters: any = { ...filters };
    
    // Convert boolean filters to API format
    if (booleanFilters.hasExamples !== undefined) {
      apiFilters.hasExamples = booleanFilters.hasExamples ? "true" : "false";
    }
    if (booleanFilters.hasImage !== undefined) {
      apiFilters.hasImage = booleanFilters.hasImage ? "true" : "false";
    }
    if (booleanFilters.hasSpanish !== undefined) {
      apiFilters.hasSpanish = booleanFilters.hasSpanish ? "true" : "false";
    }
    
    return apiFilters;
  }, [filters, booleanFilters]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0 || 
           Object.values(booleanFilters).some(value => value !== undefined);
  }, [filters, booleanFilters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    // Count basic filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        count += value.length;
      } else if (value && !Array.isArray(value)) {
        count++;
      }
    });
    
    // Count boolean filters
    Object.values(booleanFilters).forEach(value => {
      if (value !== undefined) {
        count++;
      }
    });
    
    return count;
  }, [filters, booleanFilters]);

  // Get description of active filters
  const getActiveFiltersDescription = () => {
    const descriptions: string[] = [];
    
    if (filters.difficulty?.length) {
      descriptions.push(`${filters.difficulty.length} nivel(es)`);
    }
    if (filters.language?.length) {
      descriptions.push(`${filters.language.length} idioma(s)`);
    }
    if (filters.type?.length) {
      descriptions.push(`${filters.type.length} tipo(s)`);
    }
    if (booleanFilters.hasExamples === true) {
      descriptions.push("Con ejemplos");
    } else if (booleanFilters.hasExamples === false) {
      descriptions.push("Sin ejemplos");
    }
    if (booleanFilters.hasImage === true) {
      descriptions.push("Con imagen");
    } else if (booleanFilters.hasImage === false) {
      descriptions.push("Sin imagen");
    }
    if (booleanFilters.hasSpanish === true) {
      descriptions.push("Con español");
    } else if (booleanFilters.hasSpanish === false) {
      descriptions.push("Sin español");
    }
    
    return descriptions.join(", ");
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setBooleanFilters({
      hasExamples: undefined,
      hasImage: undefined,
      hasSpanish: undefined,
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
