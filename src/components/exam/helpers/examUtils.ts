import {
  questionTypes,
  questionLevels,
  questionDifficulties,
} from "@/data/questionTypes";
import { EXAM_VALIDATION_LIMITS } from "../constants/examConstants";

// Question Type Helpers
export const getQuestionTypeLabel = (type: string): string => {
  const typeData = questionTypes.find((t) => t.value === type);
  return typeData?.label || type;
};

// Level Helpers
export const getLevelLabel = (level: string): string => {
  const levelData = questionLevels.find((l) => l.value === level);
  return levelData?.label || level;
};

export const getLevelDescription = (level: string): string => {
  const levelData = questionLevels.find((l) => l.value === level);
  return levelData?.description || "";
};

// Shared Level Color Helper
export const getLevelColor = (level: string) => {
  switch (level) {
    case "A1":
      return "default";
    case "A2":
      return "secondary";
    case "B1":
      return "outline";
    case "B2":
      return "destructive";
    case "C1":
      return "default";
    case "C2":
      return "secondary";
    default:
      return "outline";
  }
};

// Shared Source Helpers
export const getSourceIcon = (source?: string) => {
  return source === "ai" ? "Brain" : "PenTool";
};

export const getSourceVariant = (source?: string) => {
  return source === "ai" ? "default" : "secondary";
};

// Question Text Extraction Helper
export const getQuestionText = (question: any): string => {
  // Handle different question structures
  if (typeof question === "string") {
    return question;
  }

  if (typeof question === "object" && question !== null) {
    // Try different possible field names
    if (question.text) return question.text;
    if (question.question) {
      // If question.question is a string, return it
      if (typeof question.question === "string") {
        return question.question;
      }
      // If question.question is an object, try to get text from it
      if (typeof question.question === "object" && question.question.text) {
        return question.question.text;
      }
    }
    if (question.content) return question.content;
    if (question.title) return question.title;
  }

  // Fallback
  return "Pregunta sin texto";
};

// Question Type Extraction Helper
export const getQuestionType = (question: any): string => {
  if (typeof question === "object" && question !== null) {
    if (question.type) return question.type;
    if (
      question.question &&
      typeof question.question === "object" &&
      question.question.type
    ) {
      return question.question.type;
    }
  }
  return "multiple_choice"; // Default fallback
};

// Question Options Extraction Helper
export const getQuestionOptions = (
  question: any
): Array<{ value: string; label: string; isCorrect: boolean }> => {
  if (typeof question === "object" && question !== null) {
    if (question.options && Array.isArray(question.options)) {
      return question.options;
    }
    if (
      question.question &&
      typeof question.question === "object" &&
      question.question.options
    ) {
      return question.question.options;
    }
  }
  return [];
};

// Question Correct Answers Extraction Helper
export const getQuestionCorrectAnswers = (question: any): string[] => {
  if (typeof question === "object" && question !== null) {
    if (question.correctAnswers && Array.isArray(question.correctAnswers)) {
      return question.correctAnswers;
    }
    if (
      question.question &&
      typeof question.question === "object" &&
      question.question.correctAnswers
    ) {
      return question.question.correctAnswers;
    }
  }
  return [];
};

// Question Tags Extraction Helper
export const getQuestionTags = (question: any): string[] => {
  if (typeof question === "object" && question !== null) {
    if (question.tags && Array.isArray(question.tags)) {
      return question.tags;
    }
    if (
      question.question &&
      typeof question.question === "object" &&
      question.question.tags
    ) {
      return question.question.tags;
    }
  }
  return [];
};

// Question Explanation Extraction Helper
export const getQuestionExplanation = (question: any): string => {
  if (typeof question === "object" && question !== null) {
    if (question.explanation) return question.explanation;
    if (
      question.question &&
      typeof question.question === "object" &&
      question.question.explanation
    ) {
      return question.question.explanation;
    }
  }
  return "";
};

// Difficulty Helpers
export const getDifficultyLabel = (difficulty: number): string => {
  const difficultyData = questionDifficulties.find(
    (d) => d.value === difficulty
  );
  return difficultyData?.label || `Nivel ${difficulty}`;
};

// Language Helpers
export const getLanguageLabel = (lang: string): string => {
  const languages: Record<string, string> = {
    es: "Español",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    pt: "Português",
  };
  return languages[lang] || lang;
};

