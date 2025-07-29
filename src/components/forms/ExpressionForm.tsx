import { useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Loader2, Wand2 } from "lucide-react";
import { Expression } from "@/models/Expression";
import { expressionTypes, expressionLevels, expressionLanguages } from "@/utils/constants/expressionTypes";
import { toast } from "sonner";

interface ExpressionFormProps {
  initialData?: Partial<Expression>;
  onSubmit: (data: Partial<Expression>) => Promise<void>;
}

export interface ExpressionFormRef {
  submit: () => void;
}

export const ExpressionForm = forwardRef<ExpressionFormRef, ExpressionFormProps>(({
  initialData = {},
  onSubmit,
}, ref) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<Expression>>({
    defaultValues: initialData,
    mode: "onChange",
  });

  const formData = watch();

  const handleSpanishChange = (field: "expression" | "definition", value: string) => {
    const spanish = { 
      definition: formData.spanish?.definition || "",
      expression: formData.spanish?.expression || "",
      [field]: value 
    };
    setValue("spanish", spanish);
  };

  const handleGenerateImage = async () => {
    if (!formData.expression) {
      toast.error("Necesitas una expresión para generar una imagen");
      return;
    }

    setIsGeneratingImage(true);
    setImageProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImageProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Call AI image generation service
      // const response = await expressionService.generateImage(formData.expression);
      
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setImageProgress(100);

      // Mock image URL
      const mockImageUrl = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(formData.expression)}`;
      
      setValue("img", mockImageUrl);
      toast.success("Imagen generada exitosamente");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Error al generar la imagen");
    } finally {
      setIsGeneratingImage(false);
      setImageProgress(0);
    }
  };

  const handleAddExample = () => {
    const examples = [...(formData.examples || []), ""];
    setValue("examples", examples);
  };

  const handleRemoveExample = (index: number) => {
    const examples = formData.examples?.filter((_, i) => i !== index) || [];
    setValue("examples", examples);
  };

  const handleExampleChange = (index: number, value: string) => {
    const examples = [...(formData.examples || [])];
    examples[index] = value;
    setValue("examples", examples);
  };

  const handleAddType = (type: string) => {
    const types = [...(formData.type || []), type];
    setValue("type", types);
  };

  const handleRemoveType = (typeToRemove: string) => {
    const types = formData.type?.filter(type => type !== typeToRemove) || [];
    setValue("type", types);
  };

  const onSubmitForm = async (data: Partial<Expression>) => {
    await onSubmit(data);
  };

  // Expose submit method to parent
  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(onSubmitForm)();
    },
  }));

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="w-full">
          <div className="w-full">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                <TabsTrigger value="image">Imagen</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                    <CardDescription>
                      Información principal de la expresión
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expression">Expresión *</Label>
                        <Input
                          id="expression"
                          {...register("expression", { required: "La expresión es obligatoria" })}
                          placeholder="Break a leg"
                        />
                        {errors.expression && (
                          <p className="text-sm text-red-500">{errors.expression.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Idioma *</Label>
                        <Select
                          value={formData.language || ""}
                          onValueChange={(value) => setValue("language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            {expressionLanguages.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.language && (
                          <p className="text-sm text-red-500">{errors.language.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="definition">Definición *</Label>
                      <Textarea
                        id="definition"
                        {...register("definition", { required: "La definición es obligatoria" })}
                        placeholder="Good luck"
                        rows={3}
                      />
                      {errors.definition && (
                        <p className="text-sm text-red-500">{errors.definition.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="context">Contexto</Label>
                      <Input
                        id="context"
                        {...register("context")}
                        placeholder="Informal, encouraging"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Nivel de Dificultad</Label>
                      <div className="flex gap-2">
                        {expressionLevels.map(level => (
                          <Button
                            key={level.value}
                            type="button"
                            variant={formData.difficulty === level.value ? "default" : "outline"}
                            onClick={() => setValue("difficulty", level.value as "easy" | "medium" | "hard")}
                            className="flex-1"
                          >
                            {level.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Avanzada</CardTitle>
                    <CardDescription>
                      Tipos, ejemplos y traducción al español
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipos de Expresión</Label>
                      <div className="flex flex-wrap gap-2">
                        {expressionTypes.map(type => (
                          <Button
                            key={type.value}
                            type="button"
                            variant={formData.type?.includes(type.value) ? "default" : "outline"}
                            onClick={() => 
                              formData.type?.includes(type.value)
                                ? handleRemoveType(type.value)
                                : handleAddType(type.value)
                            }
                            size="sm"
                          >
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ejemplos</Label>
                      <div className="space-y-2">
                        {formData.examples?.map((example, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={example}
                              onChange={(e) => handleExampleChange(index, e.target.value)}
                              placeholder={`Ejemplo ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveExample(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddExample}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Ejemplo
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spanishExpression">Expresión en Español</Label>
                        <Input
                          id="spanishExpression"
                          value={formData.spanish?.expression || ""}
                          onChange={(e) => handleSpanishChange("expression", e.target.value)}
                          placeholder="¡Buena suerte!"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="spanishDefinition">Definición en Español</Label>
                        <Textarea
                          id="spanishDefinition"
                          value={formData.spanish?.definition || ""}
                          onChange={(e) => handleSpanishChange("definition", e.target.value)}
                          placeholder="Expresión de deseo de éxito"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Imagen</CardTitle>
                    <CardDescription>
                      Añade una imagen representativa para la expresión (URL).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      <div className="md:col-span-1">
                        <Label>Vista Previa</Label>
                        <div className="mt-2 w-full aspect-video rounded-md border flex items-center justify-center bg-muted relative overflow-hidden">
                          {isGeneratingImage ? (
                            // Skeleton durante generación
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-muted-foreground">Generando imagen...</p>
                              {imageProgress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${imageProgress}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          ) : formData.img ? (
                            <img
                              src={formData.img}
                              alt="Preview"
                              className="w-full h-full object-contain rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = "/images/noImage.png";
                              }}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Sin Imagen
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="img">URL de la Imagen</Label>
                          <div className="flex gap-2">
                            <Input
                              id="img"
                              {...register("img")}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              disabled={isGeneratingImage}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGenerateImage}
                              disabled={isGeneratingImage || !formData.expression}
                              className="whitespace-nowrap"
                            >
                              {isGeneratingImage ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Generando...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="h-4 w-4 mr-2" />
                                  Generar con AI
                                </>
                              )}
                            </Button>
                          </div>
                          {!formData.expression && (
                            <p className="text-xs text-muted-foreground">
                              Necesitas una expresión para generar una imagen
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>


      </form>
    </div>
  );
}); 