import { useState } from "react";
import { ModalNova } from "@/shared/components/ui/modal-nova";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Loader2,
  Sparkles,
  Save,
  RefreshCw,
  X,
  Eye,
  Wand2,
  Eye as EyeIcon,
} from "lucide-react";
import { useExpressionStore } from "../../store/useExpressionStore";
import { ExpressionLevelBadge } from "../ExpressionLevelBadge";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";

interface ExpressionGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpressionGeneratorModal({
  open,
  onOpenChange,
}: ExpressionGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("generate");

  const {
    generateExpression,
    clearGeneratedExpression,
    generatedExpression,
    isGenerating,
    createExpression,
    actionLoading,
  } = useExpressionStore();

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor ingresa un prompt");
      return;
    }

    const result = await generateExpression(prompt);
    if (result) {
      setActiveTab("preview");
    }
  };

  const handleSave = async () => {
    if (!generatedExpression) return;

    try {
      await createExpression(generatedExpression);
      toast.success("Expresión guardada exitosamente", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () =>
            handleApiResult(
              {
                success: true,
                data: generatedExpression,
                message: "Expresión guardada exitosamente",
              },
              "Guardar Expresión"
            ),
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss(),
        },
      });
      handleClose();
    } catch (error) {
      handleApiResult(error, "Guardar Expresión");
    }
  };

  const handleRegenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor ingresa un prompt");
      return;
    }

    const result = await generateExpression(prompt);
    if (result) {
      toast.success("Expresión regenerada exitosamente", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () =>
            handleApiResult(
              {
                success: true,
                data: result,
                message: "Expresión regenerada exitosamente",
              },
              "Regenerar Expresión"
            ),
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleClose = () => {
    setPrompt("");
    setActiveTab("generate");
    clearGeneratedExpression();
    onOpenChange(false);
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title="✨ Generar Expresión con AI"
      description="Describe qué tipo de expresión quieres generar y la AI creará una para ti"
      size="4xl"
      height="h-[90dvh]"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Lado izquierdo: Regenerar (solo cuando hay expresión) */}
          <div className="flex-1">
            {generatedExpression && (
              <Button
                onClick={handleRegenerate}
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerar
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Lado derecho: Cerrar y Generar/Guardar */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
            >
              Cerrar
            </Button>

            {!generatedExpression ? (
              // Solo mostrar botón de generar si no hay expresión generada
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar
                  </>
                )}
              </Button>
            ) : (
              // Mostrar botón de guardar si ya hay expresión generada
              <Button onClick={handleSave} disabled={actionLoading.create || isGenerating}>
                {actionLoading.create ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="px-6 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Contenedor con scroll horizontal en móvil */}
          <div className="max-sm:overflow-x-auto max-sm:pb-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 max-sm:flex max-sm:w-max max-sm:min-w-full">
              <TabsTrigger value="generate" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <Wand2 className="h-4 w-4 mr-2" />
                <span className="max-sm:hidden sm:inline">Generar</span>
                <span className="sm:hidden">Generar</span>
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedExpression} className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <EyeIcon className="h-4 w-4 mr-2" />
                <span className="max-sm:hidden sm:inline">Vista Previa</span>
                <span className="sm:hidden">Previa</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prompt de Generación</CardTitle>
                <CardDescription>
                  Describe qué tipo de expresión quieres generar. Por ejemplo:
                  "Crea un idiom sobre el éxito", "Genera una frase formal para
                  negocios"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Descripción</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ej: Crea un idiom sobre el éxito que sea fácil de entender..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  Haz clic en "Generar" en el pie del modal para crear tu
                  expresión
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {generatedExpression && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información Principal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {generatedExpression.expression}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {generatedExpression.definition}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Metadatos */}
                    <div className="flex items-center gap-3">
                      {generatedExpression.difficulty && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Nivel:</span>
                          <ExpressionLevelBadge
                            level={generatedExpression.difficulty}
                          />
                        </div>
                      )}
                      {generatedExpression.type &&
                        generatedExpression.type.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Tipos:</span>
                            <div className="flex gap-1">
                              {generatedExpression.type.map((type, index) => (
                                <Badge key={index} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Contexto */}
                    {generatedExpression.context && (
                      <div>
                        <Label className="text-sm font-medium">Contexto</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {generatedExpression.context}
                        </p>
                      </div>
                    )}

                    {/* Traducción al Español */}
                    {generatedExpression.spanish && (
                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium">
                          En Español
                        </Label>
                        <div className="space-y-2 mt-2">
                          {generatedExpression.spanish.expression && (
                            <div>
                              <span className="text-sm font-medium">
                                Expresión:{" "}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {generatedExpression.spanish.expression}
                              </span>
                            </div>
                          )}
                          {generatedExpression.spanish.definition && (
                            <div>
                              <span className="text-sm font-medium">
                                Definición:{" "}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {generatedExpression.spanish.definition}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ejemplos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ejemplos de Uso</CardTitle>
                    <CardDescription>
                      Frases que muestran cómo usar esta expresión
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedExpression.examples &&
                    generatedExpression.examples.length > 0 ? (
                      <div className="space-y-3">
                        {generatedExpression.examples.map((example, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{example}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay ejemplos disponibles
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ModalNova>
  );
}
