import { create } from 'zustand';
import { ExamQuestion, ExamGenerationResponse } from '@/services/examService';

interface ExamStore {
  // Exam data
  exam: {
    title: string;
    topic: string;
    level: string;
    difficulty: string;
    questions: ExamQuestion[];
  } | null;
  
  // Editing state
  isEditing: boolean;
  editingQuestionIndex: number | null;
  editingField: 'title' | 'question' | 'answers' | 'explanation' | 'tags' | null;
  
  // Actions
  setExam: (exam: ExamStore['exam']) => void;
  updateExamTitle: (title: string) => void;
  updateQuestion: (index: number, question: ExamQuestion) => void;
  updateExplanation: (questionIndex: number, explanation: string) => void;
  updateTags: (questionIndex: number, tags: string[]) => void;
  startEditing: (questionIndex: number | null, field: ExamStore['editingField']) => void;
  stopEditing: () => void;
  saveExam: () => Promise<void>;
  resetExam: () => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  exam: null,
  isEditing: false,
  editingQuestionIndex: null,
  editingField: null,

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
    if (!exam) return;
    
    try {
      // TODO: Implement API call to save exam
      console.log('Saving exam:', exam);
      // await examService.saveExam(exam);
    } catch (error) {
      console.error('Error saving exam:', error);
      throw error;
    }
  },
  
  resetExam: () => set({
    exam: null,
    isEditing: false,
    editingQuestionIndex: null,
    editingField: null
  })
})); 