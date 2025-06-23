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
import { SPEECH_RATES } from "../../../speechRates";

export default function AnkiGamePage() {
  const {
    words,
    getRecentHardOrMediumWords,
    loading,
    updateWordLevel,
    actionLoading,
  } = useWordStore();

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
        <Shuffle className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={handleReset}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </>
  );

  const currentCard = useMemo(
    () => words[gameStats.currentIndex],
    [words, gameStats.currentIndex]
  );

  if (loading) return <div>Cargando tarjetas...</div>;
  if (!words.length) return <div>No hay tarjetas para practicar.</div>;

  return (
    <PageLayout>
      <PageHeader
        title="Anki Game"
        description="Practica vocabulario con tarjetas interactivas"
        actions={actions}
      />

      {/* Indicador de progreso debajo de los botones de acción */}
      <div className="flex justify-center mt-2 mb-2">
        <span className="text-xs text-muted-foreground bg-background/80 rounded px-3 py-1 shadow">
          ({gameStats.currentIndex + 1}/{words.length})
        </span>
      </div>

      <div className="flex justify-center py-2">
        <div className="relative w-full max-w-lg">
          <div
            className={`flip-card group w-full h-[23rem] cursor-pointer ${
              isFlipped ? "flipped" : ""
            }`}
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
              <Card className="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 p-0">
                {currentCard?.img && (
                  <img
                    src={currentCard.img}
                    alt={currentCard.word}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ objectFit: "cover" }}
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 z-10" />
                {/* Contenido centrado */}
                <div className="relative z-20 flex flex-col justify-center items-center h-full w-full">
                  <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow text-center">
                    {currentCard?.word}
                  </h2>
                  {currentCard?.IPA && (
                    <div className="text-lg text-blue-200 mb-1 font-mono text-center drop-shadow">
                      /{currentCard.IPA}/
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full border border-white transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCard?.word) {
                          const utterance = new window.SpeechSynthesisUtterance(
                            currentCard.word
                          );
                          utterance.lang = "en-US";
                          utterance.rate = SPEECH_RATES.NORMAL;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      title="Escuchar pronunciación normal"
                      type="button"
                    >
                      🔊
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full border border-white transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCard?.word) {
                          const utterance = new window.SpeechSynthesisUtterance(
                            currentCard.word
                          );
                          utterance.lang = "en-US";
                          utterance.rate = SPEECH_RATES.SUPERSLOW;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      title="Escuchar pronunciación lenta"
                      type="button"
                    >
                      🐢
                    </button>
                  </div>
                </div>
                <div className="relative z-20 flex items-center text-xs text-muted-foreground mt-2 opacity-70 justify-center">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Haz clic para voltear
                </div>
              </Card>
              {/* Reverso */}
              <Card
                className="flip-card-back absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary/10 to-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-center p-0"
                style={{ transform: "rotateY(180deg)" }}
              >
                {/* Cabecera fija */}
                <div className="w-full flex justify-between items-center px-3 pt-2 pb-1 bg-transparent z-10">
                  <span className="font-bold text-base capitalize text-white">
                    {currentCard?.spanish?.word}
                  </span>
                  <Badge
                    variant="outline"
                    className={`uppercase tracking-wider font-semibold px-3 py-1
                      ${
                        currentCard?.level === "easy" &&
                        "border-green-500 text-green-500"
                      }
                      ${
                        currentCard?.level === "medium" &&
                        "border-blue-500 text-blue-500"
                      }
                      ${
                        currentCard?.level === "hard" &&
                        "border-red-600 text-red-600"
                      }`}
                  >
                    {currentCard?.level}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-zinc-200">
                    <span role="img" aria-label="visto">
                      👁️
                    </span>{" "}
                    {currentCard?.seen ?? 0}
                  </span>
                </div>
                <div className="flex-1 w-full h-full overflow-y-auto p-3 bg-zinc-900/60 rounded-xl shadow-inner border border-primary/30 custom-scroll">
                  {/* Definición ES */}
                  {currentCard?.spanish?.definition && (
                    <div className="mb-3">
                      <div className="font-semibold text-blue-300 flex items-center gap-2 mb-1">
                        <span>🇪🇸</span> Definición (ES)
                      </div>
                      <div className="italic text-zinc-100 capitalize">
                        {currentCard.spanish.definition}
                      </div>
                    </div>
                  )}
                  {/* Ejemplos */}
                  {currentCard?.examples && (
                    <div className="mb-3">
                      <div className="font-semibold text-green-300 flex items-center gap-2 mb-1">
                        <span>💬</span> Ejemplos
                      </div>
                      <ul className="list-disc ml-5 text-left text-xs text-zinc-200 space-y-1">
                        {currentCard.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Code-Switching */}
                  {currentCard?.codeSwitching &&
                    currentCard.codeSwitching.length > 0 && (
                      <div className="mb-3">
                        <div className="font-semibold text-purple-300 flex items-center gap-2 mb-1">
                          <span>🔀</span> Code-Switching
                        </div>
                        <ul className="list-disc ml-5 text-left text-xs text-zinc-200 space-y-1">
                          {currentCard.codeSwitching.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {/* Sinónimos */}
                  {currentCard?.sinonyms && currentCard.sinonyms.length > 0 && (
                    <div className="mb-3">
                      <div className="font-semibold text-yellow-300 flex items-center gap-2 mb-1">
                        <span>🔗</span> Sinónimos
                      </div>
                      <div className="text-xs text-zinc-200">
                        {currentCard.sinonyms.join(", ")}
                      </div>
                    </div>
                  )}
                  {/* Tipo */}
                  {currentCard?.type && currentCard.type.length > 0 && (
                    <div className="mb-3">
                      <div className="font-semibold text-pink-300 flex items-center gap-2 mb-1">
                        <span>🏷️</span> Tipo
                      </div>
                      <div className="text-xs text-zinc-200">
                        {currentCard.type.join(", ")}
                      </div>
                    </div>
                  )}
                  {/* Definición EN */}
                  {currentCard?.definition && (
                    <div className="mt-4">
                      <div className="font-semibold text-blue-200 flex items-center gap-2 mb-1">
                        <span>🇬🇧</span> Definición (EN)
                      </div>
                      <div className="italic text-zinc-100 capitalize">
                        {currentCard.definition}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2 opacity-70 pb-1">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Haz clic para voltear
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-2">
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
