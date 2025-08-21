import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalNova } from "@/components/ui/modal-nova";
import { AlertDialogNova } from "@/components/ui/alert-dialog-nova";
import { useQuestionStore } from "@/lib/store/useQuestionStore";
import { Question, QuestionInput } from "@/models/Question";
import { QuestionFiltersModal } from "@/components/forms/question-filters/QuestionFiltersModal";
import { QuestionTable } from "@/components/questions/QuestionTable";
import { QuestionPagination } from "@/components/questions/QuestionPagination";
import { QuestionForm } from "@/components/forms/QuestionForm";
import { QuestionDetailsModal } from "@/components/QuestionDetailsModal";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  X as XIcon,
  SlidersHorizontal,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";
import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import { Badge } from "@/components/ui/badge";

export default function QuestionsPage() {
  const {
    questions,
    getQuestions,
    deleteQuestion,
    createQuestion,
    updateQuestion,
    loading,
    actionLoading,
    currentPage,
    totalPages,
    total,
    setPage,
    setSearchQuery,
    setFilters,
    errors,
    clearErrors,
  } = useQuestionStore();

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Hook para obtener información de filtros activos
  const { activeFiltersCount, getActiveFiltersDescription } =
    useQuestionFilters();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [localSearch, setLocalSearch] = useState("");
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  // Evitar fetch duplicado por filtros al montar
  const filtersFirstRender = useRef(true);
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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        await getQuestions();
        toast.success("Preguntas cargadas exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () =>
              handleApiResult(
                {
                  success: true,
                  data: questions,
                  message: "Preguntas cargadas exitosamente",
                },
                "Cargar Preguntas"
              ),
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss(),
          },
        });
      } catch (error: any) {
        handleApiResult(error, "Cargar Preguntas");
      }
    };
    loadQuestions();
  }, [getQuestions]);

  // Mostrar errores como toasts
  useEffect(() => {
    if (errors) {
      if (typeof errors === "string") {
        toast.error(errors);
      } else {
        Object.values(errors).forEach((error) => {
          if (error) toast.error(error);
        });
      }
      clearErrors();
    }
  }, [errors, clearErrors]);

  const handleFormSubmit = async (data: QuestionInput) => {
    try {
      if (isEditing && selectedQuestion) {
        await updateQuestion(selectedQuestion._id, data);
        toast.success("Pregunta actualizada correctamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () =>
              handleApiResult(
                {
                  success: true,
                  data,
                  message: "Pregunta actualizada correctamente",
                },
                "Actualizar Pregunta"
              ),
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss(),
          },
        });
      } else {
        await createQuestion(data);
        toast.success("Pregunta creada correctamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () =>
              handleApiResult(
                {
                  success: true,
                  data,
                  message: "Pregunta creada correctamente",
                },
                "Crear Pregunta"
              ),
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss(),
          },
        });
      }
      setDialogOpen(false);
      // Recargar las preguntas después de crear/actualizar
      getQuestions();
    } catch (error) {
      handleApiResult(error, "Crear/Actualizar Pregunta");
    }
  };

  const openDialog = (question?: Question) => {
    if (question) {
      setSelectedQuestion(question);
      setIsEditing(true);
    } else {
      setSelectedQuestion(null);
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const openDeleteDialog = (question: Question) => {
    setSelectedQuestion(question);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedQuestion?._id) {
      try {
        await deleteQuestion(selectedQuestion._id);
        setDeleteDialogOpen(false);
        setSelectedQuestion(null);
        toast.success("Pregunta eliminada correctamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () =>
              handleApiResult(
                {
                  success: true,
                  data: selectedQuestion,
                  message: "Pregunta eliminada correctamente",
                },
                "Eliminar Pregunta"
              ),
          },
          cancel: {
            label: <XIcon className="h-4 w-4" />,
            onClick: () => toast.dismiss(),
          },
        });
        // Recargar las preguntas después de eliminar
        getQuestions();
      } catch (error) {
        handleApiResult(error, "Eliminar Pregunta");
      }
    }
  };

  const viewQuestionDetails = (question: Question) => {
    setSelectedQuestion(question);
    setDetailsModalOpen(true);
  };

  // Usar useCallback para evitar re-renders innecesarios
  const handleFiltersChange = useCallback(
    (filters: any) => {
      if (filtersFirstRender.current) {
        filtersFirstRender.current = false;
        return;
      }
      setFilters(filters);
      // Llamar getQuestions después de actualizar los filtros
      setTimeout(() => {
        getQuestions(1, 10, filters);
      }, 0);
    },
    [setFilters, getQuestions]
  );

  const handleRefresh = async () => {
    try {
      await getQuestions();
      toast.success("Preguntas actualizadas", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () =>
            handleApiResult(
              {
                success: true,
                data: questions,
                message: "Preguntas actualizadas",
              },
              "Actualizar Preguntas"
            ),
        },
        cancel: {
          label: <XIcon className="h-4 w-4" />,
          onClick: () => toast.dismiss(),
        },
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Preguntas");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <PageHeader
          title={<Skeleton className="w-32 h-8" />}
          description={<Skeleton className="w-96 h-4" />}
          actions={
            <div className="flex gap-2">
              <Skeleton className="w-32 h-10 rounded" />
            </div>
          }
        />
        <div className="space-y-6">
          {/* Search and Actions Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="flex-1 h-10 rounded" />
            <Skeleton className="w-32 h-10 rounded" />
          </div>

          {/* Filters Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="w-24 h-6" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-full h-10 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Table Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="w-32 h-6" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <QuestionTable
                  questions={[]}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onView={() => {}}
                  onRetry={() => {}}
                  loading={true}
                />

                {/* Pagination Skeleton */}
                <div className="flex justify-center gap-2">
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="w-10 h-10 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Questions"
        description="Manage and create questions for language learning exercises and assessments."
        actions={
          <div className="flex items-center gap-2">
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="h-10 w-10 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar preguntas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openDialog()}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Crear nueva pregunta</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mx-2">
        <div className="relative flex-1 mb-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar preguntas por tema... (${total} preguntas)`}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-8"
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocalSearch("")}
              className="absolute right-1 top-1 h-6 w-6 p-0"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Questions Table */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <QuestionTable
              questions={questions}
              onEdit={openDialog}
              onDelete={openDeleteDialog}
              onView={viewQuestionDetails}
              onRetry={() => getQuestions()}
              loading={loading}
              searchQuery={localSearch}
            />

            {/* Pagination */}
            <QuestionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <ModalNova
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={isEditing ? "Editar Pregunta" : "Nueva Pregunta"}
        description={
          isEditing
            ? "Modifica los detalles de la pregunta."
            : "Crea una nueva pregunta para ejercicios de aprendizaje."
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
                // Trigger form submission
                const form = document.getElementById("question-form");
                if (form) {
                  form.dispatchEvent(
                    new Event("submit", { bubbles: true, cancelable: true })
                  );
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
          </>
        }
      >
        <div className="px-6 py-4">
          <QuestionForm
            initialData={
              isEditing && selectedQuestion ? selectedQuestion : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={actionLoading.create || actionLoading.update}
          />
        </div>
      </ModalNova>

      {/* Question Details Modal */}
      <QuestionDetailsModal
        question={selectedQuestion}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogNova
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Esto eliminará permanentemente la pregunta "${selectedQuestion?.text}" y todos sus datos asociados.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Eliminar"
        loading={actionLoading.delete}
      />

      {/* Modal de filtros */}
      <QuestionFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        onFiltersChange={handleFiltersChange}
      />
    </PageLayout>
  );
}
