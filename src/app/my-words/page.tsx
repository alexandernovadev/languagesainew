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
import { WordForm } from "@/components/forms/WordForm"
import { ChevronLeft, ChevronRight, Plus, Volume2, Edit, Trash2, BookOpen, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyWordsPage() {
  const {
    words,
    getWords,
    deleteWord,
    createWord,
    updateWord,
    loading,
    actionLoading,
    currentPage,
    totalPages,
    total,
    setPage,
    setSearchQuery,
    searchQuery,
  } = useWordStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)

  const [localSearch, setLocalSearch] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 500) // 500ms debounce delay

    return () => {
      clearTimeout(handler)
    }
  }, [localSearch, setSearchQuery])

  useEffect(() => {
    getWords()
  }, [searchQuery, getWords]) // Re-fetch when the debounced search query changes

  const handleFormSubmit = async (data: Partial<Word>) => {
    if (isEditing && selectedWord) {
      await updateWord(selectedWord._id, data)
    } else {
      await createWord(data as Omit<Word, "_id">)
    }
    setDialogOpen(false)
  }

  const openDialog = (word?: Word) => {
    if (word) {
      setSelectedWord(word)
      setIsEditing(true)
    } else {
      setSelectedWord(null)
      setIsEditing(false)
    }
    setDialogOpen(true)
  }

  const openDeleteDialog = (word: Word) => {
    setSelectedWord(word)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedWord?._id) {
      deleteWord(selectedWord._id)
      setDeleteDialogOpen(false)
      setSelectedWord(null)
    }
  }

  const speakWord = (word: string) => {
    // Simplified speak logic, can be enhanced later
    const utterance = new SpeechSynthesisUtterance(word)
    speechSynthesis.speak(utterance)
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
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar palabra..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => openDialog()} className="h-12 w-12 rounded-full">
            <Plus className="h-6 w-6" />
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
                  <TableHead>Traducción</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && words.length === 0 ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
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
                          onClick={() => speakWord(word.word)}
                          className="h-8 w-8 p-0"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        {word.word}
                      </TableCell>
                      <TableCell>{word.spanish?.word || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            word.level === "easy" && "border-green-500 text-green-500",
                            word.level === "medium" && "border-blue-500 text-blue-500",
                            word.level === "hard" && "border-red-600 text-red-600"
                          )}
                        >
                          {word.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(word)}
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
                      colSpan={4}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>
              {isEditing ? "Editar Palabra" : "Agregar Nueva Palabra"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles de la palabra."
                : "Añade una nueva palabra a tu vocabulario."}
            </DialogDescription>
          </DialogHeader>
          <WordForm
            initialData={isEditing && selectedWord ? selectedWord : {}}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={actionLoading.create || actionLoading.update}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>¿Estás seguro de eliminar esta palabra?</AlertDialogTitle>
             <AlertDialogDescription>
               Esta acción no se puede deshacer.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancelar</AlertDialogCancel>
             <AlertDialogAction
               onClick={handleDeleteConfirm}
               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
             >
               {actionLoading.delete ? "Eliminando..." : "Eliminar"}
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
    </div>
  )
}
