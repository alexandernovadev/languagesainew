import { useState, useCallback } from 'react';
import { examService, ExamGenerationParams, ExamGenerationResponse, ExamQuestion } from '@/services/examService';
import { questionTypes, questionLevels, questionDifficulties } from '@/data/questionTypes';

export interface ExamGeneratorState {
  isGenerating: boolean;
  generatedExam: ExamGenerationResponse | null;
  error: string | null;
  progress: number;
}

export interface ExamGeneratorFilters {
  topic: string;
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
      setState(prev => ({ ...prev, error: 'El tema es requerido' }));
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
        level: filters.level as ExamGenerationParams['level'],
        numberOfQuestions: filters.numberOfQuestions,
        types: filters.types as ExamGenerationParams['types'],
        difficulty: filters.difficulty,
        userLang: filters.userLang
      };

      const examData = await examService.generateExamStream(params, (data) => {
        setState(prev => ({ ...prev, progress: 50 }));
      });

      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedExam: examData,
        progress: 100
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Error al generar el examen'
      }));
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
      level: 'B1',
      numberOfQuestions: 10,
      types: ['multiple_choice', 'fill_blank', 'true_false'],
      difficulty: 3,
      userLang: 'es'
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
    getQuestionTypeLabel,
    getLevelLabel,
    getDifficultyLabel,
    questionTypes,
    questionLevels,
    questionDifficulties
  };
} 