import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, Eye, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { ExamGenerationResponse } from '@/services/examService';
import { ExamGeneratorFilters } from '@/hooks/useExamGenerator';
import { ExamStats } from './ExamStats';
import { QuestionTypeStats } from './components/QuestionTypeStats';
import { 
  getLevelLabel, 
  getDifficultyLabel, 
  getLanguageLabel 
} from './helpers/examUtils';

interface ExamSummaryProps {
  exam: ExamGenerationResponse;
  filters: ExamGeneratorFilters;
  onRegenerate: () => void;
  onDownload: () => void;
  onView: () => void;
  isSaving?: boolean;
}

export function ExamSummary({ 
  exam, 
  filters, 
  onRegenerate, 
  onDownload, 
  onView,
  isSaving = false
}: ExamSummaryProps) {
  const totalQuestions = exam.questions.length;

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

          {/* Estadísticas de preguntas usando el nuevo componente */}
          <QuestionTypeStats questions={exam.questions} />

          <Separator />

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onView} className="flex-1" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver Preguntas
            </Button>
            
            <Button 
              onClick={onDownload} 
              className="flex-1" 
              variant="outline"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Examen
                </>
              )}
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
              <div>• Idioma de explicaciones: {getLanguageLabel(filters.userLang)}</div>
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