import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Eye, RefreshCw, FileText } from 'lucide-react';
import { ExamGenerationResponse } from '@/services/examService';
import { ExamGeneratorFilters } from '@/hooks/useExamGenerator';
import { ExamStats } from './ExamStats';

interface ExamSummaryProps {
  exam: ExamGenerationResponse;
  filters: ExamGeneratorFilters;
  onRegenerate: () => void;
  onDownload: () => void;
  onView: () => void;
}

export function ExamSummary({ 
  exam, 
  filters, 
  onRegenerate, 
  onDownload, 
  onView 
}: ExamSummaryProps) {
  const getQuestionTypeCount = (type: string) => {
    return exam.questions.filter(q => q.type === type).length;
  };

  const getQuestionTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      multiple_choice: 'Opción Múltiple',
      fill_blank: 'Completar Espacios',
      true_false: 'Verdadero/Falso',
      translate: 'Traducción',
      writing: 'Escritura'
    };
    return typeLabels[type] || type;
  };

  const getLevelLabel = (level: string) => {
    const levelLabels: Record<string, string> = {
      A1: 'A1 - Principiante',
      A2: 'A2 - Elemental',
      B1: 'B1 - Intermedio',
      B2: 'B2 - Intermedio Alto',
      C1: 'C1 - Avanzado',
      C2: 'C2 - Maestría'
    };
    return levelLabels[level] || level;
  };

  const getDifficultyLabel = (difficulty: number) => {
    const difficultyLabels: Record<number, string> = {
      1: 'Muy Fácil',
      2: 'Fácil',
      3: 'Medio',
      4: 'Difícil',
      5: 'Muy Difícil'
    };
    return difficultyLabels[difficulty] || `Nivel ${difficulty}`;
  };

  const totalQuestions = exam.questions.length;
  const questionTypes = Array.from(new Set(exam.questions.map(q => q.type)));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <ExamStats exam={exam} />

      {/* Main Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumen del Examen
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Tema</h4>
              <p className="text-sm text-muted-foreground">{filters.topic}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Nivel</h4>
              <Badge variant="outline">{getLevelLabel(filters.level)}</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Dificultad</h4>
              <Badge variant="outline">{getDifficultyLabel(filters.difficulty)}</Badge>
            </div>
          </div>

          <Separator />

          {/* Estadísticas de preguntas */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Estadísticas de Preguntas</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalQuestions}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
              </div>
              
              {questionTypes.map(type => (
                <div key={type} className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {getQuestionTypeCount(type)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getQuestionTypeLabel(type)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Distribución de tipos de preguntas */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Distribución por Tipo</h4>
            <div className="space-y-2">
              {questionTypes.map(type => {
                const count = getQuestionTypeCount(type);
                const percentage = Math.round((count / totalQuestions) * 100);
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getQuestionTypeLabel(type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{count} preguntas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onView} className="flex-1" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver Preguntas
            </Button>
            
            <Button onClick={onDownload} className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            
            <Button onClick={onRegenerate} className="flex-1" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerar
            </Button>
          </div>

          {/* Información adicional */}
          <div className="p-3 bg-muted/50 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Información del Examen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• Idioma de explicaciones: {filters.userLang === 'es' ? 'Español' : filters.userLang}</div>
              <div>• Generado con IA avanzada</div>
              <div>• Incluye explicaciones detalladas</div>
              <div>• Optimizado para el nivel {filters.level}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 