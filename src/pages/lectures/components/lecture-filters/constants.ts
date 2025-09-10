// TODO ESTO podria ser global , porque hay 3 o 4 componentes que usan esto

export const LECTURE_LEVELS = [
  { value: "A1", label: "A1 - Principiante" },
  { value: "A2", label: "A2 - Básico" },
  { value: "B1", label: "B1 - Intermedio" },
  { value: "B2", label: "B2 - Intermedio Alto" },
  { value: "C1", label: "C1 - Avanzado" },
  { value: "C2", label: "C2 - Maestría" },
];
// TODO ESTO podria ser global , porque hay 3 o 4 componentes que usan esto

export const LECTURE_LANGUAGES = [
  { value: "es", label: "Español", icon: "🇪🇸" },
  { value: "en", label: "Inglés", icon: "🇬🇧" },
  { value: "pt", label: "Portugués", icon: "🇵🇹" },
];

// TODO ESTO podria ser global , porque hay 3 o 4 componentes que usan esto
export const LECTURE_TYPES = [
  { value: "analysis", label: "Análisis" },
  { value: "argumentative", label: "Argumentativa" },
  { value: "narrative", label: "Narrativa" },
  { value: "descriptive", label: "Descriptiva" },
  { value: "expository", label: "Expositiva" },
  { value: "persuasive", label: "Persuasiva" },
  { value: "creative", label: "Creativa" },
  { value: "technical", label: "Técnica" },
  { value: "scientific", label: "Científica" },
  { value: "historical", label: "Histórica" },
  { value: "biographical", label: "Biográfica" },
  { value: "fiction", label: "Ficción" },
  { value: "review", label: "Reseña" },
  { value: "report", label: "Reporte" },
  { value: "case_study", label: "Estudio de Caso" },
  { value: "tutorial", label: "Tutorial" },
  { value: "speech", label: "Discurso" },
  { value: "poetry", label: "Poesía" },
  { value: "dialogue", label: "Diálogo" },
  { value: "letter", label: "Carta" },
  { value: "instructions", label: "Instrucciones" },
  { value: "guide", label: "Guía" },
  { value: "chronicle", label: "Crónica" },
  { value: "blog", label: "Blog" },
];
// TODO ESTO podria ser global , porque hay 3 o 4 componentes que usan esto

export const LECTURE_BOOLEAN_FILTERS = [
  { value: "hasImg", label: "Con Imagen" },
  { value: "hasUrlAudio", label: "Con Audio" },
];
// TODO ESTO podria ser global , porque hay 3 o 4 componentes que usan esto

export const LECTURE_SORT_OPTIONS = [
  { value: "createdAt", label: "Fecha de Creación" },
  { value: "updatedAt", label: "Fecha de Actualización" },
  { value: "time", label: "Tiempo de Lectura" },
  { value: "level", label: "Nivel" },
  { value: "language", label: "Idioma" },
  { value: "typeWrite", label: "Tipo de Texto" },
];

export const LECTURE_SORT_ORDERS = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
]; 