export interface ExamLevelInfo {
  value: string;
  label: string;
  description: string;
  color: string;
}

export interface ExamTypeInfo {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export const examLevels: Record<string, ExamLevelInfo> = {
  'A1': {
    value: 'A1',
    label: 'A1 - Principiante',
    description: 'Nivel básico de principiante',
    color: 'green'
  },
  'A2': {
    value: 'A2',
    label: 'A2 - Elemental',
    description: 'Nivel elemental',
    color: 'blue'
  },
  'B1': {
    value: 'B1',
    label: 'B1 - Intermedio',
    description: 'Nivel intermedio',
    color: 'yellow'
  },
  'B2': {
    value: 'B2',
    label: 'B2 - Intermedio Alto',
    description: 'Nivel intermedio alto',
    color: 'orange'
  },
  'C1': {
    value: 'C1',
    label: 'C1 - Avanzado',
    description: 'Nivel avanzado',
    color: 'red'
  },
  'C2': {
    value: 'C2',
    label: 'C2 - Maestría',
    description: 'Nivel de maestría',
    color: 'purple'
  }
};

export const examTypes: Record<string, ExamTypeInfo> = {
  'single_choice': {
    value: 'single_choice',
    label: 'Selección Única',
    description: 'Pregunta con una sola opción correcta',
    icon: '🔘'
  },
  'multiple_choice': {
    value: 'multiple_choice',
    label: 'Selección Múltiple',
    description: 'Pregunta con varias opciones de respuesta',
    icon: '☑️'
  },
  'fill_blank': {
    value: 'fill_blank',
    label: 'Completar Espacios',
    description: 'Completar espacios en blanco en un texto',
    icon: '📝'
  },
  'translate': {
    value: 'translate',
    label: 'Traducción',
    description: 'Traducir palabras o frases',
    icon: '🌐'
  },
  'true_false': {
    value: 'true_false',
    label: 'Verdadero/Falso',
    description: 'Pregunta de verdadero o falso',
    icon: '✅❌'
  },
  'writing': {
    value: 'writing',
    label: 'Escritura',
    description: 'Ejercicio de escritura libre',
    icon: '✍️'
  }
};

/**
 * Get exam level information by value
 * @param value - Level value (e.g., 'A1', 'B2')
 * @returns ExamLevelInfo object with value, label, description, and color
 */
export const getExamLevelInfo = (value: string): ExamLevelInfo => {
  return examLevels[value] || {
    value,
    label: value,
    description: 'Nivel no definido',
    color: 'gray'
  };
};

/**
 * Get exam level label by value
 * @param value - Level value (e.g., 'A1', 'B2')
 * @returns Level label in Spanish, or value if not found
 */
export const getExamLevelLabel = (value: string): string => {
  return examLevels[value]?.label || value;
};

/**
 * Get exam level description by value
 * @param value - Level value (e.g., 'A1', 'B2')
 * @returns Level description in Spanish, or default if not found
 */
export const getExamLevelDescription = (value: string): string => {
  return examLevels[value]?.description || 'Nivel no definido';
};

/**
 * Get exam level color by value
 * @param value - Level value (e.g., 'A1', 'B2')
 * @returns Level color for styling, or 'gray' if not found
 */
export const getExamLevelColor = (value: string): string => {
  return examLevels[value]?.color || 'gray';
};

/**
 * Get exam type information by value
 * @param value - Type value (e.g., 'single_choice', 'multiple_choice')
 * @returns ExamTypeInfo object with value, label, description, and icon
 */
export const getExamTypeInfo = (value: string): ExamTypeInfo => {
  return examTypes[value] || {
    value,
    label: value,
    description: 'Tipo no definido',
    icon: '❓'
  };
};

/**
 * Get exam type label by value
 * @param value - Type value (e.g., 'single_choice', 'multiple_choice')
 * @returns Type label in Spanish, or value if not found
 */
export const getExamTypeLabel = (value: string): string => {
  return examTypes[value]?.label || value;
};

/**
 * Get exam type description by value
 * @param value - Type value (e.g., 'single_choice', 'multiple_choice')
 * @returns Type description in Spanish, or default if not found
 */
export const getExamTypeDescription = (value: string): string => {
  return examTypes[value]?.description || 'Tipo no definido';
};

/**
 * Get exam type icon by value
 * @param value - Type value (e.g., 'single_choice', 'multiple_choice')
 * @returns Type icon emoji, or '❓' if not found
 */
export const getExamTypeIcon = (value: string): string => {
  return examTypes[value]?.icon || '❓';
};

/**
 * Get all available exam levels
 * @returns Array of all ExamLevelInfo objects
 */
export const getAllExamLevels = (): ExamLevelInfo[] => {
  return Object.values(examLevels);
};

/**
 * Get all available exam types
 * @returns Array of all ExamTypeInfo objects
 */
export const getAllExamTypes = (): ExamTypeInfo[] => {
  return Object.values(examTypes);
};

/**
 * Get exam levels by difficulty range
 * @param minLevel - Minimum level (e.g., 'A1')
 * @param maxLevel - Maximum level (e.g., 'B2')
 * @returns Array of ExamLevelInfo objects within the range
 */
export const getExamLevelsByRange = (minLevel: string, maxLevel: string): ExamLevelInfo[] => {
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const minIndex = levelOrder.indexOf(minLevel);
  const maxIndex = levelOrder.indexOf(maxLevel);
  
  if (minIndex === -1 || maxIndex === -1 || minIndex > maxIndex) {
    return [];
  }
  
  return levelOrder
    .slice(minIndex, maxIndex + 1)
    .map(level => examLevels[level])
    .filter(Boolean);
};

/**
 * Get exam types by category
 * @param category - Category name (e.g., 'choice', 'text', 'interactive')
 * @returns Array of ExamTypeInfo objects for the category
 */
export const getExamTypesByCategory = (category: string): ExamTypeInfo[] => {
  const categoryMap: Record<string, string[]> = {
    'choice': ['single_choice', 'multiple_choice', 'true_false'],
    'text': ['fill_blank', 'translate', 'writing'],
    'interactive': ['fill_blank', 'translate', 'writing'],
    'simple': ['single_choice', 'true_false'],
    'complex': ['multiple_choice', 'fill_blank', 'translate', 'writing']
  };
  
  const codes = categoryMap[category] || [];
  return codes.map(code => examTypes[code]).filter(Boolean);
}; 