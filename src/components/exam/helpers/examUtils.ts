import {
  questionTypes,
  questionLevels,
  questionDifficulties,
} from "@/data/questionTypes";

// Question Type Helpers
export const getQuestionTypeLabel = (type: string): string => {
  const typeData = questionTypes.find((t) => t.value === type);
  return typeData?.label || type;
};

export const getQuestionTypeDescription = (type: string): string => {
  const typeData = questionTypes.find((t) => t.value === type);
  return typeData?.description || "";
};

export const getQuestionTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    multiple_choice:
      "bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:ring-2 hover:ring-blue-400/50 hover:bg-blue-500/30",
    fill_blank:
      "bg-green-500/20 text-green-600 dark:text-green-400 hover:ring-2 hover:ring-green-400/50 hover:bg-green-500/30",
    true_false:
      "bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 hover:ring-2 hover:ring-fuchsia-400/50 hover:bg-fuchsia-500/30",
    translate:
      "bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:ring-2 hover:ring-purple-400/50 hover:bg-purple-500/30",
    writing:
      "bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:ring-2 hover:ring-orange-400/50 hover:bg-orange-500/30",
  };
  return (
    colors[type] ||
    "bg-muted text-muted-foreground hover:ring-2 hover:ring-gray-400/50 hover:bg-muted/40"
  );
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

export const getDifficultyDescription = (difficulty: number): string => {
  const difficultyData = questionDifficulties.find(
    (d) => d.value === difficulty
  );
  return difficultyData?.description || "";
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

export const calculateTagStats = (questions: any[]) => {
  return questions.reduce((acc, question) => {
    question.tags.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
};

export const getTopTags = (questions: any[], limit: number = 5) => {
  const tagStats = calculateTagStats(questions);
  return Object.entries(tagStats)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, limit);
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

  if (!filters.types || filters.types.length === 0) {
    errors.push("Debe seleccionar al menos un tipo de pregunta");
  }

  if (filters.numberOfQuestions < 1 || filters.numberOfQuestions > 50) {
    errors.push("El número de preguntas debe estar entre 1 y 50");
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
