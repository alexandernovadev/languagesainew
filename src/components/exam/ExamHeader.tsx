import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clock, Users, FileText, Edit } from 'lucide-react';
import { Exam } from '@/services/examService';
import { getLevelLabel } from './helpers/examUtils';

interface ExamHeaderProps {
  exam: Exam;
  showStats?: boolean;
  showEditButton?: boolean;
  onEditTitle?: () => void;
}

export function ExamHeader({ exam, showStats = true, showEditButton = false, onEditTitle }: ExamHeaderProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      A1: 'bg-green-100 text-green-800',
      A2: 'bg-blue-100 text-blue-800',
      B1: 'bg-yellow-100 text-yellow-800',
      B2: 'bg-orange-100 text-orange-800',
      C1: 'bg-red-100 text-red-800',
      C2: 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            <p className="text-muted-foreground">
              {exam.description}
            </p>
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
            <Badge className={getLevelColor(exam.level)}>
              {getLevelLabel(exam.level)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Idioma</h4>
            <Badge variant="outline">{exam.language.toUpperCase()}</Badge>
          </div>
        </div>

        {showStats && (
          <>
            <Separator />

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{exam.questions.length}</p>
                  <p className="text-xs text-muted-foreground">Preguntas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{exam.timeLimit}</p>
                  <p className="text-xs text-muted-foreground">Minutos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{exam.attemptsAllowed}</p>
                  <p className="text-xs text-muted-foreground">Intentos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{exam.version}</p>
                  <p className="text-xs text-muted-foreground">Versión</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Información adicional */}
        <div className="flex gap-2 items-center">
          <Badge variant={exam.source === 'ai' ? 'default' : 'secondary'}>
            {exam.source === 'ai' ? 'IA' : 'Manual'}
          </Badge>
          {exam.adaptive && (
            <Badge variant="outline">
              Adaptativo
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            Creado: {formatDate(exam.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 