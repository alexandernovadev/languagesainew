import {  forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllowedLanguages } from "@/constants/identity";
import { X, Plus, Loader2, Wand2, Eye, Book, Sparkles, Image } from "lucide-react";
import { Expression } from "@/models/Expression";
import { expressionTypes, expressionLevels } from "@/utils/constants/expressionTypes";
import { useResultHandler } from "@/hooks/useResultHandler";
import { ImageUploaderCard } from "@/components/ui/ImageUploaderCard";

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
  // Hook para manejo de errores
  // tODO esto no se usa
  const { handleApiResult } = useResultHandler();

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
              {/* Contenedor con scroll horizontal en móvil */}
              <div className="max-sm:overflow-x-auto max-sm:pb-2">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 max-sm:flex max-sm:w-max max-sm:min-w-full">
                  <TabsTrigger value="basic" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                    <Book className="h-4 w-4 mr-2" />
                    <span className="max-sm:hidden sm:inline">Básico</span>
                    <span className="sm:hidden">Básico</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="max-sm:hidden sm:inline">Avanzado</span>
                    <span className="sm:hidden">Avanzado</span>
                  </TabsTrigger>
                  <TabsTrigger value="image" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                    <Image className="h-4 w-4 mr-2" />
                    <span className="max-sm:hidden sm:inline">Imagen</span>
                    <span className="sm:hidden">Imagen</span>
                  </TabsTrigger>
                </TabsList>
              </div>

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
                            {getAllowedLanguages().map(lang => (
                              <SelectItem key={lang.code} value={lang.code}>
                                <span className="mr-1">{lang.flag}</span>
                                {lang.name}
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
                      Añade una imagen representativa para la expresión.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ImageUploaderCard
                        entityType="expression"
                        entityId={initialData._id || ""}
                        imageUrl={formData.img || ""}
                        onImageChange={(newImageUrl) => setValue("img", newImageUrl)}
                        disabled={!initialData._id}
                      />
                      
                      {!initialData._id && (
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          💡 <strong>Tip:</strong> Guarda la expresión primero para poder subir imágenes personalizadas.
                        </div>
                      )}
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