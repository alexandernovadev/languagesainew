import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
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
import { WordDetailsModal } from "@/components/word-details";
import { WordFiltersModal } from "@/components/forms/word-filters/WordFiltersModal";
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
  Lightbulb,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";
import { SPEECH_RATES } from "../../speechRates";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useWordFilters } from "@/hooks/useWordFilters";

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
    setFilters,
    generateWord,
  } = useWordStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  // Hook para obtener información de filtros activos
  const { activeFiltersCount, getActiveFiltersDescription } = useWordFilters();

  const dots = useAnimatedDots();

  // Evitar fetch duplicado por filtros al montar
  const filtersFirstRender = useRef(true);
  // Evitar fetch duplicado por búsqueda local al montar
  const searchFirstRender = useRef(true);

  useEffect(() => {
    if (searchFirstRender.current) {
      searchFirstRender.current = false;
      return;
    }
    if (localSearch === "") return;
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500); // 500ms debounce delay
    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setSearchQuery]);

  // Efecto de carga inicial
  useEffect(() => {
    const loadWords = async () => {
      try {
        await getWords();
        toast.success("Palabras cargadas exitosamente");
      } catch (error: any) {
        toast.error("Error al cargar palabras", {
          description: error.message || "No se pudieron cargar las palabras",
        });
      }
    };
    loadWords();
  }, []);

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
    try {
      if (isEditing && selectedWord) {
        await updateWord(selectedWord._id, data);
        toast.success("Palabra actualizada", {
          description: `La palabra "${
            data.word || selectedWord.word
          }" ha sido actualizada correctamente`,
        });
      } else {
        await createWord(data as Omit<Word, "_id">);
        toast.success("Palabra creada", {
          description: `La palabra "${data.word}" ha sido agregada a tu vocabulario`,
        });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Error al guardar palabra", {
        description: error.message || "No se pudo guardar la palabra",
      });
    }
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

  const handleDeleteConfirm = async () => {
    if (selectedWord?._id) {
      try {
        await deleteWord(selectedWord._id);
        toast.success("Palabra eliminada", {
          description: `La palabra "${selectedWord.word}" ha sido eliminada`,
        });
        setDeleteDialogOpen(false);
        setSelectedWord(null);
      } catch (error: any) {
        toast.error("Error al eliminar palabra", {
          description: error.message || "No se pudo eliminar la palabra",
        });
      }
    }
  };

  const viewWordDetails = (word: Word) => {
    setSelectedWord(word);
    setDetailsModalOpen(true);
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
      toast.success("Palabra generada", {
        description: `La palabra "${localSearch}" ha sido generada y agregada a tu vocabulario`,
      });
      await getWords();
    } catch (error: any) {
      toast.error("Error al generar palabra", {
        description: error.message || "No se pudo generar la palabra",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handler para filtros que ignora el primer render
  const handleFiltersChange = (filters: any) => {
    if (filtersFirstRender.current) {
      filtersFirstRender.current = false;
      return;
    }
    setFilters(filters);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Mis Palabras"
        description="Gestiona tu vocabulario personal."
        actions={
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltersModalOpen(true)}
                    className="h-10 w-10 p-0 relative"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-1 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-green-600 text-white">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {activeFiltersCount > 0 ? (
                      <div>
                        <div className="font-medium mb-1">
                          {activeFiltersCount} filtro
                          {activeFiltersCount !== 1 ? "s" : ""} activo
                          {activeFiltersCount !== 1 ? "s" : ""}
                        </div>
                        <div className="space-y-1">
                          {getActiveFiltersDescription?.map((desc, index) => (
                            <div key={index} className="text-muted-foreground">
                              • {desc}
                            </div>
                          )) || []}
                        </div>
                      </div>
                    ) : (
                      <div>Sin filtros activos</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDialog()}
              className="h-10 w-10 rounded-full"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        }
      />

      {/* Tabla de palabras */}
      <Card className="!p-0 !m-0 shadow-none border-none">
        <div className="w-full overflow-x-auto p-0 m-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palabra</TableHead>
                <TableHead>Imagen</TableHead>
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
                    <TableCell colSpan={7}>
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
                        onClick={() =>
                          speakWord(word.word, SPEECH_RATES.NORMAL)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          speakWord(word.word, SPEECH_RATES.SUPERSLOW)
                        }
                        className="h-8 w-8 p-0"
                      >
                        🐢
                      </Button>
                      {word.word}
                    </TableCell>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                        {word.img ? (
                          <img
                            src={word.img}
                            alt={word.word}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        {!word.img && (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <span className="text-xs">NO</span>
                            <span className="text-xs">IMAGE</span>
                          </div>
                        )}
                      </div>
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
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 inline" /> {word.seen || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewWordDetails(word)}
                          className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-green-600 hover:text-green-700"
                        >
                          <Lightbulb className="h-4 w-4" />
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
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="text-muted-foreground">
                        {localSearch ? (
                          <div className="space-y-4">
                            <p>
                              No se encontraron palabras para "{localSearch}"
                            </p>
                            <div className="flex flex-col items-center gap-2">
                              <Button
                                className={
                                  generating ? "shimmer-text" : undefined
                                }
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
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p>No se encontraron palabras</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                getWords().catch((error) => {
                                  toast.error("Error al recargar", {
                                    description:
                                      error.message ||
                                      "No se pudieron recargar las palabras",
                                  });
                                })
                              }
                              className="rounded-full"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Recargar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
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
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col border border-gray-600 shadow-2xl">
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
      {selectedWord && (
        <WordDetailsModal
          word={selectedWord}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          showLevelButtons={true}
          showRefreshButtons={true}
        />
      )}

      {/* Modal de filtros */}
      <WordFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        onFiltersChange={handleFiltersChange}
      />
    </PageLayout>
  );
}
