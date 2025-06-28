import { useState, useCallback } from 'react';
import { examService, ExamGenerationParams, ExamGenerationResponse, ExamQuestion, UnifiedExamQuestion } from '@/services/examService';
import { questionTypes, questionLevels, questionDifficulties } from '@/data/questionTypes';
import { toast } from 'sonner';

export interface ExamGeneratorState {
  isGenerating: boolean;
  generatedExam: ExamGenerationResponse | null;
  error: string | null;
  progress: number;
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
    progress: 0
  });

  const [filters, setFilters] = useState<ExamGeneratorFilters>({
    topic: '',
    grammarTopics: [],
    level: 'B1',
    numberOfQuestions: 10,
    types: ['multiple_choice', 'fill_blank', 'true_false'],
    difficulty: 3,
    userLang: 'es'
  });

  const updateFilter = useCallback((key: keyof ExamGeneratorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const generateExam = useCallback(async () => {
    if (!filters.topic.trim()) {
      const errorMsg = 'El tema es requerido';
      setState(prev => ({ ...prev, error: errorMsg }));
      toast.error("Error de validación", {
        description: errorMsg,
      });
      return;
    }

    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
      progress: 0,
      generatedExam: null
    }));

    try {
      const params: ExamGenerationParams = {
        topic: filters.topic.trim(),
        grammarTopics: filters.grammarTopics,
        level: filters.level as ExamGenerationParams['level'],
        numberOfQuestions: filters.numberOfQuestions,
        types: filters.types as ExamGenerationParams['types'],
        difficulty: filters.difficulty,
        userLang: filters.userLang
      };

      const examData = await examService.generateExamWithProgress(params, (data) => {
        setState(prev => ({ ...prev, progress: 50 }));
      });

      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedExam: examData,
        progress: 100
      }));

      toast.success("¡Examen generado!", {
        description: `Se generaron ${examData.data.questions.length} preguntas sobre "${filters.topic}"`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar el examen';
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        progress: 0
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
      progress: 0
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      topic: '',
      grammarTopics: [],
      level: 'B1',
      numberOfQuestions: 10,
      types: ['multiple_choice', 'fill_blank', 'true_false'],
      difficulty: 3,
      userLang: 'es'
    });
  }, []);

  const loadExistingExam = useCallback((examData: ExamGenerationResponse, topic: string, level: string) => {
    setState({
      isGenerating: false,
      generatedExam: examData,
      error: null,
      progress: 100
    });
    
    setFilters(prev => ({
      ...prev,
      topic,
      level
    }));

    toast.success("Examen cargado", {
      description: `Examen sobre "${topic}" cargado para edición`,
    });
  }, []);

  const getQuestionTypeLabel = useCallback((type: string) => {
    const questionType = questionTypes.find(qt => qt.value === type);
    return questionType?.label || type;
  }, []);

  const getLevelLabel = useCallback((level: string) => {
    const levelData = questionLevels.find(l => l.value === level);
    return levelData?.label || level;
  }, []);

  const getDifficultyLabel = useCallback((difficulty: number) => {
    const difficultyData = questionDifficulties.find(d => d.value === difficulty);
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
    questionDifficulties
  };
} 