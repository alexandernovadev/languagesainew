import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Award } from "lucide-react";
import ExamResultsViewModal from "./ExamResultsViewModal";

// Tipos basados en la respuesta del backend
interface ExamAttemptAnswer {
  question: {
    _id: string;
    text: string;
    type: 'single_choice' | 'multiple_choice' | 'fill_blank' | 'translate' | 'true_false' | 'writing';
    isSingleAnswer: boolean;
    level: string;
    topic: string;
    difficulty: number;
    options?: Array<{
      _id: string;
      value: string;
      label: string;
      isCorrect: boolean;
    }>;
    correctAnswers: string[];
    explanation: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  answer: string | string[];
  isCorrect: boolean;
  score: number;
  feedback: string;
  submittedAt: string;
  _id: string;
}

interface ExamAttempt {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  exam: {
    _id: string;
    title: string;
    description: string;
    language: string;
    level: string;
    topic: string;
    timeLimit: number;
    attemptsAllowed: number;
    source: string;
    version: number;
    createdAt: string;
  };
  attemptNumber: number;
  startedAt: string;
  status: string;
  answers: ExamAttemptAnswer[];
  duration: number;
  passed: boolean;
  submittedAt: string;
}

interface ViewExamResultsButtonProps {
  examAttempt: ExamAttempt;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function ViewExamResultsButton({
  examAttempt,
  variant = "outline",
  size = "sm",
  className = "",
  showIcon = true,
  children
}: ViewExamResultsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Calcular puntuación total
  const calculateTotalScore = () => {
    const totalScore = examAttempt.answers.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = examAttempt.answers.length * 100;
    return Math.round((totalScore / maxScore) * 100);
  };

  const totalScore = calculateTotalScore();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenModal}
        className={className}
      >
        {showIcon && <Eye className="w-4 h-4 mr-2" />}
        {children || `Ver Resultados (${totalScore}%)`}
      </Button>

      <ExamResultsViewModal
        examAttempt={examAttempt}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
} 