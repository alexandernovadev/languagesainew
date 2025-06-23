import { useState } from "react";
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
import { StatsGrid } from "@/components/ui/stats-grid";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGameStats } from "@/hooks/use-game-stats";

// Datos de ejemplo para las tarjetas
const flashcards = [
  { id: 1, front: "Hello", back: "Hola", category: "Greetings" },
  { id: 2, front: "Goodbye", back: "Adiós", category: "Greetings" },
  { id: 3, front: "Thank you", back: "Gracias", category: "Courtesy" },
  { id: 4, front: "Please", back: "Por favor", category: "Courtesy" },
  { id: 5, front: "Water", back: "Agua", category: "Food & Drink" },
  { id: 6, front: "House", back: "Casa", category: "Places" },
  { id: 7, front: "Car", back: "Coche", category: "Transport" },
  { id: 8, front: "Book", back: "Libro", category: "Objects" },
  { id: 9, front: "Friend", back: "Amigo", category: "People" },
  { id: 10, front: "Beautiful", back: "Hermoso", category: "Adjectives" },
];

export default function AnkiGame() {
  const [isFlipped, setIsFlipped] = useState(false);
  const gameStats = useGameStats(flashcards.length);

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

  const handleKnow = () => {
    gameStats.markAsCompleted(flashcards[gameStats.currentIndex].id);
    handleNext();
  };

  const handleDontKnow = () => {
    handleNext();
  };

  const handleShuffle = () => {
    gameStats.reset();
    setIsFlipped(false);
  };

  const handleReset = () => {
    gameStats.reset();
    setIsFlipped(false);
  };

  const stats = [
    { label: "Tarjeta actual", value: gameStats.currentIndex + 1 },
    { label: "Total de tarjetas", value: gameStats.totalItems },
    { label: "Conocidas", value: gameStats.correctAnswers },
    { label: "Progreso", value: Math.round(gameStats.progress), suffix: "%" },
  ];

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

  return (
    <PageLayout>
      <PageHeader
        title="Anki Game"
        description="Practica vocabulario con tarjetas interactivas"
        actions={actions}
      />

      <StatsGrid stats={stats} />

      <ProgressBar progress={gameStats.progress} />

      {/* Tarjeta principal */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <div
            className={`flip-card w-full h-64 cursor-pointer ${
              isFlipped ? "flipped" : ""
            }`}
            onClick={handleFlip}
          >
            <div className="flip-card-inner relative w-full h-full">
              {/* Frente de la tarjeta */}
              <Card className="flip-card-front absolute w-full h-full backface-hidden">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Badge variant="secondary" className="mb-4">
                    {flashcards[gameStats.currentIndex].category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    {flashcards[gameStats.currentIndex].front}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Haz clic para voltear
                  </div>
                </CardContent>
              </Card>

              {/* Reverso de la tarjeta */}
              <Card className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center bg-primary/5">
                  <Badge variant="secondary" className="mb-4">
                    {flashcards[gameStats.currentIndex].category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4 text-primary">
                    {flashcards[gameStats.currentIndex].back}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Haz clic para voltear
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={gameStats.currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {isFlipped && (
          <>
            <Button variant="outline" onClick={handleDontKnow}>
              No la sabía
            </Button>
            <Button onClick={handleKnow}>La sabía</Button>
          </>
        )}

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={gameStats.currentIndex === flashcards.length - 1}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </PageLayout>
  );
}
