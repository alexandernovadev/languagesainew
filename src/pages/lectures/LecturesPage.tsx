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
    getLectures(1, 10);
  }, []);

  const handlePageChange = (page: number) => {
    getLectures(page, 10);
  };

  const handleAddLecture = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    await postLecture(data as Lecture);
    closeAddModal();
  };

  const handleEditLecture = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    if (selectedLectureId) {
      await putLecture(selectedLectureId, data as Lecture);
      closeEditModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedLectureId) {
      await deleteLecture(selectedLectureId);
      closeDeleteDialog();
    }
  };

  const viewLecture = (lectureId: string) => {
    navigate(`/lectures/${lectureId}`);
  };

  const getSelectedLecture = () => {
    return lectures.find((lecture) => lecture._id === selectedLectureId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lectures</h1>
          <p className="text-muted-foreground">
            Gestiona y lee tus materiales de estudio
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Página {currentPage} de {totalPages} • {lectures.length} lectures
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
                  Crea una nueva lectura para tu biblioteca. Completa todos los
                  campos para una mejor experiencia.
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
        </div>
      </div>

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
                onClick={() => getLectures(1, 10)}
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
  );
}
