import React from 'react';
import { Exam } from '@/services/examService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
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
  FileText
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Detalle</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Preguntas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-24 w-full rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Detalle</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Preguntas</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <TableRow key={exam._id} className="hover:bg-muted/50">
              {/* Detalle Card */}
              <TableCell className="">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="space-y-3">
                      {/* Título */}
                      <div>
                        <h3 className="font-semibold text-sm text-foreground leading-tight">
                          {exam.title}
                        </h3>
                        {exam.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {truncateText(exam.description, 80)}
                          </p>
                        )}
                      </div>

                      {/* Tema */}
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        {exam.topic ? (
                          <Badge variant="secondary" className="text-xs">
                            {exam.topic}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Sin tema
                          </span>
                        )}
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDateShort(exam.createdAt)}
                        </span>
                      </div>

                      {/* Idioma & Nivel */}
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {getLanguageInfo(exam.language).flag} {getLanguageInfo(exam.language).name}
                        </Badge>
                        <Badge variant={getLevelColor(exam.level)} className="text-xs">
                          {exam.level}
                        </Badge>
                        {exam.adaptive && (
                          <Badge variant="outline" className="text-xs">
                            <Settings className="w-3 h-3 mr-1" />
                            Adaptativo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TableCell>

              {/* Origen */}
              <TableCell>
                <Badge variant={getSourceVariant(exam.source)} className="text-xs">
                  <div className="flex items-center gap-1">
                    {getSourceIcon(exam.source)}
                    {exam.source === 'ai' ? 'IA' : 'Manual'}
                  </div>
                </Badge>
              </TableCell>

              {/* Preguntas */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold">
                    {exam.questions?.length || 0}
                  </span>
                </div>
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(exam)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
                    title="Ver examen"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(exam)}
                    className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                    title="Editar examen"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(exam)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                    title="Eliminar examen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTake(exam)}
                    className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/20"
                    title="Contestar examen"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent cursor-default">
            <TableCell
              colSpan={4}
              className="text-center h-32 text-muted-foreground"
            >
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
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
} 