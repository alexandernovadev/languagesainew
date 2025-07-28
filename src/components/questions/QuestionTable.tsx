import React from "react";
import { Question } from "@/models/Question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TruncatedText } from "@/components/common/TruncatedText";
import { Eye, Edit, Trash2, RefreshCw, BookOpen } from "lucide-react";
import {
  questionTypes,
  questionLevels,
  questionDifficulties,
} from "@/data/questionTypes";

interface QuestionTableProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
  onView: (question: Question) => void;
  onRetry?: (question: Question) => void;
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
  searchQuery = "",
}: QuestionTableProps) {
  const getTypeLabel = (type: string) => {
    const typeData = questionTypes.find((t) => t.value === type);
    return typeData?.label || type;
  };

  const getLevelLabel = (level: string) => {
    const levelData = questionLevels.find((l) => l.value === level);
    return levelData?.label || level;
  };

  const getDifficultyLabel = (difficulty: number) => {
    const difficultyData = questionDifficulties.find(
      (d) => d.value === difficulty
    );
    return difficultyData?.label || difficulty.toString();
  };

  const getDifficultyVariant = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "blue";
      case 2:
        return "secondary";
      case 3:
        return "yellow";
      case 4:
        return "magenta";
      case 5:
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
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

  return (
    <TooltipProvider>
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
                    <TruncatedText
                      text={question.text}
                      maxLength={80}
                      className="font-medium text-sm cursor-default"
                    />
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {question.tags
                          .slice(0, 3)
                          .map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        {question.tags.length > 3 && (
                          <Badge variant="outline">
                            +{question.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="yellow"
                    className="text-xs border-none bg-transparent"
                  >
                    {getTypeLabel(question.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs rounded-sm border-2"
                  >
                    {getLevelLabel(question.level)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyVariant(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TruncatedText
                    text={question.topic || "Sin tema"}
                    maxLength={30}
                    className="text-xs text-muted-foreground cursor-default"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(question)}
                      className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
                      title="Ver pregunta"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(question)}
                      className="h-7 w-7 p-0 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                      title="Editar pregunta"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(question)}
                      className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    {onRetry && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetry(question)}
                        className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/20"
                        title="Regenerar pregunta"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/50" />
                  <p className="text-sm font-medium">
                    No se encontraron preguntas
                  </p>
                  {searchQuery && (
                    <p className="text-xs text-muted-foreground">
                      No hay preguntas que coincidan con "{searchQuery}"
                    </p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
