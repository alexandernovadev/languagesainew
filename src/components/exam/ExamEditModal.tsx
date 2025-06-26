import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Save, Trash2 } from "lucide-react";
import { useExamStore } from "@/lib/store/useExamStore";
import { ExamQuestion } from "@/services/examService";
import { Badge } from "@/components/ui/badge";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { quillModules } from "../quillModules";

interface ExamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamEditModal({ isOpen, onClose }: ExamEditModalProps) {
  const {
    exam,
    editingQuestionIndex,
    editingField,
    updateExamTitle,
    updateQuestion,
    updateExplanation,
    updateTags,
    stopEditing,
  } = useExamStore();

  const [editedQuestion, setEditedQuestion] = useState<ExamQuestion | null>(
    null
  );
  const [editedTitle, setEditedTitle] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (exam && editingQuestionIndex !== null) {
      setEditedQuestion(exam.questions[editingQuestionIndex]);
    }
    if (exam && editingField === "title") {
      setEditedTitle(exam.title);
    }
  }, [exam, editingQuestionIndex, editingField]);

  // Helper para obtener la siguiente letra disponible
  const getNextOptionLetter = (options: { value: string }[]) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[options.length] || `option_${options.length + 1}`;
  };

  const handleSave = () => {
    // Validar que no haya opciones con label vacío
    if (
      editedQuestion &&
      editedQuestion.options &&
      editedQuestion.options.some((opt) => !opt.label.trim())
    ) {
      alert("Todas las respuestas deben tener texto.");
      return;
    }
    if (editingField === "title" && exam) {
      updateExamTitle(editedTitle);
    } else if (editedQuestion && editingQuestionIndex !== null) {
      if (editingField === "question") {
        updateQuestion(editingQuestionIndex, editedQuestion);
      } else if (editingField === "answers") {
        updateQuestion(editingQuestionIndex, editedQuestion);
      } else if (editingField === "explanation") {
        updateExplanation(editingQuestionIndex, editedQuestion.explanation);
      } else if (editingField === "tags") {
        updateTags(editingQuestionIndex, editedQuestion.tags);
      }
    }

    stopEditing();
    onClose();
  };

  const handleQuestionTextChange = (text: string) => {
    if (editedQuestion) {
      setEditedQuestion({ ...editedQuestion, text });
    }
  };

  const handleAnswerChange = (index: number, text: string) => {
    if (editedQuestion && editedQuestion.options) {
      const updatedOptions = [...editedQuestion.options];
      updatedOptions[index] = { ...updatedOptions[index], label: text };
      setEditedQuestion({ ...editedQuestion, options: updatedOptions });
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    if (editedQuestion) {
      setEditedQuestion({ ...editedQuestion, correctAnswers: [value] });
    }
  };

  const removeAnswer = (index: number) => {
    if (editedQuestion && editedQuestion.options) {
      const updatedOptions = editedQuestion.options.filter(
        (_, i) => i !== index
      );
      setEditedQuestion({ ...editedQuestion, options: updatedOptions });
    }
  };

  const addAnswer = () => {
    if (editedQuestion && editedQuestion.options) {
      const newOption = {
        value: getNextOptionLetter(editedQuestion.options),
        label: "",
        isCorrect: false,
      };
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, newOption],
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && editedQuestion && !editedQuestion.tags.includes(newTag.trim())) {
      setEditedQuestion({ 
        ...editedQuestion, 
        tags: [...editedQuestion.tags, newTag.trim()] 
      });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    if (editedQuestion) {
      setEditedQuestion({ 
        ...editedQuestion, 
        tags: editedQuestion.tags.filter((_, i) => i !== index) 
      });
    }
  };

  const getModalTitle = () => {
    if (editingField === "title") return "Editar Título del Examen";
    if (editingQuestionIndex !== null) {
      switch (editingField) {
        case "question":
          return `Editar Pregunta ${editingQuestionIndex + 1}`;
        case "answers":
          return `Editar Respuestas - Pregunta ${editingQuestionIndex + 1}`;
        case "explanation":
          return `Editar Explicación - Pregunta ${editingQuestionIndex + 1}`;
        case "tags":
          return `Editar Etiquetas - Pregunta ${editingQuestionIndex + 1}`;
        default:
          return `Editar Pregunta ${editingQuestionIndex + 1}`;
      }
    }
    return "Editar";
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
      <DialogContent className="max-w-2xl w-full h-[95vh] max-h-[95vh] flex flex-col">
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 border-b flex items-center justify-between w-[calc(100%-24px)]">
          <DialogTitle className="text-lg font-semibold flex items-center">
            {getModalTitle()}
          </DialogTitle>
        </div>

        {/* Contenido scrollable y flexible */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          {/* Edit All (when editingField is 'question') */}
          {editingField === "question" && editedQuestion && (
            <div className="space-y-6">
              {/* Título */}
              <div>
                <Label htmlFor="question-title">Título de la Pregunta</Label>
                <Textarea
                  id="question-title"
                  value={editedQuestion.text}
                  onChange={(e) => handleQuestionTextChange(e.target.value)}
                  placeholder="Ingresa el título de la pregunta"
                />
              </div>

              {/* Opciones/Respuestas */}
              <div>
                <Label>Respuestas</Label>
                <div className="space-y-3">
                  {editedQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <RadioGroup
                        value={editedQuestion.correctAnswers[0]}
                        onValueChange={handleCorrectAnswerChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="sr-only"
                          >
                            Opción {index + 1}
                          </Label>
                        </div>
                      </RadioGroup>
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnswer(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    className="w-full"
                  >
                    Agregar Respuesta
                  </Button>
                </div>
              </div>

              {/* Explicación */}
              <div>
                <Label htmlFor="explanation-text">Explicación</Label>
                <ReactQuill
                  value={editedQuestion?.explanation || ''}
                  onChange={(value) => editedQuestion && setEditedQuestion({ ...editedQuestion, explanation: value })}
                  theme="snow"
                  modules={quillModules}
                  style={{ background: 'white' }}
                />
              </div>

              {/* Etiquetas */}
              <div>
                <Label>Etiquetas</Label>
                <div className="space-y-3">
                  {/* Existing tags */}
                  <div className="flex flex-wrap gap-2">
                    {editedQuestion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(index)}
                          className="ml-1 h-4 w-4 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  {/* Add new tag */}
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nueva etiqueta"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Answers */}
          {editingField === "answers" && editedQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Respuestas</Label>
                <div className="space-y-3">
                  {editedQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <RadioGroup
                        value={editedQuestion.correctAnswers[0]}
                        onValueChange={handleCorrectAnswerChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="sr-only"
                          >
                            Opción {index + 1}
                          </Label>
                        </div>
                      </RadioGroup>
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnswer(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    className="w-full"
                  >
                    Agregar Respuesta
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Explanation */}
          {editingField === "explanation" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="explanation-text">Explicación</Label>
                <ReactQuill
                  value={editedQuestion?.explanation || ''}
                  onChange={(value) => editedQuestion && setEditedQuestion({ ...editedQuestion, explanation: value })}
                  theme="snow"
                  modules={quillModules}
                  style={{ background: 'white' }}
                />
              </div>
            </div>
          )}

          {/* Edit Tags */}
          {editingField === "tags" && (
            <div className="space-y-4">
              <div>
                <Label>Etiquetas</Label>
                <div className="space-y-3">
                  {/* Existing tags */}
                  <div className="flex flex-wrap gap-2">
                    {editedQuestion?.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(index)}
                          className="ml-1 h-4 w-4 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  {/* Add new tag */}
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nueva etiqueta"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer fijo */}
        <div className="z-10 bg-background px-6 border-t flex justify-end gap-3">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
