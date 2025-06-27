import React from 'react';
import { ExamQuestionTakingProps } from './types';
import { QuestionHeader } from './QuestionHeader';
import { QuestionContent } from './QuestionContent';
import { useAutoSave } from './useAutoSave';

export function ExamQuestionTaking({
  question,
  questionNumber,
  currentAnswer,
  onAnswerSubmit,
  isAnswered
}: ExamQuestionTakingProps) {
  const { answer, isSaving, handleAnswerChange } = useAutoSave({
    currentAnswer,
    onAnswerSubmit,
    questionType: question.type
  });

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <QuestionHeader
        questionNumber={questionNumber}
        questionType={question.type}
        questionText={question.text}
        isAnswered={isAnswered}
        isSaving={isSaving}
      />

      {/* Question Content */}
      <QuestionContent
        question={question}
        answer={answer}
        isAnswered={isAnswered}
        onAnswerChange={handleAnswerChange}
      />
    </div>
  );
} 