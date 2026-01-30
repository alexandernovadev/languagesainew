import { IWord } from "@/types/models/Word";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Edit, Trash2, Image as ImageIcon, Volume2, Sparkles } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getDifficultyVariant } from "@/utils/common";

interface WordsTableProps {
  words: IWord[];
  loading: boolean;
  onEdit: (word: IWord) => void;
  onDelete: (word: IWord) => void;
  onView?: (word: IWord) => void;
  searchTerm?: string;
  onGenerateWithAI?: (word: string) => void;
  isGenerating?: boolean;
}

export function WordsTable({ 
  words, 
  loading, 
  onEdit, 
  onDelete,
  onView,
  searchTerm,
  onGenerateWithAI,
  isGenerating = false
}: WordsTableProps) {
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
            <p className="text-muted-foreground">
              {searchTerm ? `No se encontró la palabra "${searchTerm}"` : "No words found"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm 
                ? "¿Quieres generar esta palabra con IA?" 
                : "Try adjusting your search or filters"}
            </p>
            {searchTerm && onGenerateWithAI && (
              <Button
                onClick={() => onGenerateWithAI(searchTerm)}
                disabled={isGenerating}
                className={`mt-4 ${isGenerating ? 'animate-pulse' : ''}`}
                variant="default"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? "Generando..." : "Generar con AI"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 overflow-x-hidden max-w-full">
      {words.map((word) => (
        <Card key={word._id} className="hover:shadow-md transition-shadow overflow-hidden max-w-full">
          <CardContent className="p-2 sm:p-4 max-w-full">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start max-w-full">
              {/* Image */}
              <div className="flex-shrink-0 cursor-pointer w-full sm:w-auto flex justify-center sm:justify-start" onClick={() => onView?.(word)}>
                {word.img ? (
                  <img
                    src={word.img}
                    alt={word.word}
                    className="h-32 w-32 sm:h-20 sm:w-20 md:h-28 md:w-28 object-contain rounded max-w-full"
                  />
                ) : (
                  <div className="h-32 w-32 sm:h-20 sm:w-20 md:h-28 md:w-28 bg-muted rounded flex items-center justify-center max-w-full">
                    <ImageIcon className="h-12 w-12 sm:h-8 sm:w-8 md:h-12 md:w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 w-full sm:w-auto max-w-full overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2 max-w-full">
                  {/* Word Info */}
                  <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <h3 
                        className="font-bold text-lg sm:text-xl md:text-2xl capitalize cursor-pointer hover:text-primary transition-colors break-words max-w-full overflow-wrap-anywhere"
                        onClick={() => onView?.(word)}
                      >
                        {word.word}
                      </h3>
                      <button
                        onClick={() => speak(word.word, 'en-US', 1)}
                        className="p-1 border rounded hover:bg-muted transition-colors flex-shrink-0"
                        title="Play normal speed"
                      >
                        <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </button>
                      <button
                        onClick={() => speak(word.word, 'en-US', 0.1)}
                        className="p-0.5 sm:p-1 border rounded hover:bg-muted transition-colors text-base sm:text-xl leading-none flex-shrink-0"
                        title="Play very slow speed"
                      >
                        🐢
                      </button>
                    </div>
                    {word.IPA && (
                      <p className="text-xs text-muted-foreground break-words overflow-wrap-anywhere max-w-full">/{word.IPA}/</p>
                    )}
                    {word.spanish?.word && (
                      <p className="text-base sm:text-lg capitalize text-blue-600 dark:text-blue-400 break-words overflow-wrap-anywhere max-w-full">
                        {word.spanish.word}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
                    <Badge variant={getDifficultyVariant(word.difficulty)} className="text-xs">
                      {word.difficulty || "N/A"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">Seen: {word.seen || 0}</Badge>
                  </div>
                </div>

                {/* Definition */}
                <p className="text-xs sm:text-sm mb-2 break-words overflow-wrap-anywhere max-w-full">{word.definition}</p>
                
                {/* Spanish Definition */}
                {word.spanish?.definition && (
                  <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 break-words overflow-wrap-anywhere max-w-full">
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
                <div className="flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-2 mt-2">
                  {onView && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onView(word)}
                      className="w-full sm:w-auto sm:flex-initial text-xs sm:text-sm"
                    >
                      Ver Detalle
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(word)}
                    className="w-full sm:w-auto sm:flex-initial text-xs sm:text-sm z-10"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(word)}
                    className="w-full sm:w-auto sm:flex-initial text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
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
