import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X, GripVertical } from "lucide-react";
import {
  questionLevels,
  questionTypes,
  questionDifficulties,
} from "@/data/questionTypes";
import { Question, QuestionInput } from "@/models/Question";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Schema de validación
const questionSchema = z.object({
  text: z.string().min(1, "La pregunta es requerida"),
  type: z.enum([
    "multiple_choice",
    "fill_blank",
    "translate",
    "true_false",
    "writing",
  ]),
  isSingleAnswer: z.boolean().default(true),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  topic: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  options: z
    .array(
      z.object({
        value: z.string().min(1, "El valor es requerido"),
        label: z.string().min(1, "La etiqueta es requerida"),
        isCorrect: z.boolean().default(false),
      })
    )
    .optional(),
  correctAnswers: z
    .array(z.string())
    .min(1, "Debe tener al menos una respuesta correcta"),
  explanation: z.string().optional(),
  tags: z.array(z.string()).optional(),
  media: z
    .object({
      audio: z.string().optional(),
      image: z.string().optional(),
      video: z.string().optional(),
    })
    .optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  initialData?: Partial<Question>;
  onSubmit: (data: QuestionInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// Componente para cada opción arrastrable
function DraggableOption({
  id,
  index,
  option,
  onChange,
  onRemove,
  onSetCorrect,
  listeners,
  attributes,
  isDragging,
}: any) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border bg-background transition-colors duration-150 cursor-grab ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      <input
        type="radio"
        name="correctOption"
        checked={option.isCorrect}
        onChange={() => onSetCorrect(index)}
        className="w-4 h-4 text-primary"
      />
      <span className="text-sm font-medium">Correcta</span>
      <Input
        placeholder={`Opción ${index + 1}`}
        value={option.label}
        onChange={(e) => onChange(index, "label", e.target.value)}
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700"
        disabled={isDragging}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function QuestionForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: QuestionFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: initialData?.text || "",
      type: initialData?.type || "multiple_choice",
      isSingleAnswer: initialData?.isSingleAnswer ?? true,
      level: initialData?.level || "A1",
      topic: initialData?.topic || "",
      difficulty: initialData?.difficulty || 1,
      options: initialData?.options || [
        { value: "1", label: "", isCorrect: false },
        { value: "2", label: "", isCorrect: false },
      ],
      correctAnswers: initialData?.correctAnswers || [],
      explanation: initialData?.explanation || "",
      tags: initialData?.tags || [],
      media: initialData?.media || { audio: "", image: "", video: "" },
    },
  });

  const watchedType = watch("type");
  const shouldShowOptions = ["multiple_choice", "true_false"].includes(
    watchedType
  );

  const handleFormSubmit = async (data: QuestionFormData) => {
    try {
      const processedData: QuestionInput = {
        ...data,
        options: shouldShowOptions ? data.options : undefined,
        correctAnswers: shouldShowOptions ? [] : data.correctAnswers,
      };
      await onSubmit(processedData);
      reset();
    } catch (error) {
      // TODO: Show error toast
    }
  };

  const addOption = () => {
    const currentOptions = watch("options") || [];
    const newValue = (currentOptions.length + 1).toString();
    setValue("options", [
      ...currentOptions,
      { value: newValue, label: "", isCorrect: false },
    ]);
  };

  const removeOption = (index: number) => {
    const currentOptions = watch("options") || [];
    if (currentOptions.length > 2) {
      setValue(
        "options",
        currentOptions.filter((_, i) => i !== index)
      );
    }
  };

  const updateOption = (
    index: number,
    field: "value" | "label" | "isCorrect",
    value: string | boolean
  ) => {
    const currentOptions = watch("options") || [];
    const updatedOptions = currentOptions.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );
    setValue("options", updatedOptions);
  };

  const setCorrectOption = (index: number) => {
    const currentOptions = watch("options") || [];
    const updatedOptions = currentOptions.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setValue("options", updatedOptions);
  };

  const addCorrectAnswer = () => {
    const currentAnswers = watch("correctAnswers") || [];
    setValue("correctAnswers", [...currentAnswers, ""]);
  };

  const removeCorrectAnswer = (index: number) => {
    const currentAnswers = watch("correctAnswers") || [];
    if (currentAnswers.length > 1) {
      setValue(
        "correctAnswers",
        currentAnswers.filter((_, i) => i !== index)
      );
    }
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    const currentAnswers = watch("correctAnswers") || [];
    const updatedAnswers = currentAnswers.map((answer, i) =>
      i === index ? value : answer
    );
    setValue("correctAnswers", updatedAnswers);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const options = watch("options") || [];

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = options.findIndex(
        (item: any) => item.value === active.id
      );
      const newIndex = options.findIndex((item: any) => item.value === over.id);
      const newOptions = arrayMove(options, oldIndex, newIndex);
      setValue("options", newOptions);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="options">Opciones</TabsTrigger>
          <TabsTrigger value="media">Multimedia</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Pregunta *</Label>
                <Textarea
                  id="text"
                  placeholder="Escribe la pregunta aquí..."
                  className="min-h-[120px]"
                  {...register("text")}
                />
                {errors.text && (
                  <p className="text-sm text-red-500">{errors.text.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel CEFR *</Label>
                  <Select
                    value={watch("level")}
                    onValueChange={(value) => setValue("level", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && (
                    <p className="text-sm text-red-500">
                      {errors.level.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Pregunta *</Label>
                  <Select
                    value={watch("type")}
                    onValueChange={(value) => setValue("type", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificultad *</Label>
                  <Select
                    value={watch("difficulty").toString()}
                    onValueChange={(value) =>
                      setValue("difficulty", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionDifficulties.map((difficulty) => (
                        <SelectItem
                          key={difficulty.value}
                          value={difficulty.value.toString()}
                        >
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-500">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Tema</Label>
                <Input
                  id="topic"
                  placeholder="Ej: Gramática, Vocabulario, Comprensión..."
                  {...register("topic")}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isSingleAnswer"
                  checked={watch("isSingleAnswer")}
                  onCheckedChange={(checked) =>
                    setValue("isSingleAnswer", checked)
                  }
                />
                <Label htmlFor="isSingleAnswer">Respuesta única</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenido Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="explanation">Explicación</Label>
                <Textarea
                  id="explanation"
                  placeholder="Explicación de la respuesta correcta..."
                  className="min-h-[100px]"
                  {...register("explanation")}
                />
                <p className="text-sm text-muted-foreground">
                  Esta explicación se mostrará al usuario después de responder
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Etiquetas</Label>
                <Input
                  id="tags"
                  placeholder="Ej: gramática, verbos, presente, separadas por comas"
                  {...register("tags")}
                />
                <p className="text-sm text-muted-foreground">
                  Separa las etiquetas con comas para facilitar la búsqueda
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opciones de Respuesta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shouldShowOptions ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Configura las opciones de respuesta para preguntas de
                      opción múltiple
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar opción
                    </Button>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={options.map((o: any) => o.value)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {options.map((option: any, index: number) => {
                          const {
                            attributes,
                            listeners,
                            setNodeRef,
                            transform,
                            transition,
                            isDragging,
                          } = useSortable({ id: option.value });
                          const style = {
                            transform: CSS.Transform.toString(transform),
                            transition,
                          };
                          return (
                            <div
                              ref={setNodeRef}
                              style={style}
                              key={option.value}
                            >
                              <DraggableOption
                                id={option.value}
                                index={index}
                                option={option}
                                onChange={updateOption}
                                onRemove={removeOption}
                                onSetCorrect={setCorrectOption}
                                listeners={listeners}
                                attributes={attributes}
                                isDragging={isDragging}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Configura las respuestas correctas para preguntas de texto
                      libre
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCorrectAnswer}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar respuesta
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(watch("correctAnswers") || []).map((answer, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Input
                          placeholder={`Respuesta correcta ${index + 1}`}
                          value={answer}
                          onChange={(e) =>
                            updateCorrectAnswer(index, e.target.value)
                          }
                          className="flex-1"
                        />
                        {(watch("correctAnswers") || []).length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCorrectAnswer(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multimedia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de imagen</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    {...register("media.image")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL de video</Label>
                  <Input
                    id="videoUrl"
                    placeholder="https://ejemplo.com/video.mp4"
                    {...register("media.video")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audioUrl">URL de audio</Label>
                  <Input
                    id="audioUrl"
                    placeholder="https://ejemplo.com/audio.mp3"
                    {...register("media.audio")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="min-w-[120px]"
        >
          {loading || isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Pregunta"
          )}
        </Button>
      </div>
    </form>
  );
}
