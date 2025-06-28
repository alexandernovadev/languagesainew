import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
      case 'single_choice':
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

      case 'multiple_choice':
        // Handle multiple choice with checkboxes for multiple selection
        const selectedAnswers = Array.isArray(answer) ? answer : [];
        
        const handleMultipleChoiceChange = (optionValue: string, checked: boolean) => {
          let newAnswers: string[];
          if (checked) {
            newAnswers = [...selectedAnswers, optionValue];
          } else {
            newAnswers = selectedAnswers.filter(val => val !== optionValue);
          }
          onAnswerChange(newAnswers);
        };

        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              {question.options?.map((option) => (
                <div
                  key={option._id}
                  className={`
                    relative cursor-pointer
                    p-3 rounded-xl border-2
                    transition-colors duration-200 ease-out
                    ${selectedAnswers.includes(option.value)
                      ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/20 shadow-lg' 
                      : 'border-gray-600 bg-gray-800/50'
                    }
                    ${isAnswered && selectedAnswers.includes(option.value)
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20' 
                      : ''
                    }
                  `}
                >
                  {/* Checkbox */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Checkbox
                      checked={selectedAnswers.includes(option.value)}
                      onCheckedChange={(checked) => handleMultipleChoiceChange(option.value, checked as boolean)}
                      className={`
                        w-5 h-5 border-2
                        ${selectedAnswers.includes(option.value)
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-500 bg-gray-700'
                        }
                        ${isAnswered && selectedAnswers.includes(option.value)
                          ? 'border-emerald-500 bg-emerald-500' 
                          : ''
                        }
                      `}
                    />
                  </div>

                  {/* Option content */}
                  <div className="flex items-start gap-3 pr-8">
                    {/* Option letter */}
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0
                      transition-colors duration-200 ease-out
                      ${selectedAnswers.includes(option.value)
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 text-gray-300'
                      }
                      ${isAnswered && selectedAnswers.includes(option.value)
                        ? 'bg-emerald-500 text-white' 
                        : ''
                      }
                    `}>
                      {option.value.toUpperCase()}
                    </div>

                    {/* Option text */}
                    <p className={`
                      text-sm leading-relaxed transition-colors duration-200 ease-out flex-1
                      ${selectedAnswers.includes(option.value)
                        ? 'text-gray-100 font-medium' 
                        : 'text-gray-300'
                      }
                    `}>
                      {option.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
        if (question.options && question.options.length > 0) {
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
        }
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