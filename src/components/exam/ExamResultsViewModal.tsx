import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Brain,
  BarChart3,
  Eye,
  Download,
  Share2,
  ArrowRight,
  Star,
  Timer,
  Award,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/utils/common/classnames/cn';

interface ExamResult {
  _id: string;
  exam: {
    _id: string;
    title: string;
    level: string;
    language: string;
    topic?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'submitted' | 'graded' | 'abandoned';
  startTime: string;
  submittedAt: string;
  gradedAt?: string;
  score: number;
  maxScore: number;
  aiFeedback?: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    options: Array<{
      value: string;
      label: string;
      isCorrect: boolean;
    }>;
    userAnswer: string[];
    aiComment?: string;
    isCorrect?: boolean;
    points?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ExamResultsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResult | null;
  onRetakeExam?: () => void;
  onViewExam?: () => void;
}

export default function ExamResultsViewModal({
  isOpen,
  onClose,
  result,
  onRetakeExam,
  onViewExam,
}: ExamResultsViewModalProps) {
  if (!result) return null;

  const scorePercentage = Math.round((result.score / result.maxScore) * 100);
  const correctAnswers = result.answers.filter(answer => answer.isCorrect).length;
  const incorrectAnswers = result.answers.length - correctAnswers;
  const timeTaken = new Date(result.submittedAt).getTime() - new Date(result.startTime).getTime();
  const timeTakenMinutes = Math.round(timeTaken / (1000 * 60));

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 80) return 'Muy Bueno';
    if (percentage >= 70) return 'Bueno';
    if (percentage >= 60) return 'Aceptable';
    return 'Necesita Mejora';
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 90) return <Trophy className="h-5 w-5" />;
    if (percentage >= 80) return <Award className="h-5 w-5" />;
    if (percentage >= 70) return <Star className="h-5 w-5" />;
    if (percentage >= 60) return <Target className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Resultados del Examen
          </DialogTitle>
          <DialogDescription>
            {result.exam.title} - {formatDate(result.submittedAt)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Score Summary */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Puntuación Final</span>
                  <Badge variant="outline" className="text-sm">
                    {result.exam.level} • {result.exam.language}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Score */}
                  <div className="text-center">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg mb-2",
                      getScoreColor(scorePercentage)
                    )}>
                      {getScoreIcon(scorePercentage)}
                      {scorePercentage}%
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {getScoreLabel(scorePercentage)}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {result.score} / {result.maxScore}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex flex-col justify-center">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{scorePercentage}%</span>
                      </div>
                      <Progress value={scorePercentage} className="h-3" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Correctas:</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{correctAnswers}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Incorrectas:</span>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{incorrectAnswers}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tiempo:</span>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{timeTakenMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            {result.aiFeedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Feedback de IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm leading-relaxed text-purple-800 dark:text-purple-200">
                      {result.aiFeedback}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Análisis de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Estadísticas Generales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Preguntas respondidas:</span>
                        <span className="font-medium">{result.answers.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Precisión:</span>
                        <span className="font-medium">{Math.round((correctAnswers / result.answers.length) * 100)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tiempo promedio por pregunta:</span>
                        <span className="font-medium">{Math.round(timeTakenMinutes / result.answers.length)} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Comparación</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Rendimiento {scorePercentage >= 80 ? 'superior' : scorePercentage >= 60 ? 'promedio' : 'inferior'} al promedio</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span>Nivel: {result.exam.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gray-500" />
                  Detalles de Preguntas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.answers.map((answer, index) => (
                    <div
                      key={answer.questionId}
                      className={cn(
                        "p-4 rounded-lg border",
                        answer.isCorrect
                          ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                          : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          {answer.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        {answer.points && (
                          <Badge variant="secondary" className="text-xs">
                            {answer.points} pts
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          {answer.questionText}
                        </p>

                        {/* User Answer */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Tu respuesta:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {answer.userAnswer.map((ans, ansIndex) => (
                              <Badge
                                key={ansIndex}
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  answer.isCorrect
                                    ? "border-green-300 text-green-700 bg-green-100"
                                    : "border-red-300 text-red-700 bg-red-100"
                                )}
                              >
                                {ans}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Correct Answer */}
                        {!answer.isCorrect && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Respuesta correcta:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {answer.options
                                .filter(option => option.isCorrect)
                                .map((option, optIndex) => (
                                  <Badge
                                    key={optIndex}
                                    variant="outline"
                                    className="text-xs border-green-300 text-green-700 bg-green-100"
                                  >
                                    {option.label || option.value}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* AI Comment */}
                        {answer.aiComment && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded">
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                              Comentario de IA:
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {answer.aiComment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {onViewExam && (
              <Button variant="outline" onClick={onViewExam}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Examen
              </Button>
            )}
            {onRetakeExam && (
              <Button onClick={onRetakeExam}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Volver a Intentar
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 