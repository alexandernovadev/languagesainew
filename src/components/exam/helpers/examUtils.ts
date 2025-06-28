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

  // Validación de temas de gramática
  if (filters.grammarTopics && !Array.isArray(filters.grammarTopics)) {
    errors.push("Los temas de gramática deben ser un array");
  }

  if (filters.grammarTopics && filters.grammarTopics.length > EXAM_VALIDATION_LIMITS.maxGrammarTopics) {
    errors.push(`Máximo ${EXAM_VALIDATION_LIMITS.maxGrammarTopics} temas de gramática permitidos`);
  }

  if (!filters.types || filters.types.length === 0) {
    errors.push("Debe seleccionar al menos un tipo de pregunta");
  }

  if (filters.numberOfQuestions < EXAM_VALIDATION_LIMITS.minQuestions || filters.numberOfQuestions > EXAM_VALIDATION_LIMITS.maxQuestions) {
    errors.push(`El número de preguntas debe estar entre ${EXAM_VALIDATION_LIMITS.minQuestions} y ${EXAM_VALIDATION_LIMITS.maxQuestions}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Progress Helpers
export const getProgressMessage = (progress: number): string => {
  if (progress === 0) return "Iniciando generación...";
  if (progress < 25) return "Analizando tema y configurando preguntas...";
  if (progress < 50) return "Generando preguntas con IA...";
  if (progress < 75) return "Creando opciones y explicaciones...";
  if (progress < 100) return "Finalizando y optimizando...";
  return "¡Examen generado exitosamente!";
};

export const getProgressColor = (progress: number): string => {
  if (progress === 100) return "bg-green-500";
  if (progress > 50) return "bg-blue-500";
  return "bg-orange-500";
};
