import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  EyeOff,
} from "lucide-react";
import { Question, QuestionOption } from "./types";
import { cn } from "@/utils/common/classnames/cn";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { getExamTypeLabel } from "@/utils/common/examTypes";

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
  onExit?: () => void;
  examTimeLimit?: number;
  timeRemaining?: number;
  isTimerRunning?: boolean;
  formatTimeRemaining?: (seconds: number) => string;
  onFinish?: () => void;
}

// Componente reutilizable para opciones tipo tarjeta con radio
const OptionCardRadio = ({
  option,
  checked,
  onChange,
  name,
  id
}: {
  option: { value: string; label: string; _id?: string };
  checked: boolean;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 p-2 rounded-md border transition-all duration-200 cursor-pointer",
      checked ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-muted/30"
    )}
    style={{ minHeight: 0 }}
    onClick={() => onChange(option.value)}
  >
    <RadioGroupItem value={option.value} id={id || option._id || option.value} checked={checked} />
    <label
      htmlFor={id || option._id || option.value}
      className="flex-1 cursor-pointer text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {option.label}
    </label>
  </div>
);

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
  onExit,
  examTimeLimit,
  timeRemaining,
  isTimerRunning,
  formatTimeRemaining,
  onFinish,
}) => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Validation
  const isValidAnswer = () => {
    if (!currentAnswer || currentAnswer.length === 0) return false;

    switch (question.type) {
      case "single_choice":
      case "true_false":
        return currentAnswer.length === 1;
      case "multiple_choice":
        return currentAnswer.length >= 1;
      case "fill_blank":
      case "translate":
      case "writing":
        return currentAnswer.every((answer) => answer.trim().length > 0);
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
    return getExamTypeLabel(type);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "single_choice":
        return (
          <RadioGroup
            value={currentAnswer[0] || ""}
            onValueChange={(value) => handleAnswerChange(value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <OptionCardRadio
                key={option._id || option.value}
                option={option}
                checked={currentAnswer.includes(option.value)}
                onChange={handleAnswerChange}
              />
            ))}
          </RadioGroup>
        );

      case "multiple_choice":
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
                    ? currentAnswer.filter((a) => a !== option.value)
                    : [...currentAnswer, option.value];
                  handleAnswerChange(newAnswer);
                }}
              >
                <Checkbox
                  checked={currentAnswer.includes(option.value)}
                  onCheckedChange={() => {
                    const newAnswer = currentAnswer.includes(option.value)
                      ? currentAnswer.filter((a) => a !== option.value)
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

      case "true_false":
        return (
          <RadioGroup
            value={currentAnswer[0] || ""}
            onValueChange={(value) => handleAnswerChange(value)}
            className="space-y-2"
          >
            {[{ value: "true", label: "Verdadero" }, { value: "false", label: "Falso" }].map((option) => (
              <OptionCardRadio
                key={option.value}
                option={option}
                checked={currentAnswer.includes(option.value)}
                onChange={handleAnswerChange}
              />
            ))}
          </RadioGroup>
        );

      case "fill_blank":
        return (
          <div className="space-y-4">
            {question.correctAnswers.map((_, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">
                  Respuesta {index + 1}:
                </label>
                {question.options && question.options.length > 0 ? (
                  <RadioGroup
                    value={currentAnswer[index] || ""}
                    onValueChange={(value) => {
                      const newAnswer = [...currentAnswer];
                      newAnswer[index] = value;
                      handleAnswerChange(newAnswer);
                    }}
                    className="space-y-2"
                  >
                    {question.options.map((option) => (
                      <OptionCardRadio
                        key={option.value + index}
                        option={option}
                        checked={currentAnswer[index] === option.value}
                        onChange={(value) => {
                          const newAnswer = [...currentAnswer];
                          newAnswer[index] = value;
                          handleAnswerChange(newAnswer);
                        }}
                        id={option.value + "-blank-" + index}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <Input
                    value={currentAnswer[index] || ""}
                    onChange={(e) => {
                      const newAnswer = [...currentAnswer];
                      newAnswer[index] = e.target.value;
                      handleAnswerChange(newAnswer);
                    }}
                    placeholder="Escribe tu respuesta..."
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>
        );

      case "translate":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Traducción:</label>
              <Textarea
                value={currentAnswer[0] || ""}
                onChange={(e) => handleAnswerChange([e.target.value])}
                placeholder="Escribe tu traducción..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
        );

      case "writing":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Respuesta:</label>
              <Textarea
                value={currentAnswer[0] || ""}
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
    <div
      className={cn(
        "transition-all duration-300",
        isFullScreen ? "fixed inset-0 z-50 bg-background" : "relative"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Temporizador junto al tipo de pregunta */}
          {examTimeLimit &&
            timeRemaining !== undefined &&
            formatTimeRemaining && (
              <span className="ml-2">
                <ExamTimer
                  timeRemaining={timeRemaining}
                  isRunning={!!isTimerRunning}
                  formatTime={formatTimeRemaining}
                />
              </span>
            )}
          <Badge variant="yellow">{getExamTypeLabel(question.type)}</Badge>

          {isAnswered && (
            <Badge variant="default">
              <CheckCircle className="h-3 w-3 mr-1" />
              Respondida
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de Salir */}
          {onExit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExit}
              className="ml-2"
            >
              Salir
            </Button>
          )}

          {/* Full Screen Toggle */}
          {onToggleFullScreen && (
            <Button variant="outline" size="sm" onClick={onToggleFullScreen}>
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
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
      <div className="flex items-center mt-4 gap-4 justify-end">
        <div>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={questionNumber === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-end">
          {questionNumber === totalQuestions ? (
            <Button
              onClick={onFinish}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-base font-semibold rounded-md shadow"
            >
              Finalizar Examen
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
