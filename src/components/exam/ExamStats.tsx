import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Target, Clock, Award } from 'lucide-react';
import { ExamGenerationResponse } from '@/services/examService';

interface ExamStatsProps {
  exam: ExamGenerationResponse;
}

export function ExamStats({ exam }: ExamStatsProps) {
  const totalQuestions = exam.questions.length;
  
  // Calculate statistics
  const questionTypeStats = exam.questions.reduce((acc, question) => {
    acc[question.type] = (acc[question.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tagStats = exam.questions.reduce((acc, question) => {
    question.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const estimatedTime = totalQuestions * 2; // 2 minutes per question average

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: 'Opción Múltiple',
      fill_blank: 'Completar Espacios',
      true_false: 'Verdadero/Falso',
      translate: 'Traducción',
      writing: 'Escritura'
    };
    return labels[type] || type;
  };

  const getQuestionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      multiple_choice: 'bg-blue-500',
      fill_blank: 'bg-green-500',
      true_false: 'bg-purple-500',
      translate: 'bg-orange-500',
      writing: 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
  };

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
          <p className="text-xs text-muted-foreground">
            Examen completo
          </p>
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
          <p className="text-xs text-muted-foreground">
            ~2 min por pregunta
          </p>
        </CardContent>
      </Card>

      {/* Question Types */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipos de Preguntas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Object.keys(questionTypeStats).length}</div>
          <p className="text-xs text-muted-foreground">
            Variedad de formatos
          </p>
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