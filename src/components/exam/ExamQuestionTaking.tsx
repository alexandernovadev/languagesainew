import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

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

  // Update local answer when currentAnswer prop changes
  useEffect(() => {
    setAnswer(currentAnswer || '');
  }, [currentAnswer]);

  const handleAnswerChange = (value: any) => {
    setAnswer(value);
  };

  const handleSubmit = async () => {
    if (answer === null || answer === undefined || answer === '') {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAnswerSubmit(answer);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option._id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option._id} />
                <Label htmlFor={option._id} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={answer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">Verdadero</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">Falso</Label>
            </div>
          </RadioGroup>
        );

      case 'fill_blank':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="min-h-[100px]"
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
              className="min-h-[120px]"
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
              className="min-h-[150px]"
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
            <Badge variant="outline" className="text-sm">
              Pregunta {questionNumber}
            </Badge>
            <Badge variant="yellow" className="text-xs">
              {getQuestionTypeLabel(question.type)}
            </Badge>
            {isAnswered && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Respondida
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-medium leading-relaxed">
            {question.text}
          </h3>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {renderQuestionContent()}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!hasValidAnswer() || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Respuesta'}
        </Button>
      </div>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 