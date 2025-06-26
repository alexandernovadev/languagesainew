import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Minus } from 'lucide-react';

interface ExamProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: number[];
  onQuestionClick: (index: number) => void;
}

export function ExamProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  onQuestionClick
}: ExamProgressProps) {
  const getQuestionStatus = (index: number) => {
    if (index === currentIndex) return 'current';
    if (answeredQuestions.includes(index)) return 'answered';
    return 'unanswered';
  };

  const getQuestionIcon = (index: number) => {
    const status = getQuestionStatus(index);
    
    switch (status) {
      case 'current':
        return <Circle className="h-4 w-4 fill-current" />;
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getQuestionVariant = (index: number) => {
    const status = getQuestionStatus(index);
    
    switch (status) {
      case 'current':
        return 'default';
      case 'answered':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Show only a subset of questions if there are too many
  const maxVisibleQuestions = 20;
  const showAllQuestions = totalQuestions <= maxVisibleQuestions;

  const renderQuestionButtons = () => {
    if (showAllQuestions) {
      return Array.from({ length: totalQuestions }, (_, index) => (
        <Button
          key={index}
          variant={getQuestionVariant(index)}
          size="sm"
          onClick={() => onQuestionClick(index)}
          className={`w-10 h-10 p-0 flex items-center justify-center border-white \
            ${getQuestionStatus(index) === 'current' ? 'text-white' : ''} \
            hover:bg-white/10 hover:border-white`}
        >
          {getQuestionIcon(index)}
          <span className="sr-only">Pregunta {index + 1}</span>
        </Button>
      ));
    }

    // Show paginated questions
    const startIndex = Math.max(0, Math.min(currentIndex - 5, totalQuestions - maxVisibleQuestions));
    const endIndex = Math.min(startIndex + maxVisibleQuestions, totalQuestions);

    return (
      <>
        {startIndex > 0 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuestionClick(0)}
              className="w-10 h-10 p-0"
            >
              1
            </Button>
            <span className="text-gray-400">...</span>
          </div>
        )}
        
        {Array.from({ length: endIndex - startIndex }, (_, i) => {
          const index = startIndex + i;
          return (
            <Button
              key={index}
              variant={getQuestionVariant(index)}
              size="sm"
              onClick={() => onQuestionClick(index)}
              className="w-10 h-10 p-0 flex items-center justify-center"
            >
              {getQuestionIcon(index)}
              <span className="sr-only">Pregunta {index + 1}</span>
            </Button>
          );
        })}
        
        {endIndex < totalQuestions && (
          <div className="flex items-center gap-1">
            <span className="text-gray-400">...</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuestionClick(totalQuestions - 1)}
              className="w-10 h-10 p-0"
            >
              {totalQuestions}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Progreso del examen</h3>
        <div className="text-sm text-muted-foreground">
          {answeredQuestions.length} de {totalQuestions} respondidas
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {renderQuestionButtons()}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Circle className="h-3 w-3 fill-current" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span>Respondida</span>
        </div>
        <div className="flex items-center gap-1">
          <Minus className="h-3 w-3 text-gray-400" />
          <span>Sin responder</span>
        </div>
      </div>
    </div>
  );
} 