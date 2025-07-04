import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExamOptionCard } from "./ExamOptionCard";
import {
} from "./helpers/examUtils";
import { getExamTypeLabel } from "@/utils/common/examTypes";
import { GrammarExplanationTooltip } from "@/components/common/GrammarExplanationTooltip";

interface ExamQuestionViewProps {
  question: {
    _id: string;
    text: string;
    type:
      | "single_choice"
      | "multiple_choice"
      | "fill_blank"
      | "true_false"
      | "translate"
      | "writing";
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
  questionNumber: number;
  showAnswers?: boolean;
}

export function ExamQuestionView({
  question,
  questionNumber,
  showAnswers = true,
}: ExamQuestionViewProps) {
  // Helper para el círculo
  const renderCircle = (content: string, colorClass: string) => (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${colorClass} text-white`}
    >
      {content}
    </div>
  );

  // Helper para clases de hover (siempre verde)
  const hoverClass = "hover:ring-2 hover:ring-green-400/50";
  // Helper para color del círculo (siempre verde)
  const circleColor = "bg-green-500";

  const renderQuestionContent = () => {
    // Si hay options, mostrar con ExamOptionCard
    if (question.options && question.options.length > 0) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Respuestas:</h4>
          </div>
          <div className="grid gap-2">
            {question.options.map((option) => (
              <ExamOptionCard
                key={option._id}
                value={option.value}
                label={option.label}
                isCorrect={showAnswers ? option.isCorrect : false}
                hoverClass={hoverClass}
                circleColor={circleColor}
                badgeText={
                  showAnswers && option.isCorrect ? "Correcta" : undefined
                }
              />
            ))}
          </div>
        </div>
      );
    }

    // Si no hay options, fallback por tipo
    switch (question.type) {
      case "fill_blank":
      case "translate":
      case "writing":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">Respuestas:</h4>
            </div>
            <div className="grid gap-2">
              {question.correctAnswers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg border bg-green-500/10 border-green-500/20 transition-all duration-150 ${hoverClass}`}
                >
                  {renderCircle(
                    String.fromCharCode(65 + index),
                    "bg-green-500"
                  )}
                  <span className="font-medium">{answer}</span>
                  {showAnswers && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-green-500/20 text-green-600 dark:text-green-400"
                    >
                      Correcta
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "true_false":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">Respuestas:</h4>
            </div>
            <div className="grid gap-2">
              {["true", "false"].map((val, idx) => (
                <div
                  key={val}
                  className={`flex items-center p-3 rounded-lg border transition-all duration-150 ${
                    showAnswers && question.correctAnswers.includes(val)
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-muted/50 border-border"
                  } ${hoverClass}`}
                >
                  {renderCircle(
                    val === "true" ? "V" : "F",
                    showAnswers && question.correctAnswers.includes(val)
                      ? "bg-green-500"
                      : "bg-muted"
                  )}
                  <span
                    className={
                      showAnswers && question.correctAnswers.includes(val)
                        ? "font-medium"
                        : ""
                    }
                  >
                    {val === "true" ? "Verdadero" : "Falso"}
                  </span>
                  {showAnswers && question.correctAnswers.includes(val) && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-green-500/20 text-green-600 dark:text-green-400"
                    >
                      Correcta
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Tipo de pregunta no soportado</div>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-muted-foreground">
                Pregunta {questionNumber}
              </span>
              <Badge variant="yellow">
                {getExamTypeLabel(question.type)}
              </Badge>
            </div>
            <GrammarExplanationTooltip explanation={question.explanation}>
              <CardTitle className="text-lg leading-relaxed flex-1">
                {question.text}
              </CardTitle>
            </GrammarExplanationTooltip>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderQuestionContent()}

        {showAnswers && question.explanation && (
          <>
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Explicación:</h4>
              </div>
              <div
                className="p-4 bg-muted/50 rounded-lg prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: question.explanation }}
              />
            </div>
          </>
        )}

        {question.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Etiquetas:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
