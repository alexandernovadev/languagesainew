import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WordLevelBadge } from "@/components/WordLevelBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWordStore } from "@/lib/store/useWordStore";
import { Word } from "@/models/Word";
import { WordForm } from "@/components/forms/WordForm";
import { WordDetailsModal } from "@/components/WordDetailsModal";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Volume2,
  Edit,
  Trash2,
  Search,
  Eye,
  X as XIcon,
} from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";
import { SPEECH_RATES } from "../../speechRates";

export default function MyWordsPage() {
  const {
    words,
    getWords,
    deleteWord,
    createWord,
    updateWord,
    updateWordLevel,
    updateWordExamples,
    updateWordCodeSwitching,
    updateWordSynonyms,
    updateWordTypes,
    updateWordImage,
    loading,
    actionLoading,
    currentPage,
    totalPages,
    total,
    setPage,
    setSearchQuery,
    searchQuery,
    generateWord,
  } = useWordStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState("");
  const [generating, setGenerating] = useState(false);

  const dots = useAnimatedDots(generating);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    getWords();
  }, [searchQuery, getWords]); // Re-fetch when the debounced search query changes

  // Sync selectedWord with updated data from store
  useEffect(() => {
    if (selectedWord && detailsModalOpen) {
      const updatedWord = words.find((w) => w._id === selectedWord._id);
      if (
        updatedWord &&
        JSON.stringify(updatedWord) !== JSON.stringify(selectedWord)
      ) {
        setSelectedWord(updatedWord);
      }
    }
  }, [words, selectedWord, detailsModalOpen]);

  const handleFormSubmit = async (data: Partial<Word>) => {
    if (isEditing && selectedWord) {
      await updateWord(selectedWord._id, data);
    } else {
      await createWord(data as Omit<Word, "_id">);
    }
    setDialogOpen(false);
  };

  const openDialog = (word?: Word, prefillWord?: string) => {
    if (word) {
      setSelectedWord(word);
      setIsEditing(true);
    } else {
      setSelectedWord(prefillWord ? ({ word: prefillWord } as Word) : null);
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const openDeleteDialog = (word: Word) => {
    setSelectedWord(word);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedWord?._id) {
      deleteWord(selectedWord._id);
      setDeleteDialogOpen(false);
      setSelectedWord(null);
    }
  };

  const viewWordDetails = (word: Word) => {
    setSelectedWord(word);
    setDetailsModalOpen(true);
  };

  const handleUpdateLevel = async (level: "easy" | "medium" | "hard") => {
    if (selectedWord?._id) {
      await updateWordLevel(selectedWord._id, level);
      // Update selectedWord level directly since we only get level data back
      setSelectedWord((prev) =>
        prev ? { ...prev, level, updatedAt: new Date().toISOString() } : null
      );
    }
  };

  const handleRefreshImage = async () => {
    if (selectedWord?._id) {
      await updateWordImage(
        selectedWord._id,
        selectedWord.word,
        selectedWord.img
      );
      // Update selectedWord with the latest data
      const updatedWord = words.find((w) => w._id === selectedWord._id);
      if (updatedWord) {
        setSelectedWord(updatedWord);
      }
    }
  };

  const handleRefreshExamples = async () => {
    if (selectedWord?._id) {
      await updateWordExamples(
        selectedWord._id,
        selectedWord.word,
        selectedWord.language,
        selectedWord.examples || []
      );
      // Update selectedWord with the latest data
      const updatedWord = words.find((w) => w._id === selectedWord._id);
      if (updatedWord) {
        setSelectedWord(updatedWord);
      }
    }
  };

  const handleRefreshSynonyms = async () => {
    if (selectedWord?._id) {
      await updateWordSynonyms(
        selectedWord._id,
        selectedWord.word,
        selectedWord.language,
        selectedWord.sinonyms || []
      );
      // Update selectedWord with the latest data
      const updatedWord = words.find((w) => w._id === selectedWord._id);
      if (updatedWord) {
        setSelectedWord(updatedWord);
      }
    }
  };

  const handleRefreshCodeSwitching = async () => {
    if (selectedWord?._id) {
      await updateWordCodeSwitching(
        selectedWord._id,
        selectedWord.word,
        selectedWord.language,
        selectedWord.codeSwitching || []
      );
      // Update selectedWord with the latest data
      const updatedWord = words.find((w) => w._id === selectedWord._id);
      if (updatedWord) {
        setSelectedWord(updatedWord);
      }
    }
  };

  const handleRefreshTypes = async () => {
    if (selectedWord?._id) {
      await updateWordTypes(
        selectedWord._id,
        selectedWord.word,
        selectedWord.language,
        selectedWord.type || []
      );
      // Update selectedWord with the latest data
      const updatedWord = words.find((w) => w._id === selectedWord._id);
      if (updatedWord) {
        setSelectedWord(updatedWord);
      }
    }
  };

  const speakWord = (word: string, rate = SPEECH_RATES.NORMAL) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  };

  const handleGenerateWord = async () => {
    setGenerating(true);
    try {
      await generateWord(localSearch);
      toast.success(`Palabra "${localSearch}" generada correctamente.`);
      await getWords();
    } finally {
      setGenerating(false);
    }
  };

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
              className="pl-10 w-full pr-10"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground focus:outline-none"
                aria-label="Limpiar búsqueda"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDialog()}
            className="h-12 w-12 rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Tabla de palabras */}
      <Card className="!p-0 !m-0 shadow-none border-none">
        <div className="w-full overflow-x-auto p-0 m-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palabra</TableHead>
                <TableHead>IPA</TableHead>
                <TableHead>Traducción</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Vistas</TableHead>
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
                    <TableCell className="font-medium flex items-center gap-2 capitalize text-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakWord(word.word, SPEECH_RATES.NORMAL)}
                        className="h-8 w-8 p-0"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakWord(word.word, SPEECH_RATES.SUPERSLOW)}
                        className="h-8 w-8 p-0"
                      >
                        🐢
                      </Button>
                      {word.word}
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-mono font-semibold">
                        {word.IPA || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize">
                      {word.spanish?.word || "N/A"}
                    </TableCell>
                    <TableCell>
                      <WordLevelBadge level={word.level} />
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1"><Eye className="h-4 w-4 inline" /> {word.seen || 0}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewWordDetails(word)}
                          className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-green-600 hover:text-green-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDialog(word)}
                          className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-yellow-600 hover:text-yellow-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(word)}
                          className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-muted-foreground"
                  >
                    <div>No se encontraron palabras.</div>
                    {localSearch && (
                      <div className="flex flex-col items-center gap-2 mt-4">
                        <Button
                          className={generating ? "shimmer-text" : undefined}
                          variant="outline"
                          disabled={generating}
                          onClick={handleGenerateWord}
                        >
                          Agregar palabra
                          <span className="font-bold text-base ml-2">
                            "{localSearch}"
                          </span>
                        </Button>
                        {generating && (
                          <div className="shimmer-text mt-2 text-base font-medium">
                            Generando palabra
                            <span
                              className="shimmer-text"
                              style={{
                                display: "inline-block",
                                width: "1.5em",
                                textAlign: "left",
                              }}
                            >
                              {dots || "\u00A0"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2 mt-2 w-full">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages} &mdash; {total} palabras
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-5 w-5" />
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
            <AlertDialogTitle>
              ¿Estás seguro de eliminar esta palabra?
            </AlertDialogTitle>
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

      {/* Modal de detalles de la palabra */}
      {detailsModalOpen && selectedWord && (
        <WordDetailsModal
          word={selectedWord}
          onClose={() => setDetailsModalOpen(false)}
          onUpdateLevel={handleUpdateLevel}
          onRefreshImage={handleRefreshImage}
          onRefreshExamples={handleRefreshExamples}
          onRefreshSynonyms={handleRefreshSynonyms}
          onRefreshCodeSwitching={handleRefreshCodeSwitching}
          onRefreshTypes={handleRefreshTypes}
          loading={actionLoading.updateLevel}
          loadingImage={actionLoading.updateImage}
          loadingExamples={actionLoading.updateExamples}
          loadingSynonyms={actionLoading.updateSynonyms}
          loadingCodeSwitching={actionLoading.updateCodeSwitching}
          loadingTypes={actionLoading.updateTypes}
        />
      )}
    </div>
  );
}
