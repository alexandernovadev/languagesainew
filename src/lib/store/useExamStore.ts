import { create } from 'zustand';
import { ExamQuestion, UnifiedExamQuestion, ExamGenerationResponse, examService } from '@/services/examService';

interface ExamStore {
  // Exam data
  exam: {
    title: string;
    topic: string;
    level: string;
    difficulty: string;
    questions: UnifiedExamQuestion[];
  } | null;
  
  // Editing state
  isEditing: boolean;
  editingQuestionIndex: number | null;
  editingField: 'title' | 'question' | 'answers' | 'explanation' | 'tags' | null;
  
  // Saving state
  isSaving: boolean;
  saveError: string | null;
  
  // Actions
  setExam: (exam: ExamStore['exam']) => void;
  updateExamTitle: (title: string) => void;
  updateQuestion: (index: number, question: UnifiedExamQuestion) => void;
  updateExplanation: (questionIndex: number, explanation: string) => void;
  updateTags: (questionIndex: number, tags: string[]) => void;
  startEditing: (questionIndex: number | null, field: ExamStore['editingField']) => void;
  stopEditing: () => void;
  saveExam: () => Promise<void>;
  resetExam: () => void;
  clearSaveError: () => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  exam: null,
  isEditing: false,
  editingQuestionIndex: null,
  editingField: null,
  isSaving: false,
  saveError: null,

  setExam: (exam) => set({ exam }),
  
  updateExamTitle: (title) => set((state) => ({
    exam: state.exam ? { ...state.exam, title } : null
  })),
  
  updateQuestion: (index, question) => set((state) => ({
    exam: state.exam ? {
      ...state.exam,
      questions: state.exam.questions.map((q, i) => i === index ? question : q)
    } : null
  })),
  
  updateExplanation: (questionIndex, explanation) => set((state) => ({
    exam: state.exam ? {
      ...state.exam,
      questions: state.exam.questions.map((q, i) => 
        i === questionIndex ? { ...q, explanation } : q
      )
    } : null
  })),
  
  updateTags: (questionIndex, tags) => set((state) => ({
    exam: state.exam ? {
      ...state.exam,
      questions: state.exam.questions.map((q, i) => 
        i === questionIndex ? { ...q, tags } : q
      )
    } : null
  })),
  
  startEditing: (questionIndex, field) => set({
    isEditing: true,
    editingQuestionIndex: questionIndex,
    editingField: field
  }),
  
  stopEditing: () => set({
    isEditing: false,
    editingQuestionIndex: null,
    editingField: null
  }),
  
  saveExam: async () => {
    const { exam } = get();
    if (!exam) {
      throw new Error('No hay examen para guardar');
    }
    
    set({ isSaving: true, saveError: null });
    
    try {
      console.log('Guardando examen:', exam);
      const result = await examService.saveExamWithQuestions(exam);
      console.log('Examen guardado exitosamente:', result);
      set({ isSaving: false, saveError: null });
      return result;
    } catch (error) {
      console.error('Error al guardar el examen:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el examen';
      set({ isSaving: false, saveError: errorMessage });
      throw new Error('Error al guardar el examen. Por favor, verifica los datos e intenta de nuevo.');
    }
  },
  
  resetExam: () => set({
    exam: null,
    isEditing: false,
    editingQuestionIndex: null,
    editingField: null,
    isSaving: false,
    saveError: null
  }),

  clearSaveError: () => set({ saveError: null })
})); 