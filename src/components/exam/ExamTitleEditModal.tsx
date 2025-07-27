import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useExamStore } from "@/lib/store/useExamStore";
import { Textarea } from "../ui/textarea";

interface ExamTitleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamTitleEditModal({
  isOpen,
  onClose,
}: ExamTitleEditModalProps) {
  const { exam, editingField, updateExamTitle, stopEditing } = useExamStore();

  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    if (exam && editingField === "title") {
      setEditedTitle(exam.title);
    }
  }, [exam, editingField]);

  const handleSave = () => {
    if (exam && editedTitle.trim()) {
      updateExamTitle(editedTitle.trim());
    }
    stopEditing();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          stopEditing();
        }
      }}
    >
      <DialogContent className="max-w-md w-full border border-gray-600 shadow-2xl">
        <DialogTitle className="text-lg font-semibold">
          Editar Título del Examen
        </DialogTitle>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="exam-title">Título</Label>
            <Textarea
              id="exam-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ingresa el título del examen"
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!editedTitle.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
