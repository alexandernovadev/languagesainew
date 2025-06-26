import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, Clock, Award } from "lucide-react";
import { ExamGenerationResponse } from "@/services/examService";
import {
  calculateQuestionTypeStats,
  calculateEstimatedTime,
} from "./helpers/examUtils";

interface ExamStatsProps {
  exam: ExamGenerationResponse;
}

export function ExamStats({ exam }: ExamStatsProps) {
  const totalQuestions = exam.questions.length;
  const questionTypeStats = calculateQuestionTypeStats(exam.questions);
  const estimatedTime = calculateEstimatedTime(exam.questions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Preguntas</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <p className="text-xs text-muted-foreground">Examen completo</p>
        </CardContent>
      </Card>

      {/* Estimated Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Estimado</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estimatedTime} min</div>
          <p className="text-xs text-muted-foreground">~2 min por pregunta</p>
        </CardContent>
      </Card>

      {/* Question Types */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tipos de Preguntas
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Object.keys(questionTypeStats).length}
          </div>
          <p className="text-xs text-muted-foreground">Variedad de formatos</p>
        </CardContent>
      </Card>

      {/* Average Difficulty */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calidad IA</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Alta</div>
          <p className="text-xs text-muted-foreground">
            Generado con IA avanzada
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
