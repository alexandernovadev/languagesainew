import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useGameStats } from "@/hooks/use-game-stats";
import { useWordStore } from "@/lib/store/useWordStore";

export default function AnkiGame() {
  const { words, getRecentHardOrMediumWords, loading, updateWordLevel, actionLoading } = useWordStore();

  useEffect(() => {
    getRecentHardOrMediumWords();
  }, [getRecentHardOrMediumWords]);

  const [isFlipped, setIsFlipped] = useState(false);
  const gameStats = useGameStats(words.length);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    gameStats.next();
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    gameStats.previous();
    setIsFlipped(false);
  };

  const handleKnow = useCallback(() => {
    if (words[gameStats.currentIndex]) {
      gameStats.markAsCompleted(gameStats.currentIndex);
      gameStats.next();
    }
  }, [words, gameStats]);

  const handleDontKnow = useCallback(() => {
    gameStats.next();
  }, [gameStats]);

  const handleShuffle = () => {
    gameStats.reset();
    setIsFlipped(false);
  };

  const handleReset = () => {
    gameStats.reset();
    setIsFlipped(false);
  };

  const handleSetLevel = async (level: "easy" | "medium" | "hard") => {
    if (words[gameStats.currentIndex]?._id) {
      await updateWordLevel(words[gameStats.currentIndex]._id, level);
      gameStats.next();
      setIsFlipped(false);
    }
  };

  const actions = (
    <>
      <Button variant="outline" onClick={handleShuffle}>
        <Shuffle className="h-4 w-4 mr-2" />
        Barajar
      </Button>
      <Button variant="outline" onClick={handleReset}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Reiniciar
      </Button>
    </>
  );

  const currentCard = useMemo(() => words[gameStats.currentIndex], [words, gameStats.currentIndex]);

  if (loading) return <div>Cargando tarjetas...</div>;
  if (!words.length) return <div>No hay tarjetas para practicar.</div>;

  return (
    <PageLayout>
      <PageHeader
        title="Anki Game"
        description="Practica vocabulario con tarjetas interactivas"
        actions={actions}
      />

      <div className="flex justify-center py-8">
        <div className="relative w-full max-w-lg">
          <div
            className={`flip-card group w-full h-[28rem] cursor-pointer ${isFlipped ? "flipped" : ""}`}
            onClick={handleFlip}
            style={{ perspective: 1200 }}
          >
            <div
              className="flip-card-inner relative w-full h-full transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "none",
              }}
            >
              {/* Frente */}
              <Card className="flip-card-front absolute w-full h-full backface-hidden rounded-2xl shadow-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-center p-8 transition-all duration-300">
                <div className="w-full flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="uppercase tracking-wider">{currentCard?.level}</Badge>
                  {currentCard?.seen !== undefined && currentCard.seen < 3 && (
                    <Badge variant="destructive" className="animate-pulse">Nuevo</Badge>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <h2 className="text-5xl font-extrabold text-primary mb-2 drop-shadow">{currentCard?.word}</h2>
                  {currentCard?.IPA && (
                    <div className="text-lg text-blue-500 mb-2 font-mono">/{currentCard.IPA}/</div>
                  )}
                  <div className="flex items-center gap-2 text-base text-center mb-4">
                    <span className="text-zinc-600 dark:text-zinc-300"><b>Definición:</b></span>
                    <span className="italic">{currentCard?.definition}</span>
                  </div>
                  {currentCard?.img && (
                    <img
                      src={currentCard.img}
                      alt={currentCard.word}
                      className="max-h-32 mb-2 rounded-lg shadow-lg border-2 border-zinc-300 dark:border-zinc-700"
                    />
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-4 opacity-70">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Haz clic para voltear
                </div>
              </Card>
              {/* Reverso */}
              <Card className="flip-card-back absolute w-full h-full backface-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary/10 to-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-center p-8" style={{ transform: "rotateY(180deg)" }}>
                <div className="w-full flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="uppercase tracking-wider">{currentCard?.level}</Badge>
                  <span className="text-green-400 font-bold text-lg">{currentCard?.spanish?.word}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center w-full">
                  <div className="text-base text-center mb-4">
                    <span className="text-zinc-600 dark:text-zinc-300"><b>Definición:</b></span>
                    <span className="italic">{currentCard?.spanish?.definition}</span>
                  </div>
                  {currentCard?.examples && (
                    <div className="mb-2 w-full max-h-28 overflow-y-auto bg-zinc-800/30 rounded p-2 shadow-inner">
                      <b>Ejemplos:</b>
                      <ul className="list-disc ml-5 text-left text-sm">
                        {currentCard.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {currentCard?.sinonyms && currentCard.sinonyms.length > 0 && (
                    <div className="mb-2 w-full text-left text-sm">
                      <b>Sinónimos:</b> {currentCard.sinonyms.join(", ")}
                    </div>
                  )}
                  {currentCard?.type && currentCard.type.length > 0 && (
                    <div className="mb-2 w-full text-left text-sm">
                      <b>Tipo:</b> {currentCard.type.join(", ")}
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-4 opacity-70">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Haz clic para voltear
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={gameStats.currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {isFlipped && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSetLevel("easy")}
              disabled={actionLoading.updateLevel}
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              title="Marcar como fácil"
            >
              Easy
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSetLevel("medium")}
              disabled={actionLoading.updateLevel}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              title="Marcar como medio"
            >
              Medium
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSetLevel("hard")}
              disabled={actionLoading.updateLevel}
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              title="Marcar como difícil"
            >
              Hard
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={gameStats.currentIndex === words.length - 1}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </PageLayout>
  );
}

/*
Agrega este CSS a tu global.css o módulo para el efecto flip y glassmorphism:

.flip-card {
  perspective: 1200px;
}
.flip-card-inner {
  transition: transform 0.7s cubic-bezier(.4,2,.6,1);
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}
.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  will-change: transform;
}
.flip-card-back {
  transform: rotateY(180deg);
}

/* Glassmorphism extra (opcional):
.bg-glass {
  background: rgba(255,255,255,0.15);
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.18);
}
*/
