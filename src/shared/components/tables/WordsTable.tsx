import { IWord } from "@/types/models/Word";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface WordsTableProps {
  words: IWord[];
  loading: boolean;
  onEdit: (word: IWord) => void;
  onDelete: (word: IWord) => void;
}

export function WordsTable({ words, loading, onEdit, onDelete }: WordsTableProps) {
  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (words.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No words found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyVariant = (difficulty?: string): "default" | "yellow" | "destructive" | "outline" => {
    switch (difficulty) {
      case "easy":
        return "default";
      case "medium":
        return "yellow";
      case "hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Definition</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-center">Seen</TableHead>
              <TableHead className="text-center">Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((word) => (
              <TableRow key={word._id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{word.word}</div>
                    {word.IPA && (
                      <div className="text-xs text-muted-foreground">
                        /{word.IPA}/
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={word.definition}>
                    {word.definition}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{word.language.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  {word.type && word.type.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {word.type.slice(0, 2).map((t, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                      {word.type.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{word.type.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyVariant(word.difficulty)}>
                    {word.difficulty || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{word.seen || 0}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {word.img ? (
                    <ImageIcon className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(word)}
                      title="Edit word"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(word)}
                      title="Delete word"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
