import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RefreshCw,
  Loader2,
  Wand2,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useGameStats } from "@/hooks/use-game-stats";
import { useWordStore } from "@/lib/store/useWordStore";
import { wordService } from "@/services/wordService";
import { SPEECH_RATES } from "../../../speechRates";
import { toast } from "sonner";
import { shuffleArray } from "@/utils/common";
import { Skeleton } from "@/components/ui/skeleton";
import { AnkiStatsModal } from "@/components/games/anki/AnkiStatsModal";
import { WordDetailsCard } from "@/components/word-details";

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

const AudioButtons = ({ word, size = "md", className = "" }: AudioButtonsProps) => {
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
          speakWord(SPEECH_RATES.NORMAL);
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
          speakWord(SPEECH_RATES.SUPERSLOW);
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
    loading,
    updateWordLevel,
    updateWordReview,
    updateWordImage,
    incrementWordSeen,
    actionLoading,
  } = useWordStore();

  // Estado local para palabras mezcladas
  const [shuffledWords, setShuffledWords] = useState(words);

  // Estado para el modal de estadísticas
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        await getWordsForReview(20); // Usar el nuevo método de repaso inteligente
        toast.success("Tarjetas de Anki cargadas exitosamente");
      } catch (error: any) {
        toast.error(error.message || "Error al cargar tarjetas");
      }
    };
    fetchWords();
  }, [getWordsForReview]);

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

  // Actualizar contador "seen" cuando el usuario ve una tarjeta
  useEffect(() => {
    const currentCard = shuffledWords[gameStats.currentIndex];
    if (currentCard?._id && !viewedWordsRef.current.has(currentCard._id)) {
      // Marcar como vista para evitar bucles
      viewedWordsRef.current.add(currentCard._id);
      
      // Llamar directamente al servicio sin usar el store para evitar bucles
      wordService.incrementWordSeen(currentCard._id).catch((error: any) => {
        console.error('Error incrementing word seen:', error);
      });
    }
  }, [gameStats.currentIndex, shuffledWords]);

  // Estados para reconocimiento de voz
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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
        await updateWordReview(shuffledWords[gameStats.currentIndex]._id, difficulty, quality);
        
        // También actualizar el nivel tradicional para compatibilidad
        await updateWordLevel(shuffledWords[gameStats.currentIndex]._id, level);
        
        toast.success(`Palabra marcada como '${level}'`);
        gameStats.next();
        setIsFlipped(false);
      } catch (error: any) {
        toast.error(
          error.message || "Error al actualizar el nivel de la palabra"
        );
      }
    }
  };

  const handleGenerateImage = async () => {
    const currentWord = shuffledWords[gameStats.currentIndex];
    if (!currentWord?._id) {
      toast.error("No hay palabra seleccionada");
      return;
    }

    setIsGeneratingImage(true);
    toast.info(`Generando imagen para "${currentWord.word}"...`);
    
    try {
      await updateWordImage(currentWord._id, currentWord.word, currentWord.img || "");
      toast.success(`¡Imagen generada exitosamente para "${currentWord.word}"!`);
      // Recargar las palabras para obtener la imagen actualizada
      await getWordsForReview(20);
    } catch (error: any) {
      toast.error(`Error al generar imagen para "${currentWord.word}": ${error.message || "Error desconocido"}`);
    } finally {
      setIsGeneratingImage(false);
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
      <Button variant="outline" onClick={() => setIsStatsModalOpen(true)}>
        <BarChart3 className="h-4 w-4" />
      </Button>
    </>
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
    <PageLayout>
      <PageHeader
        title="Juego Anki"
        description="Practica vocabulario con tarjetas interactivas"
        actions={actions}
      />
      
      <div className="flex flex-col flex-1 min-h-0 h-[calc(100vh-180px)] items-center w-full py-0 my-0">
        {/* Indicador de progreso compacto */}
        <span className="text-xs text-muted-foreground rounded px-2 shadow-sm  mb-1 py-0">
          {gameStats.currentIndex + 1}/{shuffledWords.length}
        </span>
        <div className="flex-1 flex items-center justify-center w-full max-w-lg min-h-0">
          <div
            className={`flip-card group w-full h-full max-h-full cursor-pointer ${
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
                {isGeneratingImage ? (
                  // Skeleton durante generación
                  <div className="absolute inset-0 w-full h-full z-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Generando imagen...
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {currentCard?.word}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentCard?.img ? (
                  <img
                    src={currentCard.img}
                    alt={currentCard.word}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ objectFit: "cover" }}
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
                <div className="w-full flex justify-between items-center px-4 py-1 bg-transparent z-10">
                  <span className="font-bold text-lg capitalize text-white">{currentCard?.spanish?.word}</span>
                  <div className="flex items-center gap-2">
              
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      title="Generar imagen con AI"
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-zinc-200">
                      <span role="img" aria-label="visto">👁️</span> {currentCard?.seen ?? 0}
                    </span>
                    <AudioButtons word={currentCard?.word} size="sm" />
                  </div>
                </div>
                <div className="flex-1 w-full h-full overflow-y-auto">
                  {currentCard && (
                    <WordDetailsCard
                      word={currentCard}
                      variant="compact"
                      showLevelButtons={false}
                      showRefreshButtons={false}
                      showAudioButtons={false}
                    />
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

        {/* Card de reconocimiento de voz */}
        <Card className="w-full max-w-lg mx-1 p-2 mb-1">
          <div className="flex items-center gap-2">
            {/* Micrófono - 20% */}
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

            {/* Área de texto - 80% */}
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

          {/* Mensaje de soporte */}
          {!isSupported && (
            <div className="mt-1 text-xs text-red-500 text-center">
              Tu navegador no soporta reconocimiento de voz
            </div>
          )}
        </Card>
        {/* Botones SIEMPRE abajo */}
        <div className="flex justify-center gap-4 mt-2 mb-2 w-full">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={gameStats.currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
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
            disabled={gameStats.currentIndex === shuffledWords.length - 1}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
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
