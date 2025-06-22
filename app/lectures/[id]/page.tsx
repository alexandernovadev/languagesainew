"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLecturesStore } from "@/lib/store/lectures-store"
import { ArrowLeft, Volume2, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LectureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getLecture, selectedWords, addSelectedWord, removeSelectedWord, clearSelectedWords } = useLecturesStore()

  const [lecture, setLecture] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      const foundLecture = getLecture(params.id as string)
      setLecture(foundLecture)
    }
  }, [params.id, getLecture])

  const speakWord = (word: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true)
      setCurrentWord(word)

      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentWord(null)
      }

      speechSynthesis.speak(utterance)
    }
  }

  const handleWordClick = (word: string) => {
    // Limpiar la palabra de puntuación
    const cleanWord = word.replace(/[.,!?;:"()]/g, "").toLowerCase()
    if (cleanWord.length > 2) {
      addSelectedWord(cleanWord)
      speakWord(cleanWord)
    }
  }

  const renderInteractiveText = (text: string) => {
    const words = text.split(" ")

    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:"()]/g, "").toLowerCase()
      const isSelected = selectedWords.includes(cleanWord)
      const isCurrentlyPlaying = currentWord === cleanWord && isPlaying

      return (
        <span
          key={index}
          className={cn(
            "cursor-pointer hover:bg-primary/20 rounded px-1 transition-colors",
            isSelected && "bg-primary/30 text-primary-foreground",
            isCurrentlyPlaying && "bg-yellow-400/50 animate-pulse",
          )}
          onClick={() => handleWordClick(word)}
        >
          {word}{" "}
        </span>
      )
    })
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Lectura no encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{lecture.title}</h1>
          {lecture.description && <p className="text-muted-foreground">{lecture.description}</p>}
        </div>
      </div>

      {/* Contenido de la lectura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contenido de la Lectura</span>
            <Badge variant="secondary">Haz clic en las palabras para escucharlas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {lecture.content.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 leading-relaxed text-justify">
                {renderInteractiveText(paragraph)}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Panel de palabras seleccionadas */}
      {selectedWords.length > 0 && (
        <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg border-t shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Palabras Seleccionadas ({selectedWords.length})</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSelectedWords}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedWords.map((word, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                  <span onClick={() => speakWord(word)}>{word}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                    onClick={() => removeSelectedWord(word)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => speakWord(word)}
                    disabled={isPlaying && currentWord === word}
                  >
                    <Volume2 className={cn("h-3 w-3", isPlaying && currentWord === word && "animate-pulse")} />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Espaciado para el panel fijo */}
      {selectedWords.length > 0 && <div className="h-32" />}
    </div>
  )
}
