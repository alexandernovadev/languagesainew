import { useState, useCallback, useEffect } from "react";
import {
  examService,
  ExamGenerationParams,
  ExamGenerationResponse,
  ExamQuestion,
  UnifiedExamQuestion,
} from "@/services/examService";
import {
  questionTypes,
  questionLevels,
  questionDifficulties,
} from "@/data/questionTypes";
import { toast } from "sonner";
import { getCategoryKeys, getCategoryInfo } from "@/components/exam/constants/grammarTopics";

export interface ExamGeneratorState {
  isGenerating: boolean;
  generatedExam: ExamGenerationResponse | null;
  error: string | null;
}

export interface ExamGeneratorFilters {
  topic: string;
  grammarTopics: string[];
  level: string;
  numberOfQuestions: number;
  types: string[];
  difficulty: number;
  userLang: string;
}

export function useExamGenerator() {
  const [state, setState] = useState<ExamGeneratorState>({
    isGenerating: false,
    generatedExam: null,
    error: null,
  });

  const [filters, setFilters] = useState<ExamGeneratorFilters>({
    topic: "",
    grammarTopics: [],
    level: "B2",
    numberOfQuestions: 8,
    types: ["single_choice", "multiple_choice"],
    difficulty: 4,
    userLang: "pt",
  });

  // Initialize with 4 random grammar topics
  useEffect(() => {
    const categoryKeys = getCategoryKeys();
    const allTopics = categoryKeys.flatMap(categoryKey => {
      const category = getCategoryInfo(categoryKey);
      return category?.topics || [];
    });
    
    // Select 4 random topics
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random());
    const randomTopics = shuffled.slice(0, 4);
    
    setFilters(prev => ({
      ...prev,
      grammarTopics: randomTopics
    }));
  }, []);

  const updateFilter = useCallback(
    (key: keyof ExamGeneratorFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const generateExam = useCallback(async () => {
    if (!filters.topic.trim()) {
      const errorMsg = "El tema es requerido";
      setState((prev) => ({ ...prev, error: errorMsg }));
      toast.error("Error de validación", {
        description: errorMsg,
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      generatedExam: null,
    }));

    try {
      const params: ExamGenerationParams = {
        topic: filters.topic.trim(),
        grammarTopics: filters.grammarTopics,
        level: filters.level as ExamGenerationParams["level"],
        numberOfQuestions: filters.numberOfQuestions,
        types: filters.types as ExamGenerationParams["types"],
        difficulty: filters.difficulty,
        userLang: filters.userLang,
      };

      const examData = await examService.generateExamWithProgress(params);

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedExam: examData,
      }));

      toast.success("¡Examen generado!", {
        description: `Se generaron ${examData.questions.length} preguntas sobre "${filters.topic}"`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al generar el examen";
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));

      toast.error("Error al generar examen", {
        description: errorMessage,
      });

      throw error;
    }
  }, [filters]);

  const resetExam = useCallback(() => {
    setState({
      isGenerating: false,
      generatedExam: null,
      error: null,
    });
  }, []);

  const resetFilters = useCallback(() => {
    const categoryKeys = getCategoryKeys();
    const allTopics = categoryKeys.flatMap(categoryKey => {
      const category = getCategoryInfo(categoryKey);
      return category?.topics || [];
    });
    
    // Select 4 random topics for reset
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random());
    const randomTopics = shuffled.slice(0, 4);
    
    setFilters({
      topic: "",
      grammarTopics: randomTopics,
      level: "B2",
      numberOfQuestions: 8,
      types: ["single_choice", "multiple_choice"],
      difficulty: 4,
      userLang: "pt",
    });
  }, []);

  const loadExistingExam = useCallback(
    (examData: ExamGenerationResponse, topic: string, level: string) => {
      setState({
        isGenerating: false,
        generatedExam: examData,
        error: null,
      });

      setFilters((prev) => ({
        ...prev,
        topic,
        level,
      }));

      toast.success("Examen cargado", {
        description: `Examen sobre "${topic}" cargado para edición`,
      });
    },
    []
  );

  const getQuestionTypeLabel = useCallback((type: string) => {
    const questionType = questionTypes.find((qt) => qt.value === type);
    return questionType?.label || type;
  }, []);

  const getLevelLabel = useCallback((level: string) => {
    const levelData = questionLevels.find((l) => l.value === level);
    return levelData?.label || level;
  }, []);

  const getDifficultyLabel = useCallback((difficulty: number) => {
    const difficultyData = questionDifficulties.find(
      (d) => d.value === difficulty
    );
    return difficultyData?.label || `Nivel ${difficulty}`;
  }, []);

  return {
    state,
    filters,
    updateFilter,
    generateExam,
    resetExam,
    resetFilters,
    loadExistingExam,
    getQuestionTypeLabel,
    getLevelLabel,
    getDifficultyLabel,
    questionTypes,
    questionLevels,
    questionDifficulties,
  };
}
