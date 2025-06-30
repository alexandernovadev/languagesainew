import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  Users,
  Bot,
  PenTool,
  Calendar,
  Hash,
  FileText,
  Settings,
  Brain,
  Save,
  Loader2,
  X,
  Plus,
  Trash2,
  CheckCircle,
  Tag,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { examService, Exam } from "@/services/examService";
import { ExamHeader } from "./ExamHeader";
import {
  getLevelLabel,
  getLanguageLabel,
  getLevelColor,
  getSourceVariant,
  formatDate,
  getQuestionText,
  getQuestionType,
  getQuestionTypeLabel,
  getQuestionOptions,
  getQuestionCorrectAnswers,
  getQuestionTags,
  getQuestionExplanation,
} from "./helpers/examUtils";

interface ExamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onExamUpdated: () => void;
}

export function ExamEditModal({ isOpen, onClose, exam, onExamUpdated }: ExamEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "" as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "",
    language: "",
    topic: "",
    source: "" as "manual" | "ai" | "",
    adaptive: false,
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || "",
        description: exam.description || "",
        level: exam.level || "",
        language: exam.language || "",
        topic: exam.topic || "",
        source: exam.source || "",
        adaptive: exam.adaptive || false,
      });
      setQuestions(exam.questions || []);
    }
  }, [exam]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleQuestionTextChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    if (typeof updatedQuestions[index] === 'string') {
      updatedQuestions[index] = value;
    } else if (updatedQuestions[index] && typeof updatedQuestions[index] === 'object') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        question: value,
      };
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    const newOption = {
      value: `option_${updatedQuestions[questionIndex].options.length + 1}`,
      label: "",
      isCorrect: false,
    };
    updatedQuestions[questionIndex].options.push(newOption);
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswers: [value],
    };
    setQuestions(updatedQuestions);
  };

  const addTag = (questionIndex: number) => {
    if (!newTag.trim()) return;
    
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].tags) {
      updatedQuestions[questionIndex].tags = [];
    }
    
    if (!updatedQuestions[questionIndex].tags.includes(newTag.trim())) {
      updatedQuestions[questionIndex].tags.push(newTag.trim());
    }
    
    setQuestions(updatedQuestions);
    setNewTag("");
  };

  const removeTag = (questionIndex: number, tagIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].tags.splice(tagIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      weight: 1,
      order: questions.length + 1,
      options: [],
      correctAnswers: [],
      tags: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exam) return;

    // Validation
    if (!formData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.level) {
      toast.error("El nivel es obligatorio");
      return;
    }

    if (!formData.language) {
      toast.error("El idioma es obligatorio");
      return;
    }

    if (questions.length === 0) {
      toast.error("El examen debe tener al menos una pregunta");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const questionText = getQuestionText(questions[i]);
      if (!questionText.trim()) {
        toast.error(`La pregunta ${i + 1} no puede estar vacía`);
        return;
      }
    }

    try {
      setLoading(true);

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        level: formData.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
        language: formData.language,
        topic: formData.topic,
        source: formData.source as "manual" | "ai" | undefined,
        adaptive: formData.adaptive,
        questions: questions,
      };

      const response = await examService.updateExam(exam._id, updateData);

      if (response && response.success) {
        toast.success("Examen actualizado exitosamente", {
          description: `"${formData.title}" ha sido actualizado`,
        });
        
        onExamUpdated();
        onClose();
      } else {
        throw new Error(response?.message || "Error al actualizar el examen");
      }
    } catch (error: any) {
      console.error('Error updating exam:', error);
      toast.error("Error al actualizar examen", {
        description: error.message || "No se pudo actualizar el examen",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Editar Examen
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">

            {/* Compact Dates Section */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Creado: {formatDate(exam.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Actualizado: {formatDate(exam.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {exam._id.slice(-8)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Editar Información del Examen
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Título */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                      Título del Examen *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Ingresa el título del examen"
                      disabled={loading}
                      className="text-sm"
                    />
        </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                      Descripción
                    </Label>
                <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Ingresa una descripción del examen"
                      rows={3}
                      disabled={loading}
                      className="text-sm"
                />
              </div>

                  {/* Nivel y Idioma */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-medium text-muted-foreground">
                        Nivel *
                      </Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => handleInputChange("level", value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1 - Principiante</SelectItem>
                          <SelectItem value="A2">A2 - Básico</SelectItem>
                          <SelectItem value="B1">B1 - Intermedio</SelectItem>
                          <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                          <SelectItem value="C1">C1 - Avanzado</SelectItem>
                          <SelectItem value="C2">C2 - Maestría</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium text-muted-foreground">
                        Idioma *
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleInputChange("language", value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecciona el idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">Inglés</SelectItem>
                          <SelectItem value="spanish">Español</SelectItem>
                          <SelectItem value="french">Francés</SelectItem>
                          <SelectItem value="german">Alemán</SelectItem>
                          <SelectItem value="italian">Italiano</SelectItem>
                          <SelectItem value="portuguese">Portugués</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tema y Fuente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-sm font-medium text-muted-foreground">
                        Tema
                          </Label>
                      <Input
                        id="topic"
                        value={formData.topic}
                        onChange={(e) => handleInputChange("topic", e.target.value)}
                        placeholder="Ej: Gramática, Vocabulario, etc."
                        disabled={loading}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source" className="text-sm font-medium text-muted-foreground">
                        Fuente
                      </Label>
                      <Select
                        value={formData.source}
                        onValueChange={(value) => handleInputChange("source", value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecciona la fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="ai">IA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Adaptativo */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={formData.adaptive}
                        onChange={(e) => handleInputChange("adaptive", e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300"
                      />
                      Examen Adaptativo
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Los exámenes adaptativos ajustan la dificultad según el rendimiento del estudiante.
                    </p>
                  </div>

                  <Separator />

                  {/* Información del examen (read-only) */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Información del Examen
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Preguntas
                        </p>
                        <p className="text-sm font-medium">
                          {questions.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Versión
                        </p>
                        <p className="text-sm font-medium">
                          {exam.version || 1}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Preguntas del Examen ({questions.length})
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuestion}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Pregunta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay preguntas en este examen</p>
                      <p className="text-sm">Haz clic en "Agregar Pregunta" para comenzar</p>
              </div>
                  ) : (
                    questions.map((question, index) => {
                      const questionText = getQuestionText(question);
                      const questionType = getQuestionType(question);
                      const questionOptions = getQuestionOptions(question);
                      const correctAnswers = getQuestionCorrectAnswers(question);
                      const questionTags = getQuestionTags(question);
                      const explanation = getQuestionExplanation(question);

                      return (
                        <div
                          key={index}
                          className="border rounded-lg p-6 bg-muted/20"
                        >
                          {/* Question Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {getQuestionTypeLabel(questionType)}
                              </Badge>
              </div>
                            <div className="flex items-center gap-2">
                        <Button
                                type="button"
                          variant="ghost"
                          size="sm"
                                onClick={() => removeQuestion(index)}
                                disabled={loading}
                                className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                                <Trash2 className="w-4 h-4" />
                        </Button>
                            </div>
                          </div>

                          {/* Question Text */}
                          <div className="mb-4">
                            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Texto de la Pregunta *
                            </Label>
                            <Textarea
                              value={questionText}
                              onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                              placeholder="Ingresa el texto de la pregunta"
                              disabled={loading}
                              className="text-sm"
                              rows={3}
                            />
                          </div>

                          {/* Question Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                Peso
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={question.weight || 1}
                                onChange={(e) => handleQuestionChange(index, "weight", parseInt(e.target.value) || 1)}
                                disabled={loading}
                                className="text-sm"
                              />
                  </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                Orden
                              </Label>
                    <Input
                                type="number"
                                min="1"
                                value={question.order || index + 1}
                                onChange={(e) => handleQuestionChange(index, "order", parseInt(e.target.value) || index + 1)}
                                disabled={loading}
                                className="text-sm"
                              />
                            </div>
                          </div>

                          {/* Options */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Opciones:
                              </h4>
                    <Button
                                type="button"
                      variant="outline"
                      size="sm"
                                onClick={() => addOption(index)}
                                disabled={loading}
                                className="flex items-center gap-1 text-xs"
                    >
                                <Plus className="w-3 h-3" />
                      Agregar
                    </Button>
                  </div>
                            <div className="space-y-2">
                              {questionOptions.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No hay opciones definidas</p>
                              ) : (
                                questionOptions.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`flex items-center gap-2 p-2 rounded border ${
                                      option.isCorrect
                                        ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                        : "bg-muted/30 border-border"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`correct-${index}`}
                            value={option.value}
                                      checked={correctAnswers.includes(option.value)}
                                      onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                      disabled={loading}
                                      className="text-green-600"
                                    />
                                    <span className="text-xs font-medium text-muted-foreground min-w-[20px]">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>
                      <Input
                                      value={option.label || option.value}
                                      onChange={(e) => handleOptionChange(index, optionIndex, "label", e.target.value)}
                                      placeholder={`Opción ${optionIndex + 1}`}
                                      disabled={loading}
                                      className="text-sm flex-1"
                      />
                      <Button
                                      type="button"
                        variant="ghost"
                        size="sm"
                                      onClick={() => removeOption(index, optionIndex)}
                                      disabled={loading}
                                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                                      <X className="w-3 h-3" />
                      </Button>
                    </div>
                                ))
                              )}
                </div>
                          </div>

                          {/* Correct Answers (for non-option questions) */}
                          {correctAnswers.length > 0 && questionOptions.length === 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                Respuestas correctas:
                              </h4>
                              <div className="space-y-1">
                                {correctAnswers.map((answer, answerIndex) => (
                                  <div
                                    key={answerIndex}
                                    className="flex items-center gap-2 p-2 rounded bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">{answer}</span>
                                  </div>
                                ))}
              </div>
            </div>
          )}

                          {/* Explanation */}
                          {explanation && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded dark:bg-blue-950/20 dark:border-blue-800">
                              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                Explicación:
                              </h4>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {explanation}
                              </p>
            </div>
          )}

                          {/* Tags */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                Etiquetas:
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {questionTags.map((tag, tagIndex) => (
                                <Badge
                                  key={tagIndex}
                                  variant="outline"
                                  className="text-xs flex items-center gap-1"
                                >
                        {tag}
                        <Button
                                    type="button"
                          variant="ghost"
                          size="sm"
                                    onClick={() => removeTag(index, tagIndex)}
                                    disabled={loading}
                                    className="h-3 w-3 p-0 text-red-500 hover:text-red-700"
                        >
                                    <X className="w-2 h-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nueva etiqueta"
                                disabled={loading}
                                className="text-sm flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                                    addTag(index);
                        }
                      }}
                    />
                    <Button
                                type="button"
                      variant="outline"
                      size="sm"
                                onClick={() => addTag(index)}
                                disabled={loading || !newTag.trim()}
                                className="text-xs"
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
                      );
                    })
          )}
        </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 z-10 bg-background pt-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
            Guardar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
