import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useLectureStore } from "@/lib/store/useLectureStore";
import { useLectureModals } from "@/hooks/useLectureModals";
import { LectureForm } from "@/components/forms/LectureForm";
import { LectureCard } from "@/components/lectures/LectureCard";
import { LecturePagination } from "@/components/ui/LecturePagination";
import { useNavigate } from "react-router-dom";
import type { Lecture } from "@/models/Lecture";
import { Plus, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { toast } from "sonner";

export default function LecturesPage() {
  const navigate = useNavigate();
  const {
    lectures,
    loading,
    totalPages,
    currentPage,
    getLectures,
    postLecture,
    putLecture,
    deleteLecture,
    actionLoading,
  } = useLectureStore();

  const {
    isAddModalOpen,
    isEditModalOpen,
    deleteDialogOpen,
    selectedLectureId,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
  } = useLectureModals();

  // Fetch lectures on mount
  useEffect(() => {
    const loadLectures = async () => {
      try {
        await getLectures(1, 10);
      } catch (error: any) {
        toast.error(error.message || "Error al cargar las lecturas");
      }
    };
    loadLectures();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      await getLectures(page, 10);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar la página");
    }
  };

  const handleAddLecture = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await postLecture(data as Lecture);
      toast.success("Lectura creada exitosamente");
      closeAddModal();
    } catch (error: any) {
      toast.error(error.message || "Error al crear la lectura");
    }
  };

  const handleEditLecture = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    if (selectedLectureId) {
      try {
        await putLecture(selectedLectureId, data as Lecture);
        toast.success("Lectura actualizada exitosamente");
        closeEditModal();
      } catch (error: any) {
        toast.error(error.message || "Error al actualizar la lectura");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedLectureId) {
      try {
        await deleteLecture(selectedLectureId);
        toast.success("Lectura eliminada exitosamente");
        closeDeleteDialog();
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar la lectura");
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await getLectures(1, 10);
      toast.success("Lecturas actualizadas");
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar las lecturas");
    }
  };

  const viewLecture = (lectureId: string) => {
    navigate(`/lectures/${lectureId}`);
  };

  const getSelectedLecture = () => {
    return lectures.find((lecture) => lecture._id === selectedLectureId);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Lecturas"
        description="Gestiona y explora todas tus lecturas."
        actions={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Página {currentPage} de {totalPages} • {lectures.length}{" "}
                lectures
              </Badge>
              <Dialog open={isAddModalOpen} onOpenChange={closeAddModal}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openAddModal}
                  className="h-12 w-12 rounded-full"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <DialogContent className="sm:max-w-5xl h-[95vh] flex flex-col p-0">
                  <DialogHeader className="pb-4 pt-6 px-6 flex-shrink-0">
                    <DialogTitle className="text-xl">
                      Crear Nueva Lectura
                    </DialogTitle>
                    <DialogDescription>
                      Crea una nueva lectura para tu biblioteca. Completa todos
                      los campos para una mejor experiencia.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-grow overflow-y-auto px-6 pb-6">
                    <LectureForm
                      onSubmit={handleAddLecture}
                      onCancel={closeAddModal}
                      loading={actionLoading.post}
                      submitText="Crear Lectura"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="rounded-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      />
      <div className="space-y-6">
        {/* Grid de lecturas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10">Cargando...</div>
          ) : lectures.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              <div className="space-y-4">
                <p>No hay lecturas disponibles.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="rounded-full"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            lectures.map((lecture) => (
              <LectureCard
                key={lecture._id}
                lecture={lecture}
                onView={viewLecture}
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
              />
            ))
          )}
        </div>

        {/* Paginación */}
        <LecturePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Modal de edición */}
        <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
          <DialogContent className="sm:max-w-5xl h-[95vh] flex flex-col p-0">
            <DialogHeader className="pb-4 pt-6 px-6 flex-shrink-0">
              <DialogTitle className="text-xl">Editar Lectura</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la lectura. Todos los campos son
                importantes para una mejor experiencia.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto px-6 pb-6">
              <LectureForm
                initialData={getSelectedLecture()}
                onSubmit={handleEditLecture}
                onCancel={closeEditModal}
                loading={actionLoading.put}
                submitText="Guardar Cambios"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Estás seguro de eliminar esta lectura?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La lectura será eliminada
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={actionLoading.delete}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
}
