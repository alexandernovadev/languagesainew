import React from 'react';
import { Exam } from '@/services/examService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TruncatedText, TruncatedBadge } from '@/components/common';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Play, 
  BookOpen,
  Calendar,
  User,
  Brain,
  Settings,
  Hash,
  FileText,
  Clock,
  Target
} from 'lucide-react';
import { 
  getLevelColor, 
  getSourceVariant, 
  formatDateShort, 
  truncateText 
} from './helpers/examUtils';
import { getLanguageInfo } from "@/utils/common/language";

interface ExamTableProps {
  exams: Exam[];
  onView: (exam: Exam) => void;
  onEdit: (exam: Exam) => void;
  onRemove: (exam: Exam) => void;
  onTake: (exam: Exam) => void;
  loading?: boolean;
  searchQuery?: string;
}

export function ExamTable({ 
  exams, 
  onView, 
  onEdit, 
  onRemove, 
  onTake,
  loading = false,
  searchQuery = ""
}: ExamTableProps) {
  const getSourceIcon = (source: string | undefined) => {
    return source === 'ai' ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  if (loading && exams.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-64">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-12 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50" />
          <div>
            <p className="text-lg font-medium">No se encontraron exámenes</p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-1">
                No hay exámenes que coincidan con "{searchQuery}"
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Intenta ajustar los filtros o crear un nuevo examen
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {exams.map((exam) => (
          <Card key={exam._id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
            <CardHeader className="pb-3">
              {/* Header con título */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <TruncatedText
                    text={exam.title}
                    maxLength={60}
                    className="font-semibold text-sm text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Tema */}
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                {exam.topic ? (
                  <div className="flex-1 min-w-0 max-w-full">
                    <TruncatedBadge
                      text={exam.topic}
                      maxLength={25}
                      variant="secondary"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Sin tema
                  </span>
                )}
              </div>

              {/* Información principal */}
              <div className="space-y-2">
                {/* Idioma y Nivel */}
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <Badge variant="outline" className="text-xs">
                    {getLanguageInfo(exam.language).flag} {getLanguageInfo(exam.language).name}
                  </Badge>
                  <Badge variant={getLevelColor(exam.level)} className="text-xs">
                    {exam.level}
                  </Badge>
                </div>

                {/* Origen y Preguntas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSourceVariant(exam.source)} className="text-xs">
                      <div className="flex items-center gap-1">
                        {getSourceIcon(exam.source)}
                        {exam.source === 'ai' ? 'IA' : 'Manual'}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-bold">
                      {exam.questions?.length || 0} preguntas
                    </span>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                {/* Fecha y Duración en la misma línea */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {formatDateShort(exam.createdAt)}
                    </span>
                  </div>
                  
                  {exam.timeLimit && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {exam.timeLimit} min
                      </span>
                    </div>
                  )}
                </div>

                {/* Características especiales */}
                <div className="flex items-center gap-2">
                  {exam.adaptive && (
                    <Badge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Adaptativo
                    </Badge>
                  )}
                </div>
              </div>

              {/* Acciones siempre visibles */}
              <div className="flex items-center gap-1 pt-2 border-t border-border/50">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onTake(exam)}
                        className="h-8 w-8 rounded-md text-green-400 hover:text-green-300 hover:bg-green-900/20 border border-transparent hover:border-green-700/30 transition-all duration-200"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Contestar examen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(exam)}
                        className="h-8 w-8 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-transparent hover:border-blue-700/30 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver examen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(exam)}
                        className="h-8 w-8 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-transparent hover:border-blue-700/30 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar examen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(exam)}
                        className="h-8 w-8 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-700/30 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eliminar examen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
} 