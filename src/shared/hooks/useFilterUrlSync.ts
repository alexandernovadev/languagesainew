import { useEffect, useRef } from 'react';

export const useFilterUrlSync = (currentFilters: any, setFilters: (filters: any) => void) => {
  const isInitialLoad = useRef(true);

  // Función para leer filtros de la URL
  const loadFiltersFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filters: any = {};
    
    // Word filters
    const difficulty = urlParams.get('difficulty');
    const language = urlParams.get('language');
    const type = urlParams.get('type');
    const wordUser = urlParams.get('wordUser');
    
    // Spanish filters
    const spanishWord = urlParams.get('spanishWord');
    const spanishDefinition = urlParams.get('spanishDefinition');
    
    // Content filters
    const definition = urlParams.get('definition');
    const IPA = urlParams.get('IPA');
    const hasExamples = urlParams.get('hasExamples');
    const hasSynonyms = urlParams.get('hasSynonyms');
    const hasCodeSwitching = urlParams.get('hasCodeSwitching');
    const hasImage = urlParams.get('hasImage');
    
    // Lecture filters
    const search = urlParams.get('search');
    const level = urlParams.get('level');
    const languageLecture = urlParams.get('language');
    const typeWrite = urlParams.get('typeWrite');
    const timeMin = urlParams.get('timeMin');
    const timeMax = urlParams.get('timeMax');
    const hasImg = urlParams.get('hasImg');
    const hasUrlAudio = urlParams.get('hasUrlAudio');
    
    // Advanced filters
    const seenMin = urlParams.get('seenMin');
    const seenMax = urlParams.get('seenMax');
    const createdAfter = urlParams.get('createdAfter');
    const createdBefore = urlParams.get('createdBefore');
    const updatedAfter = urlParams.get('updatedAfter');
    const updatedBefore = urlParams.get('updatedBefore');
    
    // Sorting
    const sortBy = urlParams.get('sortBy');
    const sortOrder = urlParams.get('sortOrder');
    
    // Solo agregar filtros que existan
    // Word filters
    if (difficulty) filters.difficulty = difficulty;
    if (language) filters.language = language;
    if (type) filters.type = type;
    if (wordUser) filters.wordUser = wordUser;
    if (spanishWord) filters.spanishWord = spanishWord;
    if (spanishDefinition) filters.spanishDefinition = spanishDefinition;
    if (definition) filters.definition = definition;
    if (IPA) filters.IPA = IPA;
    if (hasExamples) filters.hasExamples = hasExamples === 'true';
    if (hasSynonyms) filters.hasSynonyms = hasSynonyms === 'true';
    if (hasCodeSwitching) filters.hasCodeSwitching = hasCodeSwitching === 'true';
    if (hasImage) filters.hasImage = hasImage;
    
    // Lecture filters (handle arrays from comma-separated strings)
    if (search) filters.search = search;
    if (level) {
      // Split comma-separated values into array
      const levelArray = level.split(',').map(v => v.trim()).filter(v => v);
      filters.level = levelArray.length > 1 ? levelArray : levelArray[0];
    }
    if (languageLecture) {
      // Split comma-separated values into array
      const langArray = languageLecture.split(',').map(v => v.trim()).filter(v => v);
      filters.language = langArray.length > 1 ? langArray : langArray[0];
    }
    if (typeWrite) {
      // Split comma-separated values into array
      const typeArray = typeWrite.split(',').map(v => v.trim()).filter(v => v);
      filters.typeWrite = typeArray.length > 1 ? typeArray : typeArray[0];
    }
    if (timeMin) filters.timeMin = parseInt(timeMin);
    if (timeMax) filters.timeMax = parseInt(timeMax);
    if (hasImg) filters.hasImg = hasImg;
    if (hasUrlAudio) filters.hasUrlAudio = hasUrlAudio;
    
    // Advanced filters
    if (seenMin) filters.seenMin = parseInt(seenMin);
    if (seenMax) filters.seenMax = parseInt(seenMax);
    if (createdAfter) filters.createdAfter = createdAfter;
    if (createdBefore) filters.createdBefore = createdBefore;
    if (updatedAfter) filters.updatedAfter = updatedAfter;
    if (updatedBefore) filters.updatedBefore = updatedBefore;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;
    
    return filters;
  };

  // Función para actualizar la URL con los filtros
  const updateURLWithFilters = (filters: any) => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    // Limpiar parámetros existentes
    const filterKeys = [
      // Word filters
      'difficulty', 'language', 'type', 'wordUser',
      'spanishWord', 'spanishDefinition',
      'definition', 'IPA', 'hasExamples', 'hasSynonyms', 'hasCodeSwitching', 'hasImage',
      // Lecture filters
      'search', 'level', 'typeWrite', 'timeMin', 'timeMax', 'hasImg', 'hasUrlAudio',
      // Advanced filters
      'seenMin', 'seenMax', 'createdAfter', 'createdBefore', 'updatedAfter', 'updatedBefore',
      'sortBy', 'sortOrder'
    ];
    
    filterKeys.forEach(key => searchParams.delete(key));
    
    // Agregar nuevos filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'limit') {
        // Handle arrays for level, language, typeWrite (convert to comma-separated string)
        if (Array.isArray(value) && value.length > 0) {
          searchParams.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          searchParams.set(key, String(value));
        }
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
    const filterKeys = [
      // Word filters
      'difficulty', 'language', 'type', 'wordUser',
      'spanishWord', 'spanishDefinition',
      'definition', 'IPA', 'hasExamples', 'hasSynonyms', 'hasCodeSwitching', 'hasImage',
      // Lecture filters
      'search', 'level', 'typeWrite', 'timeMin', 'timeMax', 'hasImg', 'hasUrlAudio',
      // Advanced filters
      'seenMin', 'seenMax', 'createdAfter', 'createdBefore', 'updatedAfter', 'updatedBefore',
      'sortBy', 'sortOrder'
    ];
    
    filterKeys.forEach(key => searchParams.delete(key));
    
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
