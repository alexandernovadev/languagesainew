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
import { X, Edit, BookOpen, Clock, Users } from "lucide-react";
import { Exam } from "@/services/examService";
import { ExamQuestionView } from "./ExamQuestionView";

// Tipo para pregunta poblada del backend
interface PopulatedQuestion {
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
}

// Tipo que permite tanto ID como objeto poblado
interface ExamQuestionItem {
  question: string | PopulatedQuestion;
  weight?: number;
  order?: number;
}

// Extender la interfaz Exam para este componente
interface ExamWithPopulatedQuestions extends Omit<Exam, 'questions'> {
  questions?: ExamQuestionItem[];
}

interface ExamViewModalProps {
  exam: ExamWithPopulatedQuestions | null;
  isOpen: boolean;
  onClose: () => void;
  onEditExam: (exam: ExamWithPopulatedQuestions) => void;
}

export default function ExamViewModal({
  exam,
  isOpen,
  onClose,
  onEditExam,
}: ExamViewModalProps) {
  if (!exam) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPopulatedQuestion = (question: string | PopulatedQuestion): question is PopulatedQuestion => {
    return typeof question === 'object' && question !== null && 'text' in question;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                Vista del Examen
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditExam(exam)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Exam Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{exam.title}</h2>
                    <p className="text-muted-foreground mt-1">{exam.description}</p>
                  </div>
                  <Badge variant="outline">{exam.level}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{exam.questions?.length || 0} preguntas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{exam.timeLimit || 'Sin límite'} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{exam.attemptsAllowed} intentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={exam.source === "ai" ? "default" : "secondary"}>
                      {exam.source === "ai" ? "IA" : "Manual"}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Idioma:</span>
                      <span className="ml-2">{exam.language}</span>
                    </div>
                    {exam.topic && (
                      <div>
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="ml-2">{exam.topic}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Creado:</span>
                      <span className="ml-2">{formatDate(exam.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Versión:</span>
                      <span className="ml-2">{exam.version || 1}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions usando ExamQuestionView */}
            <div className="space-y-6">
              {exam.questions && exam.questions.length > 0 ? (
                exam.questions.map((questionItem, index) => {
                  // Solo mostrar si la pregunta está poblada
                  if (isPopulatedQuestion(questionItem.question)) {
                    return (
                      <ExamQuestionView
                        key={index}
                        question={questionItem.question}
                        questionNumber={index + 1}
                        showAnswers={true}
                      />
                    );
                  } else {
                    // Fallback para preguntas no pobladas
                    return (
                      <Card key={index} className="mb-6">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Pregunta {index + 1}</h4>
                            <div className="flex gap-2">
                              {questionItem.weight && questionItem.weight !== 1 && (
                                <Badge variant="outline" className="text-xs">
                                  Peso: {questionItem.weight}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                Orden: {questionItem.order || index}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID de pregunta: {questionItem.question}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Esta pregunta no está poblada con sus detalles completos.
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }
                })
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">
                      No hay preguntas configuradas para este examen
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
