import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Trophy,
} from "lucide-react";
import { ExamAttempt } from "@/services/examAttemptService";
import { formatDateShort } from "@/utils/common/time/formatDate";
import ViewExamResultsButton from "./ViewExamResultsButton";

interface ExamAttemptCardProps {
  attempt: ExamAttempt;
  onViewDetails?: (attemptId: string) => void;
  onContinue?: (attemptId: string) => void;
  onRetake?: (examId: string) => void;
}

const getStatusIcon = (status: ExamAttempt["status"]) => {
  switch (status) {
    case "in_progress":
      return <Play className="h-4 w-4" />;
    case "submitted":
      return <Clock className="h-4 w-4" />;
    case "graded":
      return <CheckCircle className="h-4 w-4" />;
    case "abandoned":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getStatusColor = (status: ExamAttempt["status"]) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "submitted":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "graded":
      return "bg-green-100 text-green-800 border-green-200";
    case "abandoned":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: ExamAttempt["status"]) => {
  switch (status) {
    case "in_progress":
      return "En progreso";
    case "submitted":
      return "Enviado";
    case "graded":
      return "Calificado";
    case "abandoned":
      return "Abandonado";
    default:
      return "Desconocido";
  }
};

const getScoreColor = (score?: number, maxScore?: number) => {
  if (!score || !maxScore) return "text-gray-600";

  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const ExamAttemptCard: React.FC<ExamAttemptCardProps> = ({
  attempt,
  onViewDetails,
  onContinue,
  onRetake,
}) => {
  const isGraded = attempt.status === "graded";
  const isInProgress = attempt.status === "in_progress";
  const canContinue = isInProgress;
  const canRetake = isGraded || attempt.status === "abandoned";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Intento #{attempt._id.slice(-6)}
          </CardTitle>
          <Badge variant={"default"}>
            <div className="flex items-center gap-1">
              {getStatusIcon(attempt.status)}
              {getStatusText(attempt.status)}
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información temporal */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Iniciado:</span>
            <p className="font-medium">{formatDateShort(attempt.startTime)}</p>
          </div>
          {attempt.submittedAt && (
            <div>
              <span className="text-gray-500">Enviado:</span>
              <p className="font-medium">
                {formatDateShort(attempt.submittedAt)}
              </p>
            </div>
          )}
          {attempt.gradedAt && (
            <div>
              <span className="text-gray-500">Calificado:</span>
              <p className="font-medium">{formatDateShort(attempt.gradedAt)}</p>
            </div>
          )}
        </div>

        {/* Puntuación */}
        {isGraded &&
          attempt.score !== undefined &&
          attempt.maxScore !== undefined && (
            <div className="border border-border border-dashed p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-200">Puntuación:</span>
                <span
                  className={`text-lg font-bold ${getScoreColor(
                    attempt.score,
                    attempt.maxScore
                  )}`}
                >
                  {attempt.score}/{attempt.maxScore}
                </span>
              </div>
              {attempt.aiFeedback && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {attempt.aiFeedback}
                </p>
              )}
            </div>
          )}

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          {isGraded && (
            <ViewExamResultsButton
              attemptId={attempt._id}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Ver Resultados
            </ViewExamResultsButton>
          )}

          {onViewDetails && !isGraded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(attempt._id)}
              className="flex-1"
            >
              Ver detalles
            </Button>
          )}

          {canContinue && onContinue && (
            <Button
              size="sm"
              onClick={() => onContinue(attempt._id)}
              className="flex-1"
            >
              Continuar
            </Button>
          )}

          {canRetake && onRetake && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRetake(attempt.exam._id)}
              className="flex-1"
            >
              Reintentar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
