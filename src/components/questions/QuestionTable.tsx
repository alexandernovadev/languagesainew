import { Question } from "@/models/Question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Eye, RotateCcw } from "lucide-react";
import { questionTypes, questionLevels, questionDifficulties } from "@/data/questionTypes";

interface QuestionTableProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
  onView: (question: Question) => void;
  onRetry: () => void;
  loading?: boolean;
  searchQuery?: string;
}

export function QuestionTable({ 
  questions, 
  onEdit, 
  onDelete, 
  onView, 
  onRetry,
  loading = false,
  searchQuery = ""
}: QuestionTableProps) {
  const getTypeLabel = (type: string) => {
    const typeData = questionTypes.find(t => t.value === type);
    return typeData?.label || type;
  };

  const getLevelLabel = (level: string) => {
    const levelData = questionLevels.find(l => l.value === level);
    return levelData?.label || level;
  };

  const getDifficultyLabel = (difficulty: number) => {
    const difficultyData = questionDifficulties.find(d => d.value === difficulty);
    return difficultyData?.label || difficulty.toString();
  };

  const getDifficultyVariant = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "blue";
      case 2: return "secondary";
      case 3: return "yellow";
      case 4: return "magenta";
      case 5: return "destructive";
      default: return "outline";
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading && questions.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pregunta</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Dificultad</TableHead>
            <TableHead>Tema</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="max-w-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-12 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-10 rounded" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
          <TableHead>Pregunta</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead>Dificultad</TableHead>
          <TableHead>Tema</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.length > 0 ? (
          questions.map((question) => (
            <TableRow key={question._id}>
              <TableCell className="max-w-md">
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {truncateText(question.text, 80)}
                  </p>
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {question.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {question.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{question.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="yellow" className="text-xs border-none bg-transparent">
                  {getTypeLabel(question.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs rounded-sm border-2">
                  {getLevelLabel(question.level)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getDifficultyVariant(question.difficulty)} className="text-xs">
                  {getDifficultyLabel(question.difficulty)}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {question.topic || "Sin tema"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(question)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(question)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(question)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent cursor-default">
            <TableCell
              colSpan={6}
              className="text-center h-24 text-muted-foreground"
            >
              <div className="space-y-4">
                <div>No se encontraron preguntas.</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="rounded-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Recargar
                </Button>
                {searchQuery && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p className="text-sm text-muted-foreground">
                      No hay preguntas que coincidan con "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
} 