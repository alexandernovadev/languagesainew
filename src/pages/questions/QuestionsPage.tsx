import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useQuestionStore } from "@/lib/store/useQuestionStore";
import { Question } from "@/models/Question";
import { QuestionFilters } from "@/components/forms/question-filters/QuestionFilters";
import { QuestionTable } from "@/components/questions/QuestionTable";
import { QuestionPagination } from "@/components/questions/QuestionPagination";
import {
  Plus,
  Search,
  X as XIcon,
} from "lucide-react";
import { toast } from "sonner";

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
    searchQuery,
    errors,
    clearErrors,
  } = useQuestionStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    getQuestions();
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

  const handleFormSubmit = async (data: Partial<Question>) => {
    if (isEditing && selectedQuestion) {
      await updateQuestion(selectedQuestion._id, data);
      toast.success("Pregunta actualizada correctamente");
    } else {
      await createQuestion(data as any);
      toast.success("Pregunta creada correctamente");
    }
    setDialogOpen(false);
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

  const handleDeleteConfirm = () => {
    if (selectedQuestion?._id) {
      deleteQuestion(selectedQuestion._id);
      setDeleteDialogOpen(false);
      setSelectedQuestion(null);
      toast.success("Pregunta eliminada correctamente");
    }
  };

  const viewQuestionDetails = (question: Question) => {
    setSelectedQuestion(question);
    // TODO: Implementar modal de detalles
    toast.info("Funcionalidad de detalles próximamente");
  };

  // Usar useCallback para evitar re-renders innecesarios
  const handleFiltersChange = useCallback((filters: any) => {
    setFilters(filters);
    // Llamar getQuestions después de actualizar los filtros
    setTimeout(() => {
      getQuestions(1, 10, filters);
    }, 0);
  }, [setFilters, getQuestions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <p className="text-muted-foreground">
          Manage and create questions for language learning exercises and assessments.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar preguntas por tema..."
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
        <Button onClick={() => openDialog()} className="sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Pregunta
        </Button>
      </div>

      {/* Filters */}
      <QuestionFilters onFiltersChange={handleFiltersChange} />

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Preguntas ({total})</CardTitle>
        </CardHeader>
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Pregunta" : "Nueva Pregunta"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifica los detalles de la pregunta."
                : "Crea una nueva pregunta para ejercicios de aprendizaje."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Formulario de pregunta próximamente...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la pregunta
              "{selectedQuestion?.text}" y todos sus datos asociados.
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
  );
} 