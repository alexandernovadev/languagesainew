import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RefreshCw,
  BarChart3,
  Eye,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useGameStats } from "@/hooks/use-game-stats";
import { useWordStore } from "@/lib/store/useWordStore";
import { wordService } from "@/services/wordService";

import { toast } from "sonner";
import { shuffleArray } from "@/utils/common";
import { useResultHandler } from "@/hooks/useResultHandler";
import { Skeleton } from "@/components/ui/skeleton";
import { AnkiStatsModal } from "@/components/games/anki/AnkiStatsModal";
import { WordDetailsCard } from "@/components/word-details";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/common/classnames";

// Declaraciones de tipos para Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Componente reutilizable para botones de audio
interface AudioButtonsProps {
  word: string;
  size?: "sm" | "md";
  className?: string;
}

const AudioButtons = ({
  word,
  size = "md",
  className = "",
}: AudioButtonsProps) => {
  const buttonSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  const speakWord = (rate: number) => {
    if (word) {
      const utterance = new window.SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        className={`${buttonSize} flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full border border-white transition`}
        onClick={(e) => {
          e.stopPropagation();
          speakWord(1); // Velocidad normal
        }}
        title="Escuchar pronunciación normal"
        type="button"
      >
        🔊
      </button>
      <button
        className={`${buttonSize} flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full border border-white transition`}
        onClick={(e) => {
          e.stopPropagation();
          speakWord(0.5); // Velocidad lenta
        }}
        title="Escuchar pronunciación lenta"
        type="button"
      >
        🐢
      </button>
    </div>
  );
};

export default function AnkiGamePage() {
  const {
    words,
    getWordsForReview,
    getRecentHardOrMediumWords,
    loading,
    updateWordLevel,
    updateWordReview,
    actionLoading,
  } = useWordStore();

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Estado local para palabras mezcladas
  const [shuffledWords, setShuffledWords] = useState(words);

  // Estado para el modal de estadísticas
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Estado para full screen
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        await getRecentHardOrMediumWords(); // Usar el método con aleatorización completa
        toast.success("Tarjetas de Anki cargadas exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () =>
              handleApiResult(
                {
                  success: true,
                  data: words,
                  message: "Tarjetas de Anki cargadas exitosamente",
                },
                "Cargar Tarjetas Anki"
              ),
          },
          cancel: {
            label: <X className="h-4 w-4" />,
            onClick: () => toast.dismiss(),
          },
        });
      } catch (error: any) {
        handleApiResult(error, "Cargar Tarjetas Anki");
      }
    };
    fetchWords();
  }, [getRecentHardOrMediumWords]);

  // Sincroniza shuffledWords cuando words cambia
  useEffect(() => {
    setShuffledWords(words);
    // Limpiar palabras vistas cuando se cargan nuevas palabras
    viewedWordsRef.current.clear();
  }, [words]);

  const [isFlipped, setIsFlipped] = useState(false);
  const gameStats = useGameStats(shuffledWords.length);

  // Trackear palabras ya vistas para evitar bucles
  const viewedWordsRef = useRef<Set<string>>(new Set());
  const seenUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backScrollRef = useRef<HTMLDivElement | null>(null);

  // Función optimizada para actualizar "seen" con debounce
  const updateSeenWithDebounce = useCallback((wordId: string) => {
    if (!wordId || viewedWordsRef.current.has(wordId)) return;

    // Marcar como vista inmediatamente para evitar bucles
    viewedWordsRef.current.add(wordId);

    // Limpiar timeout anterior si existe
    if (seenUpdateTimeoutRef.current) {
      clearTimeout(seenUpdateTimeoutRef.current);
    }

    // Crear nuevo timeout para actualizar
    seenUpdateTimeoutRef.current = setTimeout(async () => {
      try {
        await wordService.incrementWordSeen(wordId);
      } catch (error) {
        console.error("Error incrementing word seen:", error);
      }
    }, 1000); // 1 segundo de debounce
  }, []);

  // Resetear el scroll del reverso al cambiar de tarjeta
  useEffect(() => {
    if (backScrollRef.current) {
      backScrollRef.current.scrollTop = 0;
    }
  }, [gameStats.currentIndex]);

  // Actualizar contador "seen" cuando el usuario ve una tarjeta (optimizado)
  useEffect(() => {
    const currentCard = shuffledWords[gameStats.currentIndex];
    if (currentCard?._id) {
      updateSeenWithDebounce(currentCard._id);
    }
  }, [gameStats.currentIndex, shuffledWords, updateSeenWithDebounce]);

  // Limpiar input de reconocimiento de voz al cambiar de tarjeta
  useEffect(() => {
    setRecognizedText("");
  }, [gameStats.currentIndex]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (seenUpdateTimeoutRef.current) {
        clearTimeout(seenUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Estados para reconocimiento de voz
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Verificar soporte para reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        toast.error("Error en el reconocimiento de voz");
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
        toast.error("Error al iniciar el reconocimiento de voz");
      }
    }
  };

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
    setShuffledWords(shuffleArray(words));
    gameStats.reset();
    setIsFlipped(false);
  };

  const handleReset = () => {
    setShuffledWords(words);
    gameStats.reset();
    setIsFlipped(false);
  };

  const handleSetLevel = async (level: "easy" | "medium" | "hard") => {
    if (shuffledWords[gameStats.currentIndex]?._id) {
      try {
        // Convertir el nivel a dificultad y calidad para el sistema de repaso
        let difficulty = 3;
        let quality = 3;

        switch (level) {
          case "easy":
            difficulty = 1;
            quality = 5; // Muy fácil
            break;
          case "medium":
            difficulty = 3;
            quality = 3; // Normal
            break;
          case "hard":
            difficulty = 5;
            quality = 1; // Muy difícil
            break;
        }

        // Actualizar usando el nuevo sistema de repaso
        await updateWordReview(
          shuffledWords[gameStats.currentIndex]._id,
          difficulty,
          quality
        );

        // También actualizar el nivel tradicional para compatibilidad
        await updateWordLevel(shuffledWords[gameStats.currentIndex]._id, level);

        toast.success(`Palabra marcada como '${level}'`, {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () =>
              handleApiResult(
                {
                  success: true,
                  data: { level, word: shuffledWords[gameStats.currentIndex] },
                  message: `Palabra marcada como '${level}'`,
                },
                "Marcar Palabra"
              ),
          },
          cancel: {
            label: <X className="h-4 w-4" />,
            onClick: () => toast.dismiss(),
          },
        });
        gameStats.next();
        setIsFlipped(false);
      } catch (error: any) {
        handleApiResult(error, "Marcar Palabra");
      }
    }
  };

  const actions = (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              className="h-10 w-10 p-0"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mezclar palabras</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-10 w-10 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reiniciar juego</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatsModalOpen(true)}
              className="h-10 w-10 p-0"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver estadísticas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="h-10 w-10 p-0"
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isFullScreen
                ? "Salir de pantalla completa"
                : "Pantalla completa"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const currentCard = useMemo(
    () => shuffledWords[gameStats.currentIndex],
    [shuffledWords, gameStats.currentIndex]
  );

  if (loading)
    return (
      <PageLayout>
        <PageHeader
          title={<Skeleton className="w-32 h-6" />}
          description={<Skeleton className="w-48 h-4" />}
          actions={
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          }
        />
        <div className="flex flex-col flex-1 items-center w-full py-4">
          <Skeleton className="w-16 h-4 mb-4" />
          <div className="flex-1 flex items-center justify-center w-full max-w-md">
            <Skeleton className="w-full h-96 rounded-xl" />
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="w-10 h-8 rounded" />
            <Skeleton className="w-16 h-8 rounded" />
            <Skeleton className="w-10 h-8 rounded" />
          </div>
        </div>
      </PageLayout>
    );
  if (!shuffledWords.length) return <div>No hay tarjetas para practicar.</div>;

  return (
    <PageLayout className={isFullScreen ? "" : "space-y-6"}>
      <PageHeader
        title="Juego Anki"
        description="Practica vocabulario con tarjetas interactivas"
        actions={actions}
      />

      <div
        className={cn(
          "flex flex-col flex-1 min-h-0 transition-all duration-300 CARRO m-0",
          isFullScreen
            ? "fixed top-0 left-0 w-screen h-dvh z-50 m-0 bg-background p-6"
            : "h-[calc(100dvh-180px)] items-center w-full py-0 m-0"
        )}
      >
        {/* Card de reconocimiento de voz */}
        <Card
          className={cn(
            "w-full mx-1 p-2 mb-1",
            isFullScreen ? "max-w-6xl" : "max-w-lg"
          )}
        >
          {/* Desktop: Micrófono + texto */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex justify-center">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                  isRecording ? "animate-pulse bg-red-500 hover:bg-red-600" : ""
                }`}
                onClick={toggleRecording}
                disabled={!isSupported}
              >
                {isRecording ? (
                  <div className="w-3 h-3 bg-white rounded-sm" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Button>
            </div>

            <div className="flex-1 min-h-8 flex items-center">
              <div className="w-full p-2 border rounded-lg bg-background min-h-8 flex items-center justify-between">
                <div className="flex-1">
                  {recognizedText ? (
                    <span className="text-sm font-medium">
                      {recognizedText}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic text-sm">
                      {isRecording
                        ? "Escuchando..."
                        : "Presiona el micrófono y habla"}
                    </span>
                  )}
                </div>
                {recognizedText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-2 hover:bg-red-100 hover:text-red-600"
                    onClick={() => setRecognizedText("")}
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Solo input con placeholder */}
          <div className="md:hidden">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Usa el micrófono de tu dispositivo para hablar..."
                className="w-full p-3 pr-10 text-sm"
                value={recognizedText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecognizedText(e.target.value)}
              />
              {recognizedText && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => setRecognizedText("")}
                >
                  ✕
                </Button>
              )}
            </div>
          </div>

          {/* Mensaje de soporte */}
          {!isSupported && (
            <div className="mt-1 text-xs text-red-500 text-center">
              Tu navegador no soporta reconocimiento de voz
            </div>
          )}
        </Card>

        {/* Botón de salir - flotante, no ocupa espacio en el layout */}
        {isFullScreen && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsFullScreen(false)}
            aria-label="Salir de pantalla completa"
            title="Salir"
            className="absolute top-0 right-0 h-8 w-8 p-0 rounded-md shadow-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div
          className={cn(
            "flex-1 flex items-center justify-center w-full min-h-0",
            isFullScreen ? "max-w-7xl h-full" : "max-w-lg"
          )}
        >
          <div
            className={`flip-card group w-full h-full max-h-full ${
              isFlipped ? "flipped" : ""
            }`}
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
              <Card className="flip-card-front absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 overflow-hidden p-0">
                {currentCard?.img ? (
                  <img
                    src={currentCard.img}
                    alt={currentCard.word}
                    className="absolute inset-0 w-full h-full object-contain z-0"
                    style={{ objectFit: "contain" }}
                  />
                ) : null}
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
                  <AudioButtons word={currentCard?.word} />
                </div>
              </Card>
              {/* Reverso */}
              <div
                className="flip-card-back absolute inset-0 w-full h-full backface-hidden overflow-y-auto p-0"
                style={{ transform: "rotateY(180deg)" }}
                ref={backScrollRef}
              >
                {currentCard && (
                  <WordDetailsCard word={currentCard} variant="compact" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de progreso con botón FLIP y navegación */}
        <div
          className={cn(
            "flex items-center justify-between w-full px-2 py-2",
            isFullScreen ? "mb-4 mt-6 max-w-6xl" : "mb-1 max-w-lg"
          )}
        >
          {/* Botón Anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={gameStats.currentIndex === 0}
            className="h-7 px-2 text-xs"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          {/* Contador y FLIP centrados */}
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-xs font-medium px-3 py-1"
            >
              {gameStats.currentIndex + 1}/{shuffledWords.length}
            </Badge>

            <Button
              variant="default"
              size="sm"
              onClick={handleFlip}
              className="h-7 px-2 text-xs font-medium"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              FLIP
            </Button>
          </div>

          {/* Botón Siguiente */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={gameStats.currentIndex === shuffledWords.length - 1}
            className="h-7 px-2 text-xs"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Modal de estadísticas */}
      <AnkiStatsModal
        open={isStatsModalOpen}
        onOpenChange={setIsStatsModalOpen}
      />
    </PageLayout>
  );
}
