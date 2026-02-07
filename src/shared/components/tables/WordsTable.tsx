import { IWord } from "@/types/models/Word";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Edit, Trash2, Image as ImageIcon, Volume2, Sparkles, Eye } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getDifficultyVariant } from "@/utils/common";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

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

  const handleCopyImagePrompt = (word: IWord) => {
    const types = word.type && word.type.length > 0 
      ? word.type.join(', ') 
      : 'unknown';
    
    const prompt = `Generate an image related to '${word.word}', whose definition is '${word.spanish?.definition || word.definition}', and whose word type is '${types}'. If the word has homonyms or multiple meanings, include 2-3 distinct visual representations in the same image. Make sure not to include any text in the image.`;
    
    navigator.clipboard.writeText(prompt).then(() => {
      toast.success(`Texto copiado de "${word.word}"`, {
        description: "Prompt copiado al portapapeles",
        duration: 2000,
      });
    }).catch((err) => {
      console.error('Error copying to clipboard:', err);
      toast.error("Error al copiar al portapapeles");
    });
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
    <TooltipProvider>
      <div className="space-y-4 overflow-x-hidden max-w-full lg:max-w-none">
        {words.map((word) => (
        <Card key={word._id} className="hover:shadow-md transition-shadow overflow-hidden max-w-full lg:max-w-none">
          <CardContent className="p-2 sm:p-4 max-w-full lg:max-w-none">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start max-w-full">
              {/* Image */}
              <div className="flex-shrink-0 cursor-pointer w-full sm:w-auto flex justify-center sm:justify-start" onClick={() => onView?.(word)}>
                {word.img ? (
                  <img
                    src={word.img}
                    alt={word.word}
                    className="h-48 w-48 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-[220px] lg:w-[220px] object-contain rounded max-w-full"
                  />
                ) : (
                  <div className="h-48 w-48 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-[220px] lg:w-[220px] bg-muted rounded flex items-center justify-center max-w-full">
                    <ImageIcon className="h-20 w-20 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-muted-foreground" />
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
                        className="font-bold text-2xl sm:text-xl md:text-2xl capitalize cursor-pointer hover:text-primary transition-colors break-words max-w-full overflow-wrap-anywhere"
                        onClick={() => onView?.(word)}
                      >
                        {word.word}
                      </h3>
                      <button
                        onClick={() => speak(word.word, 'en-US', 1)}
                        className="p-1 border rounded hover:bg-muted transition-colors flex-shrink-0"
                        title="Play normal speed"
                      >
                        <Volume2 className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </button>
                      <button
                        onClick={() => speak(word.word, 'en-US', 0.1)}
                        className="p-1 sm:p-1 border rounded hover:bg-muted transition-colors text-xl sm:text-xl leading-none flex-shrink-0"
                        title="Play very slow speed"
                      >
                        🐢
                      </button>
                    </div>
                    {word.IPA && (
                      <p className="text-sm sm:text-xs text-muted-foreground break-words overflow-wrap-anywhere max-w-full">/{word.IPA}/</p>
                    )}
                    {word.spanish?.word && (
                      <p className="text-lg sm:text-lg capitalize text-blue-600 dark:text-blue-400 break-words overflow-wrap-anywhere max-w-full">
                        {word.spanish.word}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
                    <Badge variant={getDifficultyVariant(word.difficulty)} className="text-sm sm:text-xs">
                      {word.difficulty || "N/A"}
                    </Badge>
                    <Badge variant="outline" className="text-sm sm:text-xs">Seen: {word.seen || 0}</Badge>
                  </div>
                </div>

                {/* Definition */}
                <p className="text-sm sm:text-sm mb-2 break-words overflow-wrap-anywhere max-w-full">{word.definition}</p>
                
                {/* Spanish Definition */}
                {word.spanish?.definition && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p 
                        className="text-sm sm:text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 break-words overflow-wrap-anywhere max-w-full cursor-pointer transition-all"
                        onDoubleClick={() => handleCopyImagePrompt(word)}
                      >
                        {word.spanish.definition}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Doble clic para copiar prompt de imagen</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Type tags */}
                {word.type && word.type.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {word.type.map((t, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm sm:text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-row flex-wrap gap-1 sm:gap-2 mt-2">
                  {onView && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onView(word)}
                      className="sm:flex-initial text-sm sm:text-sm"
                    >
                      <Eye className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Ver Detalle</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(word)}
                    className="sm:flex-initial text-sm sm:text-sm z-10"
                  >
                    <Edit className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(word)}
                    className="sm:flex-initial text-sm sm:text-sm"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </TooltipProvider>
  );
}
