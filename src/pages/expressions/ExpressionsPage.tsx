import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpressionLevelBadge } from "./components/ExpressionLevelBadge";
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
import { useExpressionStore } from "../../pages/expressions/store/useExpressionStore";
import { Expression } from "@/models/Expression";
import { ExpressionForm, ExpressionFormRef } from "../../pages/expressions/components/ExpressionForm";
import { ExpressionDetailsModal } from "../../pages/expressions/components/ExpressionDetailsModal";
import { ExpressionFiltersModal } from "../../pages/expressions/components/expression-filters/ExpressionFiltersModal";
import { ExpressionGeneratorModal } from "../../pages/expressions/components/ExpressionGeneratorModal";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Volume2,
  Edit,
  Trash2,
  Search,
  X as XIcon,
  Lightbulb,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
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
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useExpressionFilters } from "../../pages/expressions/hooks/useExpressionFilters";
import { capitalize } from "@/utils/common";
import { useResultHandler } from "@/hooks/useResultHandler";
import { useExpressionFilterUrlSync } from "../../pages/expressions/hooks/useExpressionFilterUrlSync";
import { SPEECH_RATES } from "@/constants/speechRates";
import { ActionButtonsHeader } from "@/components/ui/action-buttons-header";

export default function MyExpressionsPage() {
  const {
    expressions,
    getExpressions,
    deleteExpression,
    createExpression,
    updateExpression,
    loading,
    actionLoading,
    currentPage,
    totalPages,
    total,
    setPage,
    setSearchQuery,
    setFilters,
    filters,
  } = useExpressionStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpression, setSelectedExpression] =
    useState<Expression | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState("");
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const formRef = useRef<ExpressionFormRef>(null);

  // Hook para obtener información de filtros activos
  const { activeFiltersCount, getActiveFiltersDescription } =
    useExpressionFilters();
  
  // Hook para sincronización de filtros con URL
  const { clearURLFilters } = useExpressionFilterUrlSync(filters, setFilters);
  
  // Hook para manejo de resultados
  const { handleApiResult } = useResultHandler();

  useEffect(() => {
    getExpressions();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localSearch, setSearchQuery]);

  const loadExpressions = async () => {
    await getExpressions();
  };

  const handleFormSubmit = async (data: Partial<Expression>) => {
    try {
      if (isEditing && selectedExpression) {
        await updateExpression(selectedExpression._id, data);
        setDialogOpen(false);
        setIsEditing(false);
        setSelectedExpression(null);
      } else {
        await createExpression(data);
        setDialogOpen(false);
      }
    } catch (error) {
      handleApiResult(error, "Crear/Actualizar Expresión");
    }
  };

  const openDialog = (expression?: Expression) => {
    if (expression) {
      setSelectedExpression(expression);
      setIsEditing(true);
    } else {
      setSelectedExpression(null);
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const openDeleteDialog = (expression: Expression) => {
    setSelectedExpression(expression);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedExpression) {
      try {
        await deleteExpression(selectedExpression._id);
        setDeleteDialogOpen(false);
        setSelectedExpression(null);
      } catch (error) {
        handleApiResult(error, "Eliminar Expresión");
      }
    }
  };

  const viewExpressionDetails = (expression: Expression) => {
    setSelectedExpression(expression);
    setDetailsModalOpen(true);
  };

  const speakExpression = (text: string, rate = SPEECH_RATES.NORMAL) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  };

  const handleFiltersChange = (filters: any) => {
    setFilters(filters);
    setFiltersModalOpen(false);
    
    // Si se limpian todos los filtros, limpiar también la URL
    if (Object.keys(filters).length === 0) {
      clearURLFilters();
    }
  };

  const handleRefresh = async () => {
    try {
      await getExpressions();
      toast.success("Expresiones actualizadas", {
        action: {
          label: <RefreshCw className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: expressions, message: "Expresiones actualizadas" }, "Actualizar Expresiones")
        },
        cancel: {
          label: <XIcon className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Expresiones");
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Mis Expresiones"
        description="Gestiona tus expresiones idiomáticas y frases"
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
                    <div className="text-muted-foreground">
                      {getActiveFiltersDescription?.()}
                    </div>
                  </div>
                ) : undefined
              },
              {
                id: "refresh",
                icon: <RefreshCw className="h-4 w-4" />,
                onClick: handleRefresh,
                tooltip: "Actualizar expresiones",
                variant: "outline"
              },
              {
                id: "generate",
                icon: <Sparkles className="h-4 w-4" />,
                onClick: () => setGeneratorModalOpen(true),
                tooltip: "Generar expresión con AI",
                variant: "outline"
              },
              {
                id: "add",
                icon: <Plus className="h-4 w-4" />,
                onClick: () => openDialog(),
                tooltip: "Agregar expresión",
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
              placeholder={`Buscar expresiones... (${total} expresiones)`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-7 h-8 text-base"
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

      {/* Tabla de expresiones */}
      <Card className="flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expresión</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Tipos</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : expressions.length > 0 ? (
                expressions.map((expression) => (
                  <TableRow key={expression._id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div className="flex gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              speakExpression(expression.expression, SPEECH_RATES.NORMAL)
                            }
                            className="h-8 w-8 p-0 select-none"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              speakExpression(expression.expression, SPEECH_RATES.SUPERSLOW)
                            }
                            className="h-8 w-8 p-0 select-none"
                          >
                            🐢
                          </Button>
                        </div>
                        <div className="space-y-1 flex-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="font-medium cursor-help">
                                  {capitalize(expression.expression)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{capitalize(expression.expression)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm text-muted-foreground max-w-xs truncate cursor-help">
                                  {expression.spanish?.definition || expression.definition}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {expression.spanish?.definition || expression.definition}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ExpressionLevelBadge
                        level={expression.difficulty || "hard"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {expression.type?.slice(0, 1).map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                        {expression.type && expression.type.length > 1 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="cursor-help"
                                >
                                  +{expression.type.length - 1}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {expression.type.slice(1).map((type, index) => (
                                    <div key={index}>{type}</div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                        {expression.img ? (
                          <img
                            src={expression.img}
                            alt={expression.expression}
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
                        <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => viewExpressionDetails(expression)}
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
                                onClick={() => openDialog(expression)}
                                className="h-8 w-8 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-transparent hover:border-blue-700/30 transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar expresión</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(expression)}
                                className="h-8 w-8 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-700/30 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar expresión</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="space-y-4">
                      <div className="text-muted-foreground">
                        No hay expresiones disponibles
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadExpressions}
                        className="rounded-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recargar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-t-lg shadow-lg p-2">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 text-xs sm:text-[10px] text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-2 text-xs sm:text-[10px] text-white">
              Página {currentPage} de {totalPages} ({total} total)
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 text-xs sm:text-[10px] text-muted-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      <ModalNova
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={isEditing ? `Editar | ${capitalize(selectedExpression?.expression || 'Expresión')}` : "Nueva Expresión"}
        description={
          isEditing
            ? "Modifica los datos de la expresión"
            : "Crea una nueva expresión idiomática"
        }
        size="4xl"
        height="h-[90dvh]"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                formRef.current?.submit();
              }}
              disabled={actionLoading.create || actionLoading.update}
              className="min-w-[100px]"
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
        <div className="px-6 py-4">
          <ExpressionForm
            ref={formRef}
            initialData={selectedExpression || {}}
            onSubmit={handleFormSubmit}
          />
        </div>
      </ModalNova>

      {/* Modal de detalles con chat */}
      <ExpressionDetailsModal
        open={detailsModalOpen}
        expression={selectedExpression}
        onClose={() => setDetailsModalOpen(false)}
      />

      {/* Modal de filtros */}
      <ExpressionFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        onFiltersChange={handleFiltersChange}
      />

      {/* Modal de confirmación de eliminación */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente la expresión "${selectedExpression?.expression ? capitalize(selectedExpression.expression) : ''}".`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Eliminar"
        loading={actionLoading.delete}
      />

      {/* Modal de generación AI */}
      <ExpressionGeneratorModal
        open={generatorModalOpen}
        onOpenChange={setGeneratorModalOpen}
      />
    </PageLayout>
  );
}
