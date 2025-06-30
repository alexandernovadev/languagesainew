import React from 'react';
import { Exam } from '@/services/examService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Settings
} from 'lucide-react';
import { 
  getLevelColor, 
  getSourceVariant, 
  formatDateShort, 
  truncateText 
} from './helpers/examUtils';

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
            <TableHead>Título</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Idioma</TableHead>
            <TableHead>Tema</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Preguntas</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-12 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
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
          <TableHead>Título</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead>Idioma</TableHead>
          <TableHead>Tema</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Preguntas</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <TableRow key={exam._id} className="hover:bg-muted/50">
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {exam.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {truncateText(exam.description || 'Sin descripción')}
                  </p>
                  {exam.adaptive && (
                    <Badge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Adaptativo
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getLevelColor(exam.level)} className="text-xs">
                  {exam.level}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {exam.language}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {exam.topic || "Sin tema"}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getSourceVariant(exam.source)} className="text-xs">
                  <div className="flex items-center gap-1">
                    {getSourceIcon(exam.source)}
                    {exam.source === 'ai' ? 'IA' : 'Manual'}
                  </div>
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {exam.questions?.length || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDateShort(exam.createdAt)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(exam)}
                    className="h-8 w-8 p-0"
                    title="Ver examen"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(exam)}
                    className="h-8 w-8 p-0"
                    title="Editar examen"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(exam)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    title="Eliminar examen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTake(exam)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
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
              colSpan={8}
              className="text-center h-24 text-muted-foreground"
            >
              <div className="space-y-4">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">No se encontraron exámenes</p>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No hay exámenes que coincidan con "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
} 