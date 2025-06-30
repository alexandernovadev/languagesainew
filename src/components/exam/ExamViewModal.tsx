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
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  Users,
  Bot,
  PenTool,
  Calendar,
  Hash,
  FileText,
  Settings,
  Brain,
  CheckCircle,
  Tag,
} from "lucide-react";
import { Exam } from "@/services/examService";
import { ExamHeader } from "./ExamHeader";
import {
  getLevelLabel,
  getLanguageLabel,
  getLevelColor,
  getSourceVariant,
  formatDate,
  getQuestionText,
  getQuestionType,
  getQuestionTypeLabel,
  getQuestionOptions,
  getQuestionCorrectAnswers,
  getQuestionTags,
  getQuestionExplanation,
} from "./helpers/examUtils";

interface ExamViewModalProps {
  exam: Exam | null;
  isOpen: boolean;
  onClose: () => void;
  onEditExam?: (exam: Exam) => void;
}

export default function ExamViewModal({
  exam,
  isOpen,
  onClose,
  onEditExam,
}: ExamViewModalProps) {
  if (!exam) return null;

  const getSourceIcon = (source?: string) => {
    return source === "ai" ? (
      <Brain className="w-4 h-4" />
    ) : (
      <PenTool className="w-4 h-4" />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Detalles del Examen
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Reutilizando ExamHeader */}
            <ExamHeader exam={exam} showStats={true} showEditButton={false} />

            {/* Compact Dates Section */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Creado: {formatDate(exam.createdAt)}</span>
                  </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Actualizado: {formatDate(exam.updatedAt)}</span>
                </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {exam._id.slice(-8)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Details */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Información del Examen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Idioma
                    </p>
                    <p className="text-sm font-medium">
                      {getLanguageLabel(exam.language)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nivel
                    </p>
                    <Badge variant={getLevelColor(exam.level)}>
                      {getLevelLabel(exam.level)}
                    </Badge>
                  </div>
                  {exam.topic && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tema
                      </p>
                      <p className="text-sm font-medium">{exam.topic}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tipo
                    </p>
                    <div className="flex items-center gap-2">
                      {getSourceIcon(exam.source)}
                      <span className="text-sm font-medium">
                        {exam.source === "ai"
                          ? "Generado por IA"
                          : "Creado manualmente"}
                      </span>
                    </div>
                  </div>
                  {exam.attemptsAllowed && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Intentos permitidos
                      </p>
                      <p className="text-sm font-medium">
                        {exam.attemptsAllowed}
                      </p>
                    </div>
                  )}
                  {exam.adaptive !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tipo de examen
                      </p>
                      <p className="text-sm font-medium">
                        {exam.adaptive ? "Adaptativo" : "No adaptativo"}
                      </p>
                    </div>
                  )}
                </div>

                {exam.metadata && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Metadatos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exam.metadata.difficultyScore && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Dificultad
                          </p>
                          <p className="text-sm font-medium">
                            {exam.metadata.difficultyScore}/100
                          </p>
                        </div>
                      )}
                      {exam.metadata.estimatedDuration && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Duración estimada
                          </p>
                          <p className="text-sm font-medium">
                            {exam.metadata.estimatedDuration} min
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions Section */}
            {exam.questions && exam.questions.length > 0 && (
            <Card>
              <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Preguntas del Examen ({exam.questions.length})
                  </h3>
              </CardHeader>
              <CardContent>
                  <div className="space-y-6">
                    {exam.questions.map((question, index) => {
                      const questionText = getQuestionText(question);
                      const questionType = getQuestionType(question);
                      const questionOptions = getQuestionOptions(question);
                      const correctAnswers =
                        getQuestionCorrectAnswers(question);
                      const questionTags = getQuestionTags(question);
                      const explanation = getQuestionExplanation(question);

                      return (
                        <div
                          key={index}
                          className="border rounded-lg p-6 bg-muted/20"
                        >
                          {/* Question Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {getQuestionTypeLabel(questionType)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {question.weight && (
                                <Badge variant="outline" className="text-xs">
                                  Peso: {question.weight}
                                </Badge>
                              )}
                              {question.order && (
                                <Badge variant="outline" className="text-xs">
                                  Orden: {question.order}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Question Text */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-foreground leading-relaxed">
                              {questionText}
                            </p>
                          </div>

                          {/* Options */}
                          {questionOptions.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                Opciones:
                              </h4>
                              <div className="space-y-2">
                                {questionOptions.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`flex items-center gap-2 p-2 rounded border ${
                                      option.isCorrect
                                        ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                        : "bg-muted/30 border-border"
                                    }`}
                                  >
                                    <span className="text-xs font-medium text-muted-foreground min-w-[20px]">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                                    <span className="text-sm flex-1">
                                      {option.label || option.value}
                                    </span>
                                    {option.isCorrect && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Correct Answers */}
                          {correctAnswers.length > 0 &&
                            questionOptions.length === 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                  Respuestas correctas:
                                </h4>
                                <div className="space-y-1">
                                  {correctAnswers.map((answer, answerIndex) => (
                                    <div
                                      key={answerIndex}
                                      className="flex items-center gap-2 p-2 rounded bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-sm">{answer}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Explanation */}
                          {explanation && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded dark:bg-blue-950/20 dark:border-blue-800">
                              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                Explicación:
                              </h4>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {explanation}
                              </p>
                            </div>
                          )}

                          {/* Tags */}
                          {questionTags.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-muted-foreground" />
                              <div className="flex flex-wrap gap-1">
                                {questionTags.map((tag, tagIndex) => (
                                  <Badge
                                    key={tagIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                  </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          {onEditExam && (
            <Button onClick={() => onEditExam(exam)}>Editar Examen</Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
