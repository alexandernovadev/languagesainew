import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Users, FileText, Edit } from "lucide-react";
import { Exam } from "@/services/examService";
import { getLevelLabel } from "./helpers/examUtils";
import { formatDateShort } from "@/utils/common/time";

interface ExamHeaderProps {
  exam: Exam;
  showStats?: boolean;
  showEditButton?: boolean;
  onEditTitle?: () => void;
}

export function ExamHeader({
  exam,
  showStats = true,
  showEditButton = false,
  onEditTitle,
}: ExamHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {exam.title}
              </CardTitle>
              {showEditButton && onEditTitle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEditTitle}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">{exam.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Tema</h4>
            <p className="text-sm text-muted-foreground">{exam.topic}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Nivel</h4>
            <Badge>{getLevelLabel(exam.level)} SO</Badge>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Idioma</h4>
            <Badge variant="outline">{exam.language.toUpperCase()}</Badge>
          </div>
        </div>

        {showStats && (
          <>
            <Separator />
            {/* Estadísticas visuales modernas y adaptadas a dark mode */}
            <div className="flex flex-row justify-between gap-2 w-full mt-2 mb-2">
              <div className="flex flex-col items-center flex-1 bg-muted border border-border rounded-xl py-3 shadow-sm">
                <div className="bg-green-600/20 text-green-400 rounded-full p-2 mb-1">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-green-400">
                  {exam.questions?.length || 0}
                </span>
                <span className="text-xs font-medium mt-1 text-green-400">
                  Preguntas
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 bg-muted border border-border rounded-xl py-3 shadow-sm">
                <div className="bg-blue-600/20 text-blue-400 rounded-full p-2 mb-1">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-blue-400">
                  {exam.timeLimit}
                </span>
                <span className="text-xs font-medium mt-1 text-blue-400">
                  Minutos
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 bg-muted border border-border rounded-xl py-3 shadow-sm">
                <div className="bg-yellow-600/20 text-yellow-400 rounded-full p-2 mb-1">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-yellow-400">
                  {exam.attemptsAllowed}
                </span>
                <span className="text-xs font-medium mt-1 text-yellow-400">
                  Intentos
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 bg-muted border border-border rounded-xl py-3 shadow-sm">
                <div className="bg-purple-600/20 text-purple-400 rounded-full p-2 mb-1">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-purple-400">
                  {exam.version}
                </span>
                <span className="text-xs font-medium mt-1 text-purple-400">
                  Versión
                </span>
              </div>
            </div>
          </>
        )}

        {/* Información adicional */}
        <div className="flex gap-2 items-center">
          <Badge variant={exam.source === "ai" ? "blue" : "silver"}>
            {exam.source === "ai" ? "IA" : "Manual"}
          </Badge>
          {exam.adaptive && <Badge variant="outline">Adaptativo</Badge>}
          <span className="text-xs text-muted-foreground ml-auto">
            Creado: {formatDateShort(exam.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
