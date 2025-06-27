import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Circle, Save, Check } from 'lucide-react';

interface QuestionOption {
  _id: string;
  value: string;
  label: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  text: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'translate' | 'writing';
  isSingleAnswer: boolean;
  options?: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  tags: string[];
}

interface ExamQuestionTakingProps {
  question: Question;
  questionNumber: number;
  currentAnswer: any;
  onAnswerSubmit: (answer: any) => void;
  isAnswered: boolean;
}

export function ExamQuestionTaking({
  question,
  questionNumber,
  currentAnswer,
  onAnswerSubmit,
  isAnswered
}: ExamQuestionTakingProps) {
  const [answer, setAnswer] = useState<any>(currentAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update local answer when currentAnswer prop changes
  useEffect(() => {
    setAnswer(currentAnswer || '');
  }, [currentAnswer]);

  // Auto-save function
  const autoSave = async (value: any) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    setIsSaving(true);
    try {
      await onAnswerSubmit(value);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save for text inputs
  const debouncedAutoSave = (value: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      autoSave(value);
    }, 1000); // 1 second delay
  };

  const handleAnswerChange = (value: any) => {
    setAnswer(value);
    
    // Immediate save for multiple choice and true/false
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      autoSave(value);
    } else {
      // Debounced save for text inputs
      debouncedAutoSave(value);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const getQuestionTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      multiple_choice: 'Opción múltiple',
      fill_blank: 'Completar espacios',
      true_false: 'Verdadero/Falso',
      translate: 'Traducción',
      writing: 'Escritura'
    };
    return typeLabels[type] || type;
  };

  const getQuestionTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      multiple_choice: 'bg-blue-100 text-blue-800',
      fill_blank: 'bg-green-100 text-green-800',
      true_false: 'bg-purple-100 text-purple-800',
      translate: 'bg-orange-100 text-orange-800',
      writing: 'bg-red-100 text-red-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  // Premium option card component
  const PremiumOptionCard = ({ option, isSelected, onSelect }: { 
    option: QuestionOption; 
    isSelected: boolean; 
    onSelect: () => void;
  }) => {
    const optionLetter = option.value.toUpperCase();
    
    return (
      <div
        onClick={onSelect}
        className={`
          relative cursor-pointer
          p-3 rounded-xl border-2
          transition-colors duration-200 ease-out
          ${isSelected 
            ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/20 shadow-lg' 
            : 'border-gray-600 bg-gray-800/50'
          }
          ${isAnswered && isSelected 
            ? 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20' 
            : ''
          }
        `}
      >
        {/* Selection indicator */}
        <div className={`
          absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-colors duration-200 ease-out
          ${isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-500 bg-gray-700'
          }
          ${isAnswered && isSelected 
            ? 'border-emerald-500 bg-emerald-500' 
            : ''
          }
        `}>
          {isSelected && (
            <Check className="w-3 h-3 text-white transition-opacity duration-200" strokeWidth={3} />
          )}
        </div>

        {/* Option content - compact layout */}
        <div className="flex items-start gap-3 pr-8">
          {/* Option letter */}
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0
            transition-colors duration-200 ease-out
            ${isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-600 text-gray-300'
            }
            ${isAnswered && isSelected 
              ? 'bg-emerald-500 text-white' 
              : ''
            }
          `}>
            {optionLetter}
          </div>

          {/* Option text */}
          <p className={`
            text-sm leading-relaxed transition-colors duration-200 ease-out flex-1
            ${isSelected 
              ? 'text-gray-100 font-medium' 
              : 'text-gray-300'
            }
          `}>
            {option.label}
          </p>
        </div>
      </div>
    );
  };

  // Premium true/false option card
  const PremiumTrueFalseCard = ({ value, label, isSelected, onSelect }: {
    value: string;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
  }) => {
    const isTrue = value === 'true';
    
    return (
      <div
        onClick={onSelect}
        className={`
          relative cursor-pointer
          p-4 rounded-xl border-2
          transition-colors duration-200 ease-out
          ${isSelected 
            ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/20 shadow-lg' 
            : 'border-gray-600 bg-gray-800/50'
          }
          ${isAnswered && isSelected 
            ? 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20' 
            : ''
          }
        `}
      >
        {/* Selection indicator */}
        <div className={`
          absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-colors duration-200 ease-out
          ${isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-500 bg-gray-700'
          }
          ${isAnswered && isSelected 
            ? 'border-emerald-500 bg-emerald-500' 
            : ''
          }
        `}>
          {isSelected && (
            <Check className="w-3 h-3 text-white transition-opacity duration-200" strokeWidth={3} />
          )}
        </div>

        {/* Content - compact layout */}
        <div className="flex items-center gap-3 pr-8">
          {/* Icon */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0
            transition-colors duration-200 ease-out
            ${isSelected 
              ? isTrue ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              : 'bg-gray-600 text-gray-300'
            }
            ${isAnswered && isSelected 
              ? isTrue ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              : ''
            }
          `}>
            {isTrue ? '✓' : '✗'}
          </div>

          {/* Label */}
          <p className={`
            text-base font-semibold transition-colors duration-200 ease-out flex-1
            ${isSelected 
              ? 'text-gray-100' 
              : 'text-gray-300'
            }
          `}>
            {label}
          </p>
        </div>
      </div>
    );
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={answer}
              onValueChange={handleAnswerChange}
              className="grid gap-4"
            >
              {question.options?.map((option) => (
                <PremiumOptionCard
                  key={option._id}
                  option={option}
                  isSelected={answer === option.value}
                  onSelect={() => handleAnswerChange(option.value)}
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
              onValueChange={handleAnswerChange}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <PremiumTrueFalseCard
                value="true"
                label="Verdadero"
                isSelected={answer === 'true'}
                onSelect={() => handleAnswerChange('true')}
              />
              <PremiumTrueFalseCard
                value="false"
                label="Falso"
                isSelected={answer === 'false'}
                onSelect={() => handleAnswerChange('false')}
              />
            </RadioGroup>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[100px] resize-none border border-gray-600 bg-gray-900 text-gray-100 focus:border-gray-400 focus:ring-0 transition-all duration-200"
            />
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Escribe tu traducción aquí..."
              className="min-h-[120px] resize-none border border-gray-600 bg-gray-900 text-gray-100 focus:border-gray-400 focus:ring-0 transition-all duration-200"
            />
          </div>
        );

      case 'writing':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[150px] resize-none border border-gray-600 bg-gray-900 text-gray-100 focus:border-gray-400 focus:ring-0 transition-all duration-200"
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

  const hasValidAnswer = () => {
    if (answer === null || answer === undefined || answer === '') {
      return false;
    }

    // For multiple choice and true/false, check if it's a valid option
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      if (question.type === 'multiple_choice') {
        return question.options?.some(opt => opt.value === answer);
      }
      return answer === 'true' || answer === 'false';
    }

    // For text-based questions, check if it's not just whitespace
    if (typeof answer === 'string') {
      return answer.trim().length > 0;
    }

    return true;
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold text-base">
              {questionNumber}
            </div>
            <Badge variant="yellow" className="text-xs">
              {getQuestionTypeLabel(question.type)}
            </Badge>
            {isSaving && (
              <Badge variant="outline" className="text-xs">
                <Save className="h-3 w-3 mr-1 animate-spin" />
                Guardando...
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-medium leading-relaxed">
            {question.text}
          </h3>
        </div>
        
        {/* Answered indicator on the right */}
        {isAnswered && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors cursor-help border border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Respondida</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {renderQuestionContent()}
      </div>
    </div>
  );
} 