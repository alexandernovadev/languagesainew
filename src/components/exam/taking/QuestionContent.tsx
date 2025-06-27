import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { MultipleChoiceOption } from './MultipleChoiceOption';
import { TrueFalseOption } from './TrueFalseOption';
import { Question } from './types';

interface QuestionContentProps {
  question: Question;
  answer: any;
  isAnswered: boolean;
  onAnswerChange: (value: any) => void;
}

export function QuestionContent({
  question,
  answer,
  isAnswered,
  onAnswerChange
}: QuestionContentProps) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={answer}
              onValueChange={onAnswerChange}
              className="grid gap-4"
            >
              {question.options?.map((option) => (
                <MultipleChoiceOption
                  key={option._id}
                  option={option}
                  isSelected={answer === option.value}
                  isAnswered={isAnswered}
                  onSelect={() => onAnswerChange(option.value)}
                />
              ))}
            </RadioGroup>
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={answer}
              onValueChange={onAnswerChange}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <TrueFalseOption
                value="true"
                label="Verdadero"
                isSelected={answer === 'true'}
                isAnswered={isAnswered}
                onSelect={() => onAnswerChange('true')}
              />
              <TrueFalseOption
                value="false"
                label="Falso"
                isSelected={answer === 'false'}
                isAnswered={isAnswered}
                onSelect={() => onAnswerChange('false')}
              />
            </RadioGroup>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[100px] resize-none border border-gray-600 bg-gray-900/60 text-gray-100 focus:border-gray-400 focus:ring-0 transition-all duration-200"
            />
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Escribe tu traducción aquí..."
              className="min-h-[120px] resize-none border border-gray-600 bg-gray-900/60 text-gray-100 focus:border-gray-400 focus:ring-0 transition-all duration-200"
            />
          </div>
        );

      case 'writing':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[150px] resize-none border border-gray-600 bg-gray-900/60 text-gray-100 focus:border-gray-400 focus:ring-0 transition-all duration-200"
            />
          </div>
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Tipo de pregunta no soportado: {question.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderQuestionContent()}
    </div>
  );
} 