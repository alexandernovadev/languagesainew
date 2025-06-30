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
import {
  BookOpen,
  Clock,
  Users,
  Bot,
  PenTool,
  Calendar,
  Hash,
} from "lucide-react";

interface Exam {
  _id: string;
  title: string;
  description?: string;
  language: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topic?: string;
  source?: "manual" | "ai";
  timeLimit?: number;
  adaptive?: boolean;
  version?: number;
  questions?: Array<{
    question: string;
    weight?: number;
    order?: number;
  }>;
  createdBy?: string;
  metadata?: {
    difficultyScore?: number;
    estimatedDuration?: number;
  };
  createdAt: string;
  updatedAt: string;
}

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Detalles del Examen
          </DialogTitle>
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
                    <Badge variant={exam.source === "ai" ? "default" : "secondary"}>
                      {exam.source === "ai" ? "IA" : "Manual"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">v{exam.version}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Details */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Información del Examen</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Idioma</p>
                    <p className="text-sm">{exam.language}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nivel</p>
                    <Badge variant="outline">{exam.level}</Badge>
                  </div>
                  {exam.topic && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tema</p>
                      <p className="text-sm">{exam.topic}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <div className="flex items-center gap-2">
                      {exam.source === "ai" ? (
                        <Bot className="w-4 h-4 text-blue-500" />
                      ) : (
                        <PenTool className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {exam.source === "ai" ? "Generado por IA" : "Creado manualmente"}
                      </span>
                    </div>
                  </div>
                </div>

                {exam.metadata && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Metadatos
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {exam.metadata.difficultyScore && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Dificultad
                          </p>
                          <p className="text-sm">{exam.metadata.difficultyScore}/100</p>
                        </div>
                      )}
                      {exam.metadata.estimatedDuration && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Duración estimada
                          </p>
                          <p className="text-sm">{exam.metadata.estimatedDuration} min</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Fechas</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Creado</p>
                    <p className="text-sm">{formatDate(exam.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actualizado</p>
                    <p className="text-sm">{formatDate(exam.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          {onEditExam && (
            <Button onClick={() => onEditExam(exam)}>
              Editar Examen
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 