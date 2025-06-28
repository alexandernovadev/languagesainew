import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Eye, CheckCircle, XCircle, Clock, Award } from "lucide-react";
import { ExamQuestionView } from "./ExamQuestionView";

// Tipos basados en la respuesta del backend
interface ExamAttemptAnswer {
  question: {
    _id: string;
    text: string;
    type: 'multiple_choice' | 'fill_blank' | 'translate' | 'true_false' | 'writing';
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
  answer: string;
  isCorrect: boolean;
  score: number;
  feedback: string;
  submittedAt: string;
  _id: string;
}

interface ExamAttempt {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  exam: {
    _id: string;
    title: string;
    description: string;
    language: string;
    level: string;
    topic: string;
    timeLimit: number;
    attemptsAllowed: number;
    source: string;
    version: number;
    createdAt: string;
  };
  attemptNumber: number;
  startedAt: string;
  status: string;
  answers: ExamAttemptAnswer[];
  duration: number;
  passed: boolean;
  submittedAt: string;
}

interface ExamResultsViewModalProps {
  examAttempt: ExamAttempt | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamResultsViewModal({
  examAttempt,
  isOpen,
  onClose,
}: ExamResultsViewModalProps) {
  if (!examAttempt) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateTotalScore = () => {
    const totalScore = examAttempt.answers.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = examAttempt.answers.length * 100;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getCorrectAnswersCount = () => {
    return examAttempt.answers.filter(answer => answer.isCorrect).length;
  };

  const totalScore = calculateTotalScore();
  const correctAnswers = getCorrectAnswersCount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                Resultados del Examen
              </DialogTitle>
              <p className="text-muted-foreground">
                {examAttempt.exam.title}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[85vh] pr-4">
          <div className="space-y-6">
            {/* Exam Results Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{examAttempt.exam.title}</h2>
                    <p className="text-muted-foreground mt-1">{examAttempt.exam.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={examAttempt.passed ? "default" : "destructive"}>
                      {examAttempt.passed ? "Aprobado" : "No Aprobado"}
                    </Badge>
                    <Badge variant="outline">{examAttempt.exam.level}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{totalScore}% Puntuación</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{correctAnswers}/{examAttempt.answers.length} Correctas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDuration(examAttempt.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={examAttempt.exam.source === "ai" ? "default" : "secondary"}>
                      {examAttempt.exam.source === "ai" ? "IA" : "Manual"}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Estudiante:</span>
                      <span className="ml-2">{examAttempt.user.firstName} {examAttempt.user.lastName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Intento:</span>
                      <span className="ml-2">#{examAttempt.attemptNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Iniciado:</span>
                      <span className="ml-2">{formatDate(examAttempt.startedAt)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Finalizado:</span>
                      <span className="ml-2">{formatDate(examAttempt.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions with Results */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Preguntas y Respuestas</h3>
              {examAttempt.answers.map((answerItem, index) => (
                <Card key={answerItem._id} className="relative">
                  {/* Result indicator */}
                  <div className="absolute top-4 right-4 z-10">
                    {answerItem.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between pr-12">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-muted-foreground">
                            Pregunta {index + 1}
                          </span>
                          <Badge variant="yellow">
                            {answerItem.question.type === 'multiple_choice' && 'Opción Múltiple'}
                            {answerItem.question.type === 'true_false' && 'Verdadero/Falso'}
                            {answerItem.question.type === 'fill_blank' && 'Completar'}
                            {answerItem.question.type === 'translate' && 'Traducción'}
                            {answerItem.question.type === 'writing' && 'Escritura'}
                          </Badge>
                          <Badge variant={answerItem.isCorrect ? "default" : "destructive"}>
                            {answerItem.score}%
                          </Badge>
                        </div>
                        <h4 className="text-lg leading-relaxed">
                          {answerItem.question.text}
                        </h4>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* User's Answer */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Tu Respuesta:</h4>
                      </div>
                      <div className={`p-3 rounded-lg border ${
                        answerItem.isCorrect 
                          ? "bg-green-500/10 border-green-500/20" 
                          : "bg-red-500/10 border-red-500/20"
                      }`}>
                        <span className="font-medium">
                          {(() => {
                            // Limpiar y formatear la respuesta del usuario
                            let cleanAnswer = answerItem.answer || "Sin respuesta";
                            
                            // Si es una respuesta de opción múltiple, mostrar la letra y el texto
                            if (answerItem.question.options && answerItem.question.options.length > 0) {
                              const selectedOption = answerItem.question.options.find(
                                option => option.value === cleanAnswer
                              );
                              if (selectedOption) {
                                cleanAnswer = `${selectedOption.value}. ${selectedOption.label}`;
                              }
                            }
                            
                            // Si es true/false, mostrar el texto completo
                            if (cleanAnswer === "true") {
                              cleanAnswer = "Verdadero";
                            } else if (cleanAnswer === "false") {
                              cleanAnswer = "Falso";
                            }
                            
                            // Limpiar cualquier formato con guiones bajos
                            cleanAnswer = cleanAnswer.replace(/__+/g, '').trim();
                            
                            return cleanAnswer;
                          })()}
                        </span>
                        {answerItem.feedback && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {answerItem.feedback}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer and Explanation */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Respuesta Correcta:</h4>
                      </div>
                      <div className="grid gap-2">
                        {answerItem.question.options && answerItem.question.options.length > 0 ? (
                          answerItem.question.options.map((option) => (
                            <div
                              key={option._id}
                              className={`flex items-center p-3 rounded-lg border transition-all duration-150 ${
                                option.isCorrect
                                  ? "bg-green-500/10 border-green-500/20"
                                  : "bg-muted/50 border-border"
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                option.isCorrect ? "bg-green-500" : "bg-muted"
                              } text-white`}>
                                {option.value}
                              </div>
                              <span className={option.isCorrect ? "font-medium" : ""}>
                                {option.label}
                              </span>
                              {option.isCorrect && (
                                <Badge 
                                  variant={answerItem.isCorrect ? "default" : "destructive"}
                                  className="ml-auto"
                                >
                                  {answerItem.isCorrect ? "Correcta" : "Incorrecta"}
                                </Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 rounded-lg border bg-green-500/10 border-green-500/20">
                            <span className="font-medium">
                              {answerItem.question.correctAnswers.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Explanation */}
                    {answerItem.question.explanation && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">Explicación:</h4>
                        </div>
                        <div
                          className="p-4 bg-muted/50 rounded-lg prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: answerItem.question.explanation }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 