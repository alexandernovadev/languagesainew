import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { BookOpen, Volume2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { IWord } from "@/types/models/Word";

type WordLookup = { exists: true; word: IWord } | { exists: false } | null;

interface WordLookupPanelProps {
  selectedWord: string | null;
  wordLookup: WordLookup;
  wordLookupLoading: boolean;
  addingWord: boolean;
  isMobile: boolean;
  sidebarState: string;
  onSpeak: (word: string, rate: number) => void;
  onOpenDetail: () => void;
  onAddWord: () => void;
}

export function WordLookupPanel({
  selectedWord,
  wordLookup,
  wordLookupLoading,
  addingWord,
  isMobile,
  sidebarState,
  onSpeak,
  onOpenDetail,
  onAddWord,
}: WordLookupPanelProps) {
  const displayWord =
    selectedWord || (wordLookup?.exists ? wordLookup.word.word : null) || "—";

  return (
    <Card
      className={cn(
        "fixed z-30 border shadow-lg bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/90",
        isMobile
          ? "inset-x-0 bottom-0 rounded-t-xl border-x-0 border-b-0"
          : sidebarState === "collapsed"
          ? "left-[calc(var(--sidebar-width-icon)+theme(spacing.4)+theme(spacing.2))] right-2 bottom-2 rounded-xl"
          : "left-[calc(var(--sidebar-width)+theme(spacing.2))] right-2 bottom-2 rounded-xl"
      )}
    >
      <CardContent className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Palabra seleccionada</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg capitalize">{displayWord}</p>
              {displayWord !== "—" && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSpeak(displayWord, 1); }}
                    className="p-2 border rounded-lg hover:bg-muted transition-colors hover:scale-110"
                    title="Velocidad normal"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSpeak(displayWord, 0.01); }}
                    className="p-2 border rounded-lg hover:bg-muted transition-colors hover:scale-110 text-base leading-none"
                    title="Velocidad lenta"
                  >
                    🐢
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wordLookupLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : wordLookup?.exists ? (
              <Button onClick={onOpenDetail}>
                <BookOpen className="h-4 w-4 mr-2" />
                Ver detalle
              </Button>
            ) : wordLookup && !wordLookup.exists ? (
              <>
                <p className="text-sm text-muted-foreground mr-2">No tienes en tu diccionario</p>
                <Button onClick={onAddWord} disabled={addingWord}>
                  {addingWord ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Añadir
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