// Date Formatting Helper
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Text Truncation Helper
export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "Sin descripción";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Statistics Helpers
export const calculateQuestionTypeStats = (questions: any[]) => {
  return questions.reduce((acc, question) => {
    acc[question.type] = (acc[question.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const calculateEstimatedTime = (questions: any[]): number => {
  return questions.length * 2; // 2 minutes per question average
};

// Validation Helpers
export const validateExamFilters = (
  filters: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!filters.topic?.trim()) {
    errors.push("El tema del examen es requerido");
  }

  if (filters.topic && filters.topic.length > EXAM_VALIDATION_LIMITS.maxTopicLength) {
    errors.push(`El tema del examen no puede exceder ${EXAM_VALIDATION_LIMITS.maxTopicLength} caracteres`);
  }

  // Validación de temas de gramática
  if (filters.grammarTopics && !Array.isArray(filters.grammarTopics)) {
    errors.push("Los temas de gramática deben ser un array");
  }

  if (!filters.grammarTopics || filters.grammarTopics.length === 0) {
    errors.push("Debe seleccionar al menos un tema de gramática");
  }

  if (
    filters.grammarTopics &&
    filters.grammarTopics.length > EXAM_VALIDATION_LIMITS.maxGrammarTopics
  ) {
    errors.push(
      `Máximo ${EXAM_VALIDATION_LIMITS.maxGrammarTopics} temas de gramática permitidos`
    );
  }

  if (!filters.types || filters.types.length === 0) {
    errors.push("Debe seleccionar al menos un tipo de pregunta");
  }

  if (
    filters.numberOfQuestions < EXAM_VALIDATION_LIMITS.minQuestions ||
    filters.numberOfQuestions > EXAM_VALIDATION_LIMITS.maxQuestions
  ) {
    errors.push(
      `El número de preguntas debe estar entre ${EXAM_VALIDATION_LIMITS.minQuestions} y ${EXAM_VALIDATION_LIMITS.maxQuestions}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Progress Helpers - Mensajes divertidos y genéricos sobre lo que hace la IA
export const getFunnyProgressMessages = (): string[] => [
  "🧠 Despertando a la IAnuel desde su siesta digital...",
  "📚 Consultando la biblioteca infinita de conocimiento...",
  "✨ Activando el cerebro artificial con toda su potencia...",
  "🎯 Creando preguntas inteligentes que harán pensar...",
  "📝 Escribiendo contenido educativo que inspire aprendizaje...",
  "🔍 Diseñando ejercicios divertidos para mantener el interés...",
  "💭 Formulando desafíos mentales que expandan la mente...",
  "🎨 Creando opciones de respuesta con estilo y elegancia...",
  "✨ Añadiendo explicaciones brillantes que iluminen el camino...",
  "🔧 Revisando la dificultad para que sea el desafío perfecto...",
  "📊 Balanceando el contenido para una experiencia equilibrada...",
  "✅ Verificando la calidad para asegurar la excelencia...",
  "🎯 Ajustando el nivel para que sea ni muy fácil ni muy difícil...",
  "📝 Generando material educativo que conecte con el estudiante...",
  "🔍 Revisando la coherencia para que todo tenga sentido...",
  "💡 Añadiendo toques creativos que hagan el aprendizaje divertido...",
  "🎪 Preparando el contenido para que sea una experiencia memorable...",
  "🌟 Optimizando la experiencia para que sea fluida y agradable...",
  "📋 Finalizando la configuración con todos los detalles perfectos...",
  "🎉 ¡Examen listo para usar y conquistar el conocimiento!",
];

// Mensajes para el proceso de calificación del examen
export const getExamGradingMessages = (): string[] => [
  "🧠 AInuel esta analizando la calificación con su sabiduría digital...",
  "📚 Consultando las respuestas correctas desde la base de datos del conocimiento...",
  "✨ Iniciando el análisis inteligente con precisión milimétrica...",
  "🔍 Analizando las respuestas con atención al detalle...",
  "📝 Revisando el contenido para asegurar la justicia en la evaluación...",
  "🧠 Evaluando la comprensión con criterios pedagógicos avanzados...",
  "📊 Calculando la puntuación con algoritmos de precisión...",
  "💬 Generando feedback personalizado que motive el crecimiento...",
  "⚙️ Procesando los resultados con tecnología de última generación...",
  "📋 Preparando el reporte con información detallada y útil...",
  "✅ Verificando la coherencia para garantizar la imparcialidad...",
  "🎯 Evaluando el rendimiento con métricas científicas...",
  "🔎 Revisando los detalles que marcan la diferencia...",
  "📈 Analizando el progreso para identificar tendencias de mejora...",
  "💡 Generando recomendaciones personalizadas para el desarrollo...",
  "📚 Identificando mejoras específicas para el crecimiento académico...",
  "🎨 Preparando el resumen visual que facilite la comprensión...",
  "📊 Calculando estadísticas que revelen el verdadero potencial...",
  "🔍 Verificando la calidad del feedback para asegurar su utilidad...",
  "📝 Finalizando el reporte con todos los elementos necesarios...",
  "✅ Completando la evaluación con rigor académico y empatía...",
  "🎉 ¡Calificación lista para revisar y celebrar el aprendizaje!",
];
