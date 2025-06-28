import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Loader2,
  BarChart3,
  Eye,
} from "lucide-react";
import { examAttemptService } from "@/services/examAttemptService";
import { examService, Exam } from "@/services/examService";
import { toast } from "sonner";
import { ExamAttempt } from "@/lib/store/useExamAttemptStore";
import ExamResultsViewModal from "@/components/exam/ExamResultsViewModal";

export default function ExamResultsPage() {
  const { examId, attemptId } = useParams<{
    examId: string;
    attemptId: string;
  }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailedAttempt, setDetailedAttempt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!examId || !attemptId) return;

      try {
        setLoading(true);

        // Load exam and attempt data
        const [examResponse, attemptData] = await Promise.all([
          examService.getExam(examId),
          examAttemptService.getAttempt(attemptId),
        ]);

        if (examResponse.success && examResponse.data) {
          setExam(examResponse.data);
        }

        setAttempt(attemptData);
      } catch (error) {
        console.error("Error loading exam results:", error);
        toast.error("Error", {
          description: "No se pudieron cargar los resultados del examen",
        });
        navigate("/exams");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [examId, attemptId, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando resultados...</span>
        </div>
      </div>
    );
  }

  if (!exam || !attempt) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resultados no encontrados</h1>
          <Button onClick={() => navigate("/exams")}>Volver a exámenes</Button>
        </div>
      </div>
    );
  }

  const getAverageScore = () => {
    // First try to use AI evaluation if available and has valid scores
    if (attempt.aiEvaluation && hasValidAIEvaluation(attempt.aiEvaluation)) {
      const scores = [
        attempt.aiEvaluation.grammar || 0,
        attempt.aiEvaluation.fluency || 0,
        attempt.aiEvaluation.coherence || 0,
        attempt.aiEvaluation.vocabulary || 0,
      ].filter((score) => score > 0);

      if (scores.length > 0) {
        return Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        );
      }
    }

    // Fallback to individual answer scores
    if (attempt.answers && attempt.answers.length > 0) {
      const totalScore = attempt.answers.reduce(
        (sum, answer) => sum + (answer.score || 0),
        0
      );
      return Math.round(totalScore / attempt.answers.length);
    }

    return 0;
  };

  const hasValidAIEvaluation = (aiEvaluation: any) => {
    return (
      aiEvaluation &&
      ((aiEvaluation.grammar !== undefined && aiEvaluation.grammar > 0) ||
        (aiEvaluation.fluency !== undefined && aiEvaluation.fluency > 0) ||
        (aiEvaluation.coherence !== undefined && aiEvaluation.coherence > 0) ||
        (aiEvaluation.vocabulary !== undefined && aiEvaluation.vocabulary > 0))
    );
  };

  const getIndividualAccuracy = () => {
    if (!attempt.answers || attempt.answers.length === 0) return 0;
    const correctCount = attempt.answers.filter(
      (answer) => answer.isCorrect
    ).length;
    return Math.round((correctCount / attempt.answers.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 80) return "Muy bien";
    if (score >= 70) return "Bien";
    if (score >= 60) return "Aceptable";
    return "Necesita mejorar";
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const averageScore = getAverageScore();

  const handleViewDetailedResults = async () => {
    if (!attemptId) return;

    try {
      // Obtener los datos completos del intento desde el backend
      const response = await examAttemptService.getAttempt(attemptId);
      if (response) {
        setDetailedAttempt(response);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error loading detailed attempt:", error);
      toast.error("Error", {
        description: "No se pudieron cargar los resultados detallados",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate("/exams")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground">
            Resultados del intento #{attempt.attemptNumber}
          </p>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Puntaje General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div
              className="text-6xl font-bold"
              style={{ color: getScoreColor(averageScore) }}
            >
              {averageScore}%
            </div>
            <div className="text-xl font-medium">
              {getScoreLabel(averageScore)}
            </div>
            <div className="flex items-center justify-center gap-2">
              {attempt.passed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span
                className={attempt.passed ? "text-green-600" : "text-red-600"}
              >
                {attempt.passed ? "Aprobado" : "No aprobado"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      {attempt.aiEvaluation && hasValidAIEvaluation(attempt.aiEvaluation) ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evaluación Detallada por IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attempt.aiEvaluation.grammar && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Gramática</span>
                    <span
                      className={`font-bold ${getScoreColor(
                        attempt.aiEvaluation.grammar
                      )}`}
                    >
                      {attempt.aiEvaluation.grammar}%
                    </span>
                  </div>
                  <Progress
                    value={attempt.aiEvaluation.grammar}
                    className="h-2"
                  />
                </div>
              )}

              {attempt.aiEvaluation.fluency && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fluidez</span>
                    <span
                      className={`font-bold ${getScoreColor(
                        attempt.aiEvaluation.fluency
                      )}`}
                    >
                      {attempt.aiEvaluation.fluency}%
                    </span>
                  </div>
                  <Progress
                    value={attempt.aiEvaluation.fluency}
                    className="h-2"
                  />
                </div>
              )}

              {attempt.aiEvaluation.coherence && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Coherencia</span>
                    <span
                      className={`font-bold ${getScoreColor(
                        attempt.aiEvaluation.coherence
                      )}`}
                    >
                      {attempt.aiEvaluation.coherence}%
                    </span>
                  </div>
                  <Progress
                    value={attempt.aiEvaluation.coherence}
                    className="h-2"
                  />
                </div>
              )}

              {attempt.aiEvaluation.vocabulary && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Vocabulario</span>
                    <span
                      className={`font-bold ${getScoreColor(
                        attempt.aiEvaluation.vocabulary
                      )}`}
                    >
                      {attempt.aiEvaluation.vocabulary}%
                    </span>
                  </div>
                  <Progress
                    value={attempt.aiEvaluation.vocabulary}
                    className="h-2"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Precisión de Respuestas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div
                className="text-4xl font-bold"
                style={{ color: getScoreColor(getIndividualAccuracy()) }}
              >
                {getIndividualAccuracy()}%
              </div>
              <div className="text-lg">
                {attempt.answers.filter((answer) => answer.isCorrect).length} de{" "}
                {attempt.answers.length} respuestas correctas
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exam Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Examen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nivel estimado:</span>
                <Badge variant="outline">
                  {attempt.cefrEstimated || "No evaluado"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duración:</span>
                <span>
                  {attempt.duration
                    ? formatDuration(attempt.duration)
                    : "No registrado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de inicio:</span>
                <span>{new Date(attempt.startedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Preguntas respondidas:
                </span>
                <span>
                  {attempt.answers.length} de {exam.questions?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <Badge
                  variant={
                    attempt.status === "graded"
                      ? "secondary"
                      : attempt.status === "submitted"
                      ? "yellow"
                      : "blue"
                  }
                >
                  {attempt.status === "graded"
                    ? "Calificado"
                    : attempt.status === "submitted"
                    ? "Enviado"
                    : "En proceso"}
                </Badge>
              </div>
              {attempt.submittedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de envío:</span>
                  <span>
                    {new Date(attempt.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Comments */}
      {attempt.aiEvaluation?.comments && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comentarios de la IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {attempt.aiEvaluation.comments}
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Notes */}
      {attempt.aiNotes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{attempt.aiNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate(`/exams/${examId}/take`)}
          className="flex-1"
        >
          Tomar Otro Intento
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/exams")}
          className="flex-1"
        >
          Ver Todos los Exámenes
        </Button>
        <Button
          variant="outline"
          onClick={handleViewDetailedResults}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Resultados Detallados
        </Button>
      </div>

      {/* Detailed Results Modal */}
      {detailedAttempt && (
        <ExamResultsViewModal
          examAttempt={detailedAttempt}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
