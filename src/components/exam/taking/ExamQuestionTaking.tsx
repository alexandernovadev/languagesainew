import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  Map, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Question, QuestionOption } from './types';
import { cn } from '@/utils/common/classnames/cn';

interface ExamQuestionTakingProps {
  question: Question;
  questionNumber: number;
  currentAnswer: string[];
  isAnswered: boolean;
  onAnswerChange: (questionId: string, answer: string[]) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigate?: (questionIndex: number) => void;
  totalQuestions: number;
  answeredQuestions: number[];
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const ExamQuestionTaking: React.FC<ExamQuestionTakingProps> = ({
  question,
  questionNumber,
  currentAnswer,
  isAnswered,
  onAnswerChange,
  onNext,
  onPrevious,
  onNavigate,
  totalQuestions,
  answeredQuestions,
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Validation
  const isValidAnswer = () => {
    if (!currentAnswer || currentAnswer.length === 0) return false;
    
    switch (question.type) {
      case 'single_choice':
      case 'true_false':
        return currentAnswer.length === 1;
      case 'multiple_choice':
        return currentAnswer.length >= 1;
      case 'fill_blank':
      case 'translate':
      case 'writing':
        return currentAnswer.every(answer => answer.trim().length > 0);
      default:
        return true;
    }
  };

  const handleAnswerChange = (value: string | string[]) => {
    const newAnswer = Array.isArray(value) ? value : [value];
    onAnswerChange(question._id, newAnswer);
    setShowValidation(false);
  };

  const handleNext = () => {
    if (!isValidAnswer()) {
      setShowValidation(true);
      return;
    }
    onNext?.();
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single_choice: 'Opción Única',
      multiple_choice: 'Opción Múltiple',
      true_false: 'Verdadero/Falso',
      fill_blank: 'Completar',
      translate: 'Traducción',
      writing: 'Escritura'
    };
    return labels[type] || type;
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'single_choice':
        return (
          <RadioGroup
            value={currentAnswer[0] || ''}
            onValueChange={(value) => handleAnswerChange(value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div
                key={option._id}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                  currentAnswer.includes(option.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onClick={() => handleAnswerChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option._id} />
                <label
                  htmlFor={option._id}
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div
                key={option._id}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                  currentAnswer.includes(option.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onClick={() => {
                  const newAnswer = currentAnswer.includes(option.value)
                    ? currentAnswer.filter(a => a !== option.value)
                    : [...currentAnswer, option.value];
                  handleAnswerChange(newAnswer);
                }}
              >
                <Checkbox
                  checked={currentAnswer.includes(option.value)}
                  onCheckedChange={() => {
                    const newAnswer = currentAnswer.includes(option.value)
                      ? currentAnswer.filter(a => a !== option.value)
                      : [...currentAnswer, option.value];
                    handleAnswerChange(newAnswer);
                  }}
                />
                <label className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={currentAnswer[0] || ''}
            onValueChange={(value) => handleAnswerChange(value)}
            className="space-y-3"
          >
            {[
              { value: 'true', label: 'Verdadero' },
              { value: 'false', label: 'Falso' }
            ].map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                  currentAnswer.includes(option.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onClick={() => handleAnswerChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            {question.correctAnswers.map((_, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">
                  Respuesta {index + 1}:
                </label>
                <Input
                  value={currentAnswer[index] || ''}
                  onChange={(e) => {
                    const newAnswer = [...currentAnswer];
                    newAnswer[index] = e.target.value;
                    handleAnswerChange(newAnswer);
                  }}
                  placeholder="Escribe tu respuesta..."
                  className="w-full"
                />
              </div>
            ))}
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Traducción:</label>
              <Textarea
                value={currentAnswer[0] || ''}
                onChange={(e) => handleAnswerChange([e.target.value])}
                placeholder="Escribe tu traducción..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
        );

      case 'writing':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Respuesta:</label>
              <Textarea
                value={currentAnswer[0] || ''}
                onChange={(e) => handleAnswerChange([e.target.value])}
                placeholder="Escribe tu respuesta..."
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>
        );

      default:
        return <div>Tipo de pregunta no soportado</div>;
    }
  };

  return (
    <div className={cn(
      "transition-all duration-300",
      isFullScreen ? "fixed inset-0 z-50 bg-background" : "relative"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-muted-foreground">
              {questionNumber}
            </span>
            <span className="text-muted-foreground">/ {totalQuestions}</span>
          </div>
          <Badge variant="outline">
            {getQuestionTypeLabel(question.type)}
          </Badge>
          {isAnswered && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Respondida
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Modal */}
          <Dialog open={showNavigation} onOpenChange={setShowNavigation}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Map className="h-4 w-4 mr-2" />
                Navegación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Navegación de Preguntas</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
                {Array.from({ length: totalQuestions }, (_, index) => (
                  <Button
                    key={index}
                    variant={index + 1 === questionNumber ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-10 w-10 p-0",
                      answeredQuestions.includes(index + 1) && "bg-green-100 text-green-800 border-green-300"
                    )}
                    onClick={() => {
                      onNavigate?.(index);
                      setShowNavigation(false);
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Respondida</span>
              </div>
            </DialogContent>
          </Dialog>

          {/* Full Screen Toggle */}
          {onToggleFullScreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullScreen}
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestionContent()}

          {/* Validation Alert */}
          {showValidation && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Por favor, responde la pregunta antes de continuar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={questionNumber === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {answeredQuestions.length} de {totalQuestions} respondidas
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={questionNumber === totalQuestions}
          className="flex items-center gap-2"
        >
          {questionNumber === totalQuestions ? 'Finalizar' : 'Siguiente'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 