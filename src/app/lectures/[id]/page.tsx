"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLectureStore } from "@/lib/store/useLectureStore"
import { ArrowLeft, Volume2, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Lecture } from "@/models/Lecture"

export default function LectureDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { lectures, getLectureById, loading } = useLectureStore()

  const [lecture, setLecture] = useState<Lecture | null>(null)

  // Palabras seleccionadas y pronunciación
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      getLectureById(id)
    }
  }, [id, getLectureById])

  useEffect(() => {
    if (id) {
      const foundLecture = lectures.find((l) => l._id === id)
      setLecture(foundLecture || null)
    }
  }, [id, lectures])

  const speakWord = (word: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true)
      setCurrentWord(word)

      const utterance = new window.SpeechSynthesisUtterance(word)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentWord(null)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,!?;:"()]/g, "").toLowerCase()
    if (cleanWord.length > 2 && !selectedWords.includes(cleanWord)) {
      setSelectedWords((prev) => [...prev, cleanWord])
      speakWord(cleanWord)
    }
  }

  const removeSelectedWord = (word: string) => {
    setSelectedWords((prev) => prev.filter((w) => w !== word))
  }

  const clearSelectedWords = () => {
    setSelectedWords([])
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando lectura...</p>
      </div>
    )
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Lectura no encontrada</p>
      </div>
    )
  }

  const words = lecture.content.split(/\s+/)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lecture.language} - {lecture.level}
          </h1>
          <div className="text-muted-foreground text-sm">
            {lecture.typeWrite} | {lecture.time} min
          </div>
        </div>
      </div>

      {/* Imagen */}
      {lecture.img && (
        <div className="w-full flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lecture.img} alt={lecture.language} className="rounded-lg max-h-64 object-cover" />
        </div>
      )}

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
            {words.map((word, index) => (
              <span
                key={index}
                className={`cursor-pointer transition-colors hover:bg-yellow-200 dark:hover:bg-yellow-700 ${
                  selectedWords.includes(word)
                    ? "bg-yellow-300 dark:bg-yellow-600"
                    : ""
                }`}
                onClick={() => handleWordClick(word)}
              >
                {word}{" "}
              </span>
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
