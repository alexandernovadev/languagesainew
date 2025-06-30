import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { examAttemptService } from "@/services/examAttemptService";
import { examService } from "@/services/examService";
import { toast } from "sonner";

interface ExamAttempt {
  _id: string;
  user: string;
  exam: string;
  attemptNumber: number;
  answers: Array<{
    question: string;
    answer: any;
    submittedAt: string;
  }>;
  startedAt: string;
  submittedAt?: string;
  duration?: number;
  status: 'in_progress' | 'submitted' | 'graded';
  passed?: boolean;
  userNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Exam {
  _id: string;
  title: string;
  description?: string;
  level: string;
  topic?: string;
  questions?: Array<{
    question: string;
    weight?: number;
    order?: number;
  }>;
}

export default function ExamResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttemptData = async () => {
      if (!attemptId) return;

      try {
        setLoading(true);
        const [attemptData, examData] = await Promise.all([
          examAttemptService.getAttempt(attemptId),
          examService.getExam(attemptId).then(response => response.data)
        ]);

        setAttempt(attemptData);
        setExam(examData);
      } catch (error) {
        console.error("Error loading attempt data:", error);
        toast.error("Error", {
          description: "No se pudo cargar los resultados del examen",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAttemptData();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt || !exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No se encontraron resultados
          </h2>
          <Button onClick={() => navigate("/exams")}>
            Volver a Exámenes
          </Button>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/exams")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Resultados del Examen
            </h1>
            <p className="text-gray-600 mt-1">
              {exam.title} - Intento #{attempt.attemptNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Información del Examen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Título</p>
                  <p className="text-gray-900">{exam.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nivel</p>
                  <Badge variant="outline">{exam.level}</Badge>
                </div>
                {exam.topic && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tema</p>
                    <p className="text-gray-900">{exam.topic}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge 
                    variant={attempt.status === 'graded' ? 'default' : 'secondary'}
                  >
                    {attempt.status === 'in_progress' && 'En progreso'}
                    {attempt.status === 'submitted' && 'Enviado'}
                    {attempt.status === 'graded' && 'Calificado'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attempt Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Intento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de inicio</p>
                  <p className="text-gray-900">{formatDate(attempt.startedAt)}</p>
                </div>
                {attempt.submittedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de envío</p>
                    <p className="text-gray-900">{formatDate(attempt.submittedAt)}</p>
                  </div>
                )}
                {attempt.duration && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duración</p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(attempt.duration)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Preguntas respondidas</p>
                  <p className="text-gray-900">{attempt.answers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Notes */}
          {attempt.userNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas del Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">{attempt.userNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {attempt.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {attempt.passed ? 'Aprobado' : 'Pendiente de evaluación'}
                </span>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-gray-500">Puntuación</p>
                <p className="text-2xl font-bold text-gray-900">
                  {attempt.status === 'graded' ? 'Evaluado' : 'Pendiente'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/exams/${exam._id}`)}
              >
                Ver Examen
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/exams")}
              >
                Volver a Exámenes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
