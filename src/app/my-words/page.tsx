import { useEffect, useState } from "react"
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
import { useWordStore } from "@/lib/store/useWordStore"
import { Word } from "@/models/Word"
import { ChevronLeft, ChevronRight, Plus, Volume2, Edit, Trash2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyWordsPage() {
  const {
    words,
    getWords,
    deleteWord,
    loading,
    currentPage,
    totalPages,
    total,
    setPage,
    setSearchQuery,
    searchQuery,
  } = useWordStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingWord, setCurrentPlayingWord] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Word>>({
    word: "",
    IPA: "",
    spanish: { word: "", definition: "" },
  })

  useEffect(() => {
    getWords(1)
  }, [getWords])

  const handleAddWord = () => {
    // Logic for adding a word will be adapted to the new store
  }

  const handleEditWord = () => {
    // Logic for editing a word will be adapted to the new store
  }

  const openEditModal = (word: Word) => {
    setSelectedWord(word)
    setFormData({
      word: word.word,
      IPA: word.IPA,
      spanish: word.spanish,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedWord?._id) {
      deleteWord(selectedWord._id)
      setDeleteDialogOpen(false)
      setSelectedWord(null)
    }
  }

  const openDeleteDialog = (word: Word) => {
    setSelectedWord(word)
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
      }

      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Palabras</h1>
          <p className="text-muted-foreground">
            Gestiona tu vocabulario personal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar palabra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Palabra
          </Button>
        </div>
      </div>

      {/* Tabla de palabras */}
      <Card>
        <CardHeader>
          <CardTitle>Vocabulario</CardTitle>
          <CardDescription>
            {total} palabras en tu vocabulario. Página {currentPage} de{" "}
            {totalPages}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Palabra</TableHead>
                  <TableHead>IPA</TableHead>
                  <TableHead>Traducción</TableHead>
                  <TableHead>Visto</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : words.length > 0 ? (
                  words.map((word) => (
                    <TableRow key={word._id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakWord(word.word, word._id)}
                          className="h-8 w-8 p-0"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        {word.word}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {word.IPA || "N/A"}
                      </TableCell>
                      <TableCell>{word.spanish?.word || "N/A"}</TableCell>
                      <TableCell>{word.seen || 0} veces</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            word.level === "easy"
                              ? "default"
                              : word.level === "medium"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {word.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(word)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(word)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No se encontraron palabras.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Modals and Dialogs would be here, adapted to the new data structure */}
    </div>
  )
}
