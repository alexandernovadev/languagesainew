import { IWord } from "@/types/models/Word";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Edit, Trash2, Image as ImageIcon, Volume2 } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface WordsTableProps {
  words: IWord[];
  loading: boolean;
  onEdit: (word: IWord) => void;
  onDelete: (word: IWord) => void;
}

export function WordsTable({ words, loading, onEdit, onDelete }: WordsTableProps) {
  const speak = (text: string, lang: string = 'en-US', rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

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
    <div className="space-y-4">
      {words.map((word) => (
        <Card key={word._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4 items-start">
              {/* Image */}
              <div className="flex-shrink-0">
                {word.img ? (
                  <img
                    src={word.img}
                    alt={word.word}
                    className="h-28 w-28 object-cover rounded"
                  />
                ) : (
                  <div className="h-28 w-28 bg-muted rounded flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  {/* Word Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-2xl capitalize">{word.word}</h3>
                      <button
                        onClick={() => speak(word.word, 'en-US', 1)}
                        className="p-1 border rounded hover:bg-muted transition-colors"
                        title="Play normal speed"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => speak(word.word, 'en-US', 0.1)}
                        className="p-1 border rounded hover:bg-muted transition-colors text-xl leading-none"
                        title="Play very slow speed"
                      >
                        🐢
                      </button>
                    </div>
                    {word.IPA && (
                      <p className="text-xs text-muted-foreground">/{word.IPA}/</p>
                    )}
                    {word.spanish?.word && (
                      <p className="text-lg capitalize text-blue-600 dark:text-blue-400">
                        {word.spanish.word}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={getDifficultyVariant(word.difficulty)}>
                      {word.difficulty || "N/A"}
                    </Badge>
                    <Badge variant="outline">Seen: {word.seen || 0}</Badge>
                  </div>
                </div>

                {/* Definition */}
                <p className="text-sm mb-2">{word.definition}</p>
                
                {/* Spanish Definition */}
                {word.spanish?.definition && (
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">
                    {word.spanish.definition}
                  </p>
                )}

                {/* Type tags */}
                {word.type && word.type.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {word.type.map((t, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(word)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(word)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
