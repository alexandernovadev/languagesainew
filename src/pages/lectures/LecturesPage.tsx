import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ModalNova } from "@/components/ui/modal-nova";
import { AlertDialogNova } from "@/components/ui/alert-dialog-nova";
import { useResultHandler } from "@/hooks/useResultHandler";
import { Eye, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

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
        toast.success("Lecturas cargadas exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data: lectures, message: "Lecturas cargadas exitosamente" }, "Cargar Lecturas")
          },
          cancel: {
            label: <X className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
        });
      } catch (error: any) {
        handleApiResult(error, "Cargar Lecturas");
      }
    };
    loadLectures();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      await getLectures(page, 10);
    } catch (error: any) {
      handleApiResult(error, "Cargar Página");
    }
  };

  const handleAddLecture = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await postLecture(data as Lecture);
      toast.success("Lectura creada exitosamente", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data, message: "Lectura creada exitosamente" }, "Crear Lectura")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
      closeAddModal();
    } catch (error: any) {
      handleApiResult(error, "Crear Lectura");
    }
  };

  const handleEditLecture = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    if (selectedLectureId) {
      try {
        await putLecture(selectedLectureId, data as Lecture);
        toast.success("Lectura actualizada exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data, message: "Lectura actualizada exitosamente" }, "Actualizar Lectura")
          },
          cancel: {
            label: <X className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
        });
        closeEditModal();
      } catch (error: any) {
        handleApiResult(error, "Actualizar Lectura");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedLectureId) {
      try {
        await deleteLecture(selectedLectureId);
        toast.success("Lectura eliminada exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data: { id: selectedLectureId }, message: "Lectura eliminada exitosamente" }, "Eliminar Lectura")
          },
          cancel: {
            label: <X className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
        });
        closeDeleteDialog();
      } catch (error: any) {
        handleApiResult(error, "Eliminar Lectura");
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await getLectures(1, 10);
      toast.success("Lecturas actualizadas", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: lectures, message: "Lecturas actualizadas" }, "Actualizar Lecturas")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Lecturas");
    }
  };

  const viewLecture = (lectureId: string) => {
    navigate(`/lectures/${lectureId}`);
  };

  const getSelectedLecture = () => {
    return lectures.find((lecture) => lecture._id === selectedLectureId);
  };

  if (loading) {
    return (
      <PageLayout>
        <PageHeader
          title={<Skeleton className="w-32 h-8" />}
          description={<Skeleton className="w-64 h-4" />}
          actions={
            <div className="flex items-center gap-4">
              <Skeleton className="w-32 h-6 rounded" />
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          }
        />
        <div className="space-y-6">
          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                  <div className="flex gap-2">
                    <Skeleton className="w-16 h-6 rounded" />
                    <Skeleton className="w-20 h-6 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Skeleton Pagination */}
          <div className="flex justify-center gap-2">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-10 h-10 rounded" />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Lecturas"
        description="Gestiona y explora todas tus lecturas."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Página {currentPage} de {totalPages} • {lectures.length}{" "}
              lectures
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="h-10 w-10 p-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar lecturas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={openAddModal}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Crear nueva lectura</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      {/* Modal de creación */}
      <ModalNova
        open={isAddModalOpen}
        onOpenChange={closeAddModal}
        title="Crear Nueva Lectura"
        description="Crea una nueva lectura para tu biblioteca. Completa todos los campos para una mejor experiencia."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeAddModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="lecture-form"
              disabled={actionLoading.post}
            >
              {actionLoading.post ? "Creando..." : "Crear Lectura"}
            </Button>
          </>
        }
      >
        <LectureForm
          onSubmit={handleAddLecture}
          onCancel={closeAddModal}
          loading={actionLoading.post}
          submitText="Crear Lectura"
        />
      </ModalNova>

      <div className="space-y-6">
        {/* Grid de lecturas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lectures.length === 0 ? (
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
        <ModalNova
          open={isEditModalOpen}
          onOpenChange={closeEditModal}
          title="Editar Lectura"
          description="Modifica los detalles de la lectura. Todos los campos son importantes para una mejor experiencia."
          footer={
            <>
              <Button type="button" variant="ghost" onClick={closeEditModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                form="lecture-form"
                disabled={actionLoading.put}
              >
                {actionLoading.put ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </>
          }
        >
          <LectureForm
            initialData={getSelectedLecture()}
            onSubmit={handleEditLecture}
            onCancel={closeEditModal}
            loading={actionLoading.put}
            submitText="Guardar Cambios"
          />
        </ModalNova>

        {/* Dialog de confirmación de eliminación */}
        <AlertDialogNova
          open={deleteDialogOpen}
          onOpenChange={closeDeleteDialog}
          title="¿Estás seguro de eliminar esta lectura?"
          description="Esta acción no se puede deshacer. La lectura será eliminada permanentemente."
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteDialog}
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={actionLoading.delete}
        />
      </div>
    </PageLayout>
  );
}
