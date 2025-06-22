"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, RefreshCw } from "lucide-react"

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
]

export default function AnkiGame() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completedCards, setCompletedCards] = useState<number[]>([])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setIsFlipped(false)
    }
  }

  const handleKnow = () => {
    if (!completedCards.includes(flashcards[currentCard].id)) {
      setCompletedCards([...completedCards, flashcards[currentCard].id])
    }
    handleNext()
  }

  const handleDontKnow = () => {
    handleNext()
  }

  const handleShuffle = () => {
    // En una implementación real, aquí barajarías las cartas
    setCurrentCard(0)
    setIsFlipped(false)
    setCompletedCards([])
  }

  const handleReset = () => {
    setCurrentCard(0)
    setIsFlipped(false)
    setCompletedCards([])
  }

  const progress = ((currentCard + 1) / flashcards.length) * 100
  const correctAnswers = completedCards.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anki Game</h1>
          <p className="text-muted-foreground">Practica vocabulario con tarjetas interactivas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShuffle}>
            <Shuffle className="h-4 w-4 mr-2" />
            Barajar
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{currentCard + 1}</div>
            <p className="text-xs text-muted-foreground">Tarjeta actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{flashcards.length}</div>
            <p className="text-xs text-muted-foreground">Total de tarjetas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{correctAnswers}</div>
            <p className="text-xs text-muted-foreground">Conocidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            <p className="text-xs text-muted-foreground">Progreso</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Tarjeta principal */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <div className={`flip-card w-full h-64 cursor-pointer ${isFlipped ? "flipped" : ""}`} onClick={handleFlip}>
            <div className="flip-card-inner relative w-full h-full">
              {/* Frente de la tarjeta */}
              <Card className="flip-card-front absolute w-full h-full backface-hidden">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Badge variant="secondary" className="mb-4">
                    {flashcards[currentCard].category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">{flashcards[currentCard].front}</h2>
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
                    {flashcards[currentCard].category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4 text-primary">{flashcards[currentCard].back}</h2>
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
        <Button variant="outline" onClick={handlePrevious} disabled={currentCard === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {isFlipped && (
          <>
            <Button variant="destructive" onClick={handleDontKnow}>
              No la sabía
            </Button>
            <Button variant="default" onClick={handleKnow}>
              La sabía
            </Button>
          </>
        )}

        <Button variant="outline" onClick={handleNext} disabled={currentCard === flashcards.length - 1}>
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <style jsx>{`
        .flip-card {
          perspective: 1000px;
        }
        
        .flip-card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front,
        .flip-card-back {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
