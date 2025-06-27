export interface QuestionOption {
  _id: string;
  value: string;
  label: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  text: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'translate' | 'writing';
  isSingleAnswer: boolean;
  options?: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  tags: string[];
}

export interface ExamQuestionTakingProps {
  question: Question;
  questionNumber: number;
  currentAnswer: any;
  onAnswerSubmit: (answer: any) => void;
  isAnswered: boolean;
} 