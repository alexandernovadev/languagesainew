import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Word } from "@/models/Word";
import { wordLevels } from "@/data/wordLevels";
import { EditableList } from "./EditableList";
import { Book, Sparkles, ListPlus, Stars, Image } from "lucide-react";
import { ImageUploaderCard } from "@/components/ui/ImageUploaderCard";
import { capitalize } from "@/utils/common/string/capitalize";
import { getAllLanguages } from "@/utils/common/language";
import { WORD_TYPES } from "@/utils/constants/wordTypes";
import { useResultHandler } from "@/hooks/useResultHandler";

interface WordFormProps {
  initialData?: Partial<Word>;
  onSubmit: (data: Partial<Word>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function WordForm({
  initialData = {},
  onSubmit,
  loading = false,
}: WordFormProps) {
  // Hook para manejo de errores
  // TODO esto no se usa
  const { handleApiResult } = useResultHandler();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Partial<Word>>({
    defaultValues: {
      word: "",
      IPA: "",
      definition: "",
      examples: [],
      sinonyms: [],
      codeSwitching: [],
      level: "easy",
      language: "en",
      spanish: { word: "", definition: "" },
      img: "",
      type: [],
      lastReviewed: undefined,
      nextReview: undefined,
      reviewCount: 0,
      difficulty: 3,
      interval: 1,
      easeFactor: 2.5,
      ...initialData,
    },
  });

  const formData = watch();

  useEffect(() => {
    // Ensure arrays are not undefined when resetting form
    const dataWithArrays = {
      ...initialData,
      examples: initialData.examples || [],
      sinonyms: initialData.sinonyms || [],
      codeSwitching: initialData.codeSwitching || [],
      img: initialData.img || "",
    };
    reset(dataWithArrays);
  }, [initialData, reset]);

  const isFormValid = formData.word && formData.spanish?.word && formData.spanish?.definition;

  const onSubmitForm = (data: Partial<Word>) => {
    if (isFormValid) {
      onSubmit(data);
    }
  };

  const handleChange = (field: keyof Word, value: any) => {
    setValue(field, value);
  };

  const handleSpanishChange = (field: "word" | "definition", value: string) => {
    setValue(`spanish.${field}`, value);
  };

  const handleImageChange = (imageUrl: string) => {
    setValue("img", imageUrl);
  };

  return (
    <form
      id="word-form"
      onSubmit={handleSubmit(onSubmitForm)}
      className="flex flex-col flex-grow min-h-0"
    >
      <div className="flex-grow overflow-y-auto px-1 min-h-0">
        <Tabs defaultValue="basic" className="space-y-4">
          <div className="px-4 pt-4">
            {/* Contenedor con scroll horizontal en móvil */}
            <div className="max-sm:overflow-x-auto max-sm:pb-2">
              <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 max-sm:flex max-sm:w-max max-sm:min-w-full">
                <TabsTrigger value="basic" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Book className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Información Básica</span>
                  <span className="sm:hidden">Básica</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Image className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Imagen</span>
                  <span className="sm:hidden">Imagen</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Campos Avanzados</span>
                  <span className="sm:hidden">Avanzados</span>
                </TabsTrigger>
                <TabsTrigger value="anki" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Stars className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Sistema Anki</span>
                  <span className="sm:hidden">Anki</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="basic" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalles Principales</CardTitle>
                <CardDescription>
                  Información esencial de la palabra en inglés y español.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="word">Palabra (Inglés)</Label>
                    <Input
                      id="word"
                      {...register("word", { required: true })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spanish-word">Traducción (Español)</Label>
                    <Input
                      id="spanish-word"
                      value={formData.spanish?.word || ""}
                      onChange={(e) =>
                        handleSpanishChange("word", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipos de Palabra</Label>
                    <Card>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {WORD_TYPES.map((type) => (
                            <div key={type.key} className="flex items-start space-x-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors">
                              <Checkbox
                                id={`type-${type.key}`}
                                checked={formData.type?.includes(type.key) || false}
                                onCheckedChange={(checked) => {
                                  const currentTypes = formData.type || [];
                                  if (checked) {
                                    handleChange("type", [...currentTypes, type.key]);
                                  } else {
                                    handleChange("type", currentTypes.filter(t => t !== type.key));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`type-${type.key}`}
                                className="flex flex-col cursor-pointer flex-1 min-w-0"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">{type.icon}</span>
                                  <span className="font-medium text-sm">{type.label}</span>
                                </div>
                                <span className="text-xs text-muted-foreground ml-5">
                                  {type.key}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground">
                      Selecciona uno o más tipos gramaticales para esta palabra
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleChange("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un idioma">
                            {formData.language && (() => {
                              const lang = getAllLanguages().find(l => l.code === formData.language);
                              return lang ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{lang.flag}</span>
                                  <span>{lang.name}</span>
                                </div>
                              ) : formData.language;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getAllLanguages().map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seen">Contador de Vistas</Label>
                      <Input
                        id="seen"
                        type="number"
                        min="0"
                        {...register("seen", { valueAsNumber: true })}
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Número de veces que se ha visto esta palabra
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="definition">Definición (Inglés)</Label>
                  <Textarea
                    id="definition"
                    {...register("definition")}
                    placeholder="Escribe una definición detallada aquí..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spanish-definition">Definición (Español)</Label>
                  <Textarea
                    id="spanish-definition"
                    value={formData.spanish?.definition || ""}
                    onChange={(e) =>
                      handleSpanishChange("definition", e.target.value)
                    }
                    placeholder="Escribe una definición detallada en español..."
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Clasificación</CardTitle>
                <CardDescription>
                  Ayuda a organizar y filtrar tu vocabulario.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipa">IPA (Opcional)</Label>
                  <Input id="ipa" {...register("IPA")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel de Dificultad</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleChange("level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {wordLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {capitalize(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" /> Sinónimos
                </CardTitle>
                <CardDescription>
                  Palabras con significado similar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={formData.sinonyms || []}
                  onChange={(items) => handleChange("sinonyms", items)}
                  placeholder="Añadir sinónimo..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" /> Ejemplos de Uso
                </CardTitle>
                <CardDescription>
                  Palabras que se utilizan para ilustrar el uso de la palabra.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={formData.examples || []}
                  onChange={(items) => handleChange("examples", items)}
                  placeholder="Añadir ejemplo..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" /> Code Switching
                </CardTitle>
                <CardDescription>
                  Expresiones que combinan idiomas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={formData.codeSwitching || []}
                  onChange={(items) => handleChange("codeSwitching", items)}
                  placeholder="Añadir expresión..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" /> Imagen
                </CardTitle>
                <CardDescription>
                  Arrastra una imagen, genera una con AI, o ingresa una URL manualmente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploaderCard
                  title=""
                  description=""
                  imageUrl={formData.img || ""}
                  onImageChange={handleImageChange}
                  word={formData.word}
                  entityId={initialData._id}
                  entityType="word"
                  disabled={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anki" className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stars className="h-5 w-5" /> Sistema de Repaso Inteligente
                </CardTitle>
                <CardDescription>
                  Configuración para el sistema de repaso tipo Anki.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Nivel de Dificultad (1-5)</Label>
                  <Select
                    value={formData.difficulty?.toString() || "3"}
                    onValueChange={(value) => handleChange("difficulty", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Muy Fácil</SelectItem>
                      <SelectItem value="2">2 - Fácil</SelectItem>
                      <SelectItem value="3">3 - Medio</SelectItem>
                      <SelectItem value="4">4 - Difícil</SelectItem>
                      <SelectItem value="5">5 - Muy Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interval">Intervalo de Repaso (días)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="365"
                    {...register("interval", { valueAsNumber: true })}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="easeFactor">Factor de Facilidad</Label>
                  <Input
                    id="easeFactor"
                    type="number"
                    min="1.3"
                    max="5.0"
                    step="0.1"
                    {...register("easeFactor", { valueAsNumber: true })}
                    placeholder="2.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Factor que determina qué tan fácil es recordar la palabra (1.3 - 5.0)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Contador de Repasos</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    min="0"
                    {...register("reviewCount", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastReviewed">Último Repaso</Label>
                  <Input
                    id="lastReviewed"
                    type="date"
                    {...register("lastReviewed")}
                    value={formData.lastReviewed ? new Date(formData.lastReviewed).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                      handleChange("lastReviewed", date);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextReview">Próximo Repaso</Label>
                  <Input
                    id="nextReview"
                    type="date"
                    {...register("nextReview")}
                    value={formData.nextReview ? new Date(formData.nextReview).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                      handleChange("nextReview", date);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}
