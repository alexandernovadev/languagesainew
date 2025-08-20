import { useEffect, useRef } from 'react';

export const useFilterUrlSync = (currentFilters: any, setFilters: (filters: any) => void) => {
  const isInitialLoad = useRef(true);

  // Función para leer filtros de la URL
  const loadFiltersFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filters: any = {};
    
    // Leer filtros básicos
    const level = urlParams.get('level');
    const language = urlParams.get('language');
    const type = urlParams.get('type');
    const wordUser = urlParams.get('wordUser');
    const definition = urlParams.get('definition');
    const IPA = urlParams.get('IPA');
    const spanishWord = urlParams.get('spanishWord');
    const spanishDefinition = urlParams.get('spanishDefinition');
    const seenMin = urlParams.get('seenMin');
    const seenMax = urlParams.get('seenMax');
    const hasImage = urlParams.get('hasImage');
    const sortBy = urlParams.get('sortBy');
    const sortOrder = urlParams.get('sortOrder');
    
    // Solo agregar filtros que existan
    if (level) filters.level = level;
    if (language) filters.language = language;
    if (type) filters.type = type;
    if (wordUser) filters.wordUser = wordUser;
    if (definition) filters.definition = definition;
    if (IPA) filters.IPA = IPA;
    if (spanishWord) filters.spanishWord = spanishWord;
    if (spanishDefinition) filters.spanishDefinition = spanishDefinition;
    if (seenMin) filters.seenMin = parseInt(seenMin);
    if (seenMax) filters.seenMax = parseInt(seenMax);
    if (hasImage) filters.hasImage = hasImage;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;
    
    return filters;
  };

  // Función para actualizar la URL con los filtros
  const updateURLWithFilters = (filters: any) => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    // Limpiar parámetros existentes
    searchParams.delete('level');
    searchParams.delete('language');
    searchParams.delete('type');
    searchParams.delete('wordUser');
    searchParams.delete('definition');
    searchParams.delete('IPA');
    searchParams.delete('spanishWord');
    searchParams.delete('spanishDefinition');
    searchParams.delete('seenMin');
    searchParams.delete('seenMax');
    searchParams.delete('hasImage');
    searchParams.delete('sortBy');
    searchParams.delete('sortOrder');
    
    // Agregar nuevos filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    
    // Actualizar URL sin recargar la página
    window.history.replaceState({}, '', url.toString());
  };

  // Función para limpiar todos los filtros de la URL
  const clearURLFilters = () => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    // Limpiar todos los parámetros de filtros
    searchParams.delete('level');
    searchParams.delete('language');
    searchParams.delete('type');
    searchParams.delete('wordUser');
    searchParams.delete('definition');
    searchParams.delete('IPA');
    searchParams.delete('spanishWord');
    searchParams.delete('spanishDefinition');
    searchParams.delete('seenMin');
    searchParams.delete('seenMax');
    searchParams.delete('hasImage');
    searchParams.delete('sortBy');
    searchParams.delete('sortOrder');
    
    // Actualizar URL sin recargar la página
    window.history.replaceState({}, '', url.toString());
  };

  // Cargar filtros de la URL al montar
  useEffect(() => {
    const filtersFromURL = loadFiltersFromURL();
    if (Object.keys(filtersFromURL).length > 0) {
      setFilters(filtersFromURL);
    }
  }, []); // Solo ejecutar una vez al montar

  // Sincronizar filtros con la URL
  useEffect(() => {
    // Evitar sincronización durante la carga inicial
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    
    // Solo actualizar URL si hay filtros activos
    if (Object.keys(currentFilters).length > 0) {
      // Usar un timeout para evitar actualizaciones excesivas
      const timeoutId = setTimeout(() => {
        updateURLWithFilters(currentFilters);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Si no hay filtros, limpiar la URL
      clearURLFilters();
    }
  }, [currentFilters]);

  return {
    loadFiltersFromURL,
    updateURLWithFilters,
    clearURLFilters
  };
};
