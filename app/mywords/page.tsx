"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useWordsStore } from "@/lib/store/words-store"
import { ChevronLeft, ChevronRight, Plus, Volume2, Edit, Trash2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MyWordsPage() {
  const { words, addWord, updateWord, deleteWord, incrementHeard } = useWordsStore()

  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingWord, setCurrentPlayingWord] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    word: "",
    ipa: "",
    meaning: "",
    seen: new Date(),
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(words.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentWords = words.slice(startIndex, endIndex)

  const handleAddWord = () => {
    if (formData.word && formData.ipa && formData.meaning) {
      if (words.length >= 20) {
        alert("Máximo 20 palabras permitidas")
        return
      }
      addWord(formData)
      setFormData({
        word: "",
        ipa: "",
        meaning: "",
        seen: new Date(),
      })
      setIsAddModalOpen(false)
    }
  }

  const handleEditWord = () => {
    if (selectedWord && formData.word && formData.ipa && formData.meaning) {
      updateWord(selectedWord, formData)
      setIsEditModalOpen(false)
      setSelectedWord(null)
    }
  }

  const openEditModal = (wordId: string) => {
    const word = words.find((w) => w.id === wordId)
    if (word) {
      setFormData({
        word: word.word,
        ipa: word.ipa,
        meaning: word.meaning,
        seen: word.seen,
      })
      setSelectedWord(wordId)
      setIsEditModalOpen(true)
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedWord) {
      deleteWord(selectedWord)
      setDeleteDialogOpen(false)
      setSelectedWord(null)
    }
  }

  const openDeleteDialog = (wordId: string) => {
    setSelectedWord(wordId)
    setDeleteDialogOpen(true)
  }

  const speakWord = (word: string, wordId: string) => {
    if ("speechSynthesis" in window && !isPlaying) {
      setIsPlaying(true)
      setCurrentPlayingWord(wordId)

      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentPlayingWord(null)
        incrementHeard(wordId)
      }

      speechSynthesis.speak(utterance)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Words</h1>
          <p className="text-muted-foreground">Tu vocabulario personal con pronunciación</p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">{words.length}/20 palabras</Badge>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-green-neon" disabled={words.length >= 20}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Palabra
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Palabra</DialogTitle>
                <DialogDescription>Añade una nueva palabra a tu vocabulario personal</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="word">Palabra (Inglés)</Label>
                  <Input
                    id="word"
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    placeholder="beautiful"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipa">IPA (Transcripción Fonética)</Label>
                  <Input
                    id="ipa"
                    value={formData.ipa}
                    onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                    placeholder="/ˈbjuːtɪfəl/"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meaning">Significado (Español)</Label>
                  <Input
                    id="meaning"
                    value={formData.meaning}
                    onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                    placeholder="hermoso, bello"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="btn-green-neon" onClick={handleAddWord}>Agregar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabla de palabras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Vocabulario Personal - Página {currentPage} de {totalPages}
          </CardTitle>
          <CardDescription>Haz clic en el icono de audio para escuchar la pronunciación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Word</TableHead>
                  <TableHead className="w-[200px]">IPA</TableHead>
                  <TableHead className="w-[200px]">Mean (SP)</TableHead>
                  <TableHead className="w-[120px]">Seen</TableHead>
                  <TableHead className="w-[100px]">Parlanciso</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWords.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="font-medium">{word.word}</TableCell>
                    <TableCell className="font-mono text-sm">{word.ipa}</TableCell>
                    <TableCell>{word.meaning}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{word.seen.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakWord(word.word, word.id)}
                          disabled={isPlaying}
                          className="h-8 w-8 p-0"
                        >
                          <Volume2
                            className={cn(
                              "h-4 w-4",
                              currentPlayingWord === word.id && isPlaying && "animate-pulse text-primary",
                            )}
                          />
                        </Button>
                        <Badge variant="secondary" className="text-xs">
                          {word.timesHeard}x
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(word.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(word.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Navegación */}
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Palabra</DialogTitle>
            <DialogDescription>Modifica los detalles de la palabra</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-word">Palabra (Inglés)</Label>
              <Input
                id="edit-word"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                placeholder="beautiful"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ipa">IPA (Transcripción Fonética)</Label>
              <Input
                id="edit-ipa"
                value={formData.ipa}
                onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                placeholder="/ˈbjuːtɪfəl/"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-meaning">Significado (Español)</Label>
              <Input
                id="edit-meaning"
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                placeholder="hermoso, bello"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="btn-green-neon" onClick={handleEditWord}>Guardar Cambios</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta palabra?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La palabra será eliminada permanentemente de tu vocabulario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
