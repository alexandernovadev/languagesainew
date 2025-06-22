import { useState } from "react";
import type { Lecture } from "@/models/Lecture";

export function useLectureModals() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (lecture: Lecture) => {
    setSelectedLectureId(lecture._id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLectureId(null);
  };

  const openDeleteDialog = (lectureId: string) => {
    setSelectedLectureId(lectureId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedLectureId(null);
  };

  return {
    // Estados
    isAddModalOpen,
    isEditModalOpen,
    deleteDialogOpen,
    selectedLectureId,
    
    // Acciones
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
  };
} 