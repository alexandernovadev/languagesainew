import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExpressionLevelBadge } from "@/components/ExpressionLevelBadge";
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
import { useExpressionStore } from "@/lib/store/useExpressionStore";
import { Expression } from "@/models/Expression";
import { ExpressionForm } from "@/components/forms/ExpressionForm";
import { ExpressionDetailsModal } from "@/components/expressions/ExpressionDetailsModal";
import { ExpressionFiltersModal } from "@/components/forms/expression-filters/ExpressionFiltersModal";
import { ExpressionGeneratorModal } from "@/components/expressions/ExpressionGeneratorModal";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Search,
  X as XIcon,
  Lightbulb,
  SlidersHorizontal,
  Sparkles,
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
import { useExpressionFilters } from "@/hooks/useExpressionFilters";

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

  // Hook para obtener información de filtros activos
  const { activeFiltersCount, getActiveFiltersDescription } =
    useExpressionFilters();

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
      console.error("Error submitting form:", error);
      toast.error("Error al crear la expresión");
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
        console.error("Error deleting expression:", error);
        toast.error("Error al eliminar la expresión");
      }
    }
  };

  const viewExpressionDetails = (expression: Expression) => {
    setSelectedExpression(expression);
    setDetailsModalOpen(true);
  };

  const handleFiltersChange = (filters: any) => {
    setFilters(filters);
    setFiltersModalOpen(false);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Mis Expresiones"
        description="Gestiona tus expresiones idiomáticas y frases"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar expresión..."
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
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-600 text-white"
                      >
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
                        <div className="text-muted-foreground">
                          {getActiveFiltersDescription?.()}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGeneratorModalOpen(true)}
                    className="h-10 w-10 rounded-full"
                  >
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generar expresión con AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Tabla */}
        <Card>
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
                        <div className="space-y-1">
                          <div className="font-medium">
                            {expression.expression}
                          </div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {expression.definition}
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
                                  <div className="space-y-2">
                                    <p className="font-medium text-xs">
                                      Tipos adicionales:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {expression.type
                                        .slice(1)
                                        .map((type, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {type}
                                          </Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {expression.type.length} tipos en total
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-10 h-10 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
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
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex flex-col items-center justify-center text-muted-foreground cursor-help">
                                    <span className="text-xs">NO</span>
                                    <span className="text-xs">IMG</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Sin imagen asociada</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() =>
                                    viewExpressionDetails(expression)
                                  }
                                  className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-green-600 hover:text-green-700"
                                >
                                  <Lightbulb className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalles</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => openDialog(expression)}
                                  className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-yellow-600 hover:text-yellow-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => openDeleteDialog(expression)}
                                  className="p-1 rounded-sm transition-all duration-200 hover:scale-110 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="text-muted-foreground">
                          {localSearch ? (
                            <div className="space-y-4">
                              <p>
                                No se encontraron expresiones para "
                                {localSearch}"
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <p>No hay expresiones aún</p>
                              <Button onClick={() => openDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Crear primera expresión
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
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Mostrando {expressions.length} de {total} expresiones
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 py-2 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl h-[90dvh] flex flex-col border border-gray-600 shadow-2xl">
          {/* Header Sticky */}
          <DialogHeader className="px-6 pt-4 pb-3 border-b bg-background sticky top-0 z-60">
            <DialogTitle>
              {isEditing ? "Editar Expresión" : "Nueva Expresión"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los datos de la expresión"
                : "Crea una nueva expresión idiomática"}
            </DialogDescription>
          </DialogHeader>

          {/* Content Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ExpressionForm
              initialData={selectedExpression || {}}
              onSubmit={handleFormSubmit}
            />
          </div>

          {/* Footer Sticky */}
          <div className="px-6 pt-2 border-t bg-background sticky z-10">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Trigger form submission
                  const form = document.querySelector("form");
                  if (form) {
                    const submitButton = form.querySelector(
                      'button[type="submit"]'
                    ) as HTMLButtonElement;
                    if (submitButton) {
                      submitButton.click();
                    }
                  }
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
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles con chat */}
      <ExpressionDetailsModal
        open={detailsModalOpen}
        expression={selectedExpression}
        onClose={() => setDetailsModalOpen(false)}
      />

      {/* Modal de filtros */}
      <ExpressionFiltersModal
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        onApply={handleFiltersChange}
      />

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-gray-600 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              expresión "{selectedExpression?.expression}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="btn-delete-danger"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de generación AI */}
      <ExpressionGeneratorModal
        open={generatorModalOpen}
        onOpenChange={setGeneratorModalOpen}
      />
    </PageLayout>
  );
}
