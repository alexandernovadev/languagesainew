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
import { ModalNova } from "@/components/ui/modal-nova";
import { AlertDialogNova } from "@/components/ui/alert-dialog-nova";
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
  RefreshCw,
  Stars,
  SlidersHorizontal,
  Clipboard,
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
import { useResultHandler } from "@/hooks/useResultHandler";
import { useFilterUrlSync } from "@/hooks/useFilterUrlSync";
import { capitalize } from "@/utils/common/string/capitalize";
import { ActionButtonsHeader } from "@/components/ui/action-buttons-header";

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
    currentFilters,
  } = useWordStore();

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Función para copiar palabra al portapapeles
  const copyWordToClipboard = async (word: Word) => {
    try {
      const textToCopy = `${capitalize(word.word)}:\n${capitalize(word.spanish?.definition || word.definition || 'Sin definición')}`;
      await navigator.clipboard.writeText(textToCopy);
      toast.success(`Se copió "${capitalize(word.word)}" al portapapeles`);
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = `${capitalize(word.word)}:\n${capitalize(word.spanish?.definition || word.definition || 'Sin definición')}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(`Se copió "${capitalize(word.word)}" al portapapeles`);
    }
  };

  // Hook para sincronización de filtros con URL
  const { clearURLFilters } = useFilterUrlSync(currentFilters, setFilters);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateInput, setGenerateInput] = useState("");

  // Hook para obtener información de filtros activos
  const { activeFiltersCount, getActiveFiltersDescription } = useWordFilters();

  const dots = useAnimatedDots();

  // Evitar fetch duplicado por búsqueda local al montar
  const searchFirstRender = useRef(true);

  useEffect(() => {
    if (searchFirstRender.current) {
      searchFirstRender.current = false;
      return;
    }
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
        // Los filtros se cargan automáticamente desde el hook useFilterUrlSync
        await getWords();
        
        toast.success("Palabras cargadas exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data: words, message: "Palabras cargadas exitosamente" }, "Cargar Palabras")
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
        });
      } catch (error: any) {
        handleApiResult(error, "Cargar Palabras")
      }
    };
    loadWords();
  }, []); // Solo ejecutar una vez al montar el componente



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
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data, message: `La palabra "${data.word || selectedWord.word}" ha sido actualizada correctamente` }, "Actualizar Palabra")
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
        });
      } else {
        await createWord(data as Omit<Word, "_id">);
        toast.success("Palabra creada", {
          description: `La palabra "${data.word}" ha sido agregada a tu vocabulario`,
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data, message: `La palabra "${data.word}" ha sido agregada a tu vocabulario` }, "Crear Palabra")
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
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
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data: selectedWord, message: `La palabra "${selectedWord.word}" ha sido eliminada` }, "Eliminar Palabra")
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
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
    const prompt = generateInput || localSearch;
    
    // Validar que haya al menos 2 caracteres
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Input inválido", {
        description: "Debes escribir al menos 2 caracteres para generar una palabra",
      });
      return;
    }

    setGenerating(true);
    try {
      await generateWord(prompt);
      toast.success("Palabra generada", {
        description: `La palabra "${prompt}" ha sido generada y agregada a tu vocabulario`,
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { word: prompt }, message: `La palabra "${prompt}" ha sido generada y agregada a tu vocabulario` }, "Generar Palabra")
        },
        cancel: {
          label: <XIcon className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
      await getWords();
      setGenerateModalOpen(false);
      setGenerateInput("");
    } catch (error: any) {
      toast.error("Error al generar palabra", {
        description: error.message || "No se pudo generar la palabra",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handler para filtros: aplicar solo si son diferentes
  const handleFiltersChange = (filters: any) => {
    // Evitar aplicar filtros si son iguales a los actuales
    if (JSON.stringify(filters) !== JSON.stringify(currentFilters)) {
      setFilters(filters);
      
      // Si se limpian todos los filtros, limpiar también la URL
      if (Object.keys(filters).length === 0) {
        clearURLFilters();
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await getWords();
      toast.success("Palabras actualizadas", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: words, message: "Palabras actualizadas" }, "Actualizar Palabras")
        },
        cancel: {
          label: <XIcon className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Palabras");
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Mis Palabras"
        description="Gestiona tu vocabulario personal."
        actions={
          <ActionButtonsHeader
            actions={[
              {
                id: "filters",
                icon: <SlidersHorizontal className="h-4 w-4" />,
                onClick: () => setFiltersModalOpen(true),
                tooltip: "Filtros",
                variant: "outline",
                badge: { count: activeFiltersCount, variant: "default" },
                detailedTooltip: activeFiltersCount > 0 ? (
                  <div className="text-xs">
                    <div className="font-medium mb-1">
                      {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}
                    </div>
                    <div className="space-y-1">
                      {getActiveFiltersDescription?.map((desc, index) => (
                        <div key={index} className="text-muted-foreground">
                          • {desc}
                        </div>
                      )) || []}
                    </div>
                  </div>
                ) : undefined
              },
              {
                id: "generate",
                icon: <Stars className="h-4 w-4" />,
                onClick: () => setGenerateModalOpen(true),
                tooltip: "Generar palabra",
                variant: "outline"
              },
              {
                id: "refresh",
                icon: <RefreshCw className="h-4 w-4" />,
                onClick: handleRefresh,
                tooltip: "Actualizar palabras",
                variant: "outline"
              },
              {
                id: "add",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => openDialog(),
                tooltip: "Agregar palabra",
                variant: "default"
              }
            ]}
          />
        }
      />

      {/* Search and Actions */}
      <div className="sticky top-[56px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Buscar palabras..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
            {localSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocalSearch("")}
                className="absolute right-1 top-1 h-5 w-5 p-0"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de palabras */}
      <Card className="!p-0 !m-0 shadow-none border-none">
        <div className="w-full overflow-x-auto p-0 m-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Palabra</TableHead>
                <TableHead className="w-16">Copiar</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead>IPA</TableHead>
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
                  <TableRow 
                    key={word._id}
                    onDoubleClick={() => viewWordDetails(word)}
                    className="cursor-pointer select-none"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col md:flex-row gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              speakWord(word.word, SPEECH_RATES.NORMAL)
                            }
                            className="h-8 w-8 p-0 select-none"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              speakWord(word.word, SPEECH_RATES.SUPERSLOW)
                            }
                            className="h-8 w-8 p-0 select-none"
                          >
                            🐢
                          </Button>
                        </div>
                        <div className="flex flex-col mt-3 md:mt-0">
                          <span className="capitalize text-lg font-medium">
                            {word.word}
                          </span>
                          <span className="capitalize text-sm text-muted-foreground">
                            {word.spanish?.word || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyWordToClipboard(word)}
                              className="h-8 w-8 rounded-md text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 border border-transparent hover:border-purple-700/30 transition-all duration-200"
                            >
                              <Clipboard className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copiar al portapapeles</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                    <TableCell>
                      <WordLevelBadge level={word.level} />
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 inline" /> {word.seen || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => viewWordDetails(word)}
                                className="h-8 w-8 rounded-md text-green-400 hover:text-green-300 hover:bg-green-900/20 border border-transparent hover:border-green-700/30 transition-all duration-200"
                              >
                                <Lightbulb className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalles</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDialog(word)}
                                className="h-8 w-8 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-transparent hover:border-blue-700/30 transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar palabra</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(word)}
                                className="h-8 w-8 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-700/30 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar palabra</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
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
                              <RefreshCw className="h-4 w-4 mr-2" />
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
      <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-t-lg shadow-lg p-2">
        <div className="flex items-center justify-center space-x-2">
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
      </div>

      <ModalNova
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={isEditing ? `Editar | ${capitalize(selectedWord?.word || 'Palabra')}` : "Agregar Nueva Palabra"}
        description={
          isEditing
            ? "Modifica los detalles de la palabra."
            : "Añade una nueva palabra a tu vocabulario."
        }
        size="4xl"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="word-form"
              disabled={actionLoading.create || actionLoading.update}
            >
              {actionLoading.create || actionLoading.update
                ? "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Crear"}
            </Button>
          </>
        }
      >
        <WordForm
          initialData={isEditing && selectedWord ? selectedWord : {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setDialogOpen(false)}
          loading={actionLoading.create || actionLoading.update}
        />
      </ModalNova>

      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Estás seguro de eliminar esta palabra?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={actionLoading.delete}
      />

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

      {/* Generar Palabra Alert */}
      <AlertDialogNova
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        title="Generar palabra"
        description={
          <div className="space-y-2 pt-2">
            <Input
              placeholder="Escribe la palabra o prompt..."
              value={generateInput}
              onChange={(e) => setGenerateInput(e.target.value)}
            />
            {!generateInput && localSearch && (
              <p className="text-xs text-muted-foreground">Se usará la búsqueda actual: "{localSearch}"</p>
            )}
            <p className="text-xs text-muted-foreground">
              {generateInput ? (
                generateInput.trim().length < 2 ? (
                  <span className="text-orange-500">⚠️ Mínimo 2 caracteres requeridos</span>
                ) : (
                  <span className="text-green-500">✅ Input válido</span>
                )
              ) : localSearch ? (
                localSearch.trim().length < 2 ? (
                  <span className="text-orange-500">⚠️ Búsqueda actual muy corta (mínimo 2 caracteres)</span>
                ) : (
                  <span className="text-green-500">✅ Se usará la búsqueda actual</span>
                )
              ) : (
                <span className="text-muted-foreground">Escribe al menos 2 caracteres</span>
              )}
            </p>
          </div>
        }
        onConfirm={handleGenerateWord}
        confirmText={generating ? "Generando..." : "Generar palabra"}
        cancelText="Cancelar"
        loading={generating}
        confirmClassName="btn-green-action"
        shouldAutoCloseOnConfirm={false}
      />
    </PageLayout>
  );
}
