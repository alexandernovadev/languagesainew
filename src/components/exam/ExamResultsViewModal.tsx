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
import { X, Eye, CheckCircle, XCircle, Clock, Award, User, Hash, Play, CheckSquare, Bot, PenTool } from "lucide-react";
import { ExamQuestionView } from "./ExamQuestionView";

// Tipos basados en la respuesta del backend
interface ExamAttemptAnswer {
  question: {
    _id: string;
    text: string;
    type:
      | "multiple_choice"
      | "fill_blank"
      | "translate"
      | "true_false"
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
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateTotalScore = () => {
    const totalScore = examAttempt.answers.reduce(
      (sum, answer) => sum + answer.score,
      0
    );
    const maxScore = examAttempt.answers.length * 100;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getCorrectAnswersCount = () => {
    return examAttempt.answers.filter((answer) => answer.isCorrect).length;
  };

  const totalScore = calculateTotalScore();
  const correctAnswers = getCorrectAnswersCount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl">
        <DialogHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-0.5">
                  Resultados del Examen
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  {examAttempt.exam.title}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[85vh] pr-4">
          <div className="space-y-8 pb-24">
            {/* Exam Results Summary */}
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {examAttempt.exam.title}
                      </h2>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {examAttempt.exam.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={examAttempt.passed ? "default" : "destructive"}
                      className="px-3 py-1"
                    >
                      {examAttempt.passed ? "✅ Aprobado" : "❌ No Aprobado"}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {examAttempt.exam.level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 dark:bg-gray-800 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Puntuación
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {totalScore}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 dark:bg-gray-800 rounded-lg border border-green-200/50 dark:border-green-800/50">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Correctas</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {correctAnswers}/{examAttempt.answers.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 dark:bg-gray-800 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duración</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatDuration(examAttempt.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 dark:bg-gray-800 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                    <div className="p-2 dark:bg-orange-900/50 rounded-lg">
                      {examAttempt.exam.source === "ai" ? (
                        <Bot className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                      ) : (
                        <PenTool className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Origen</p>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {examAttempt.exam.source === "ai" ? "IA" : "Manual"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <User className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Estudiante
                        </p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          {examAttempt.user.firstName}{" "}
                          {examAttempt.user.lastName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <Hash className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Intento</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          #{examAttempt.attemptNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Play className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Iniciado
                        </p>
                        <p className="font-semibold text-purple-600 dark:text-purple-400">
                          {formatDate(examAttempt.startedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <CheckSquare className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Finalizado
                        </p>
                        <p className="font-semibold text-orange-600 dark:text-orange-400">
                          {formatDate(examAttempt.submittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions with Results */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Preguntas y Respuestas</h3>
              {examAttempt.answers.map((answerItem, index) => (
                <Card
                  key={answerItem._id}
                  className="relative overflow-hidden border-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Result indicator */}
                  <div className="absolute top-3 right-3 z-10">
                    {answerItem.isCorrect ? (
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-full shadow-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-full shadow-lg">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between pr-12">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white font-bold text-xs shadow-lg">
                            {index + 1}
                          </div>
                          <Badge variant="yellow" className="px-2 py-0.5 text-xs">
                            {answerItem.question.type === "multiple_choice" &&
                              "Opción Múltiple"}
                            {answerItem.question.type === "true_false" &&
                              "Verdadero/Falso"}
                            {answerItem.question.type === "fill_blank" &&
                              "Completar"}
                            {answerItem.question.type === "translate" &&
                              "Traducción"}
                            {answerItem.question.type === "writing" &&
                              "Escritura"}
                          </Badge>
                          <Badge
                            variant={
                              answerItem.isCorrect ? "default" : "destructive"
                            }
                            className="px-2 py-0.5 text-xs"
                          >
                            {answerItem.score}%
                          </Badge>
                        </div>
                        <h4 className="text-sm leading-relaxed font-medium">
                          {answerItem.question.text}
                        </h4>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Correct Answer and Explanation */}
                    <div className="space-y-2">
                      <div className="grid gap-2">
                        {answerItem.question.options &&
                        answerItem.question.options.length > 0 ? (
                          answerItem.question.options.map((option) => (
                            <div
                              key={option._id}
                              className={`flex items-center p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                                option.isCorrect
                                  ? "bg-green-500/10 border-green-500/30 shadow-sm"
                                  : "bg-muted/30 border-border hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 shadow-md ${
                                  option.isCorrect ? "bg-green-500" : "bg-muted"
                                } text-white font-bold text-xs`}
                              >
                                {option.value}
                              </div>
                              <span
                                className={`flex-1 text-sm ${
                                  option.isCorrect ? "font-semibold" : ""
                                }`}
                              >
                                {option.label}
                              </span>
                              {(() => {
                                // Para preguntas de true/false, convertir la respuesta del usuario
                                if (answerItem.question.type === "true_false") {
                                  const userAnswer = answerItem.answer;
                                  const optionValue = option.value;

                                  // Mapear respuestas de true/false a valores de opción
                                  if (
                                    userAnswer === "true" &&
                                    optionValue === "A"
                                  )
                                    return true;
                                  if (
                                    userAnswer === "false" &&
                                    optionValue === "B"
                                  )
                                    return true;
                                  return false;
                                }

                                // Para otras preguntas, comparar directamente
                                return answerItem.answer === option.value;
                              })() && (
                                <Badge
                                  variant="blue"
                                  className="ml-auto px-2 py-0.5 text-xs"
                                >
                                  Tu selección
                                </Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 rounded-lg border-2 bg-green-500/10 border-green-500/30 shadow-sm">
                            <span className="font-semibold text-sm">
                              {answerItem.question.correctAnswers.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Explanation */}
                    {answerItem.question.explanation && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-foreground text-sm">
                            Explicación:
                          </h4>
                        </div>
                        <div
                          className="p-3 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 prose prose-sm max-w-none dark:prose-invert shadow-sm"
                          dangerouslySetInnerHTML={{
                            __html: answerItem.question.explanation,
                          }}
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
