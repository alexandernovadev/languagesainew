import { useState } from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Save, RefreshCw, X, Eye } from "lucide-react";
import { useExpressionStore } from "@/lib/store/useExpressionStore";
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
          onClick: () => handleApiResult({ success: true, data: generatedExpression, message: "Expresión guardada exitosamente" }, "Guardar Expresión")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
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
          onClick: () => handleApiResult({ success: true, data: result, message: "Expresión regenerada exitosamente" }, "Regenerar Expresión")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
          {activeTab === "generate" && (
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
          )}
          {activeTab === "preview" && generatedExpression && (
            <Button
              onClick={handleSave}
              disabled={actionLoading.create}
            >
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
      }
    >
      <div className="px-6 py-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generar</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedExpression}>
                Vista Previa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt de Generación</CardTitle>
                  <CardDescription>
                    Describe qué tipo de expresión quieres generar. Por ejemplo:
                    "Crea un idiom sobre el éxito", "Genera una frase formal
                    para negocios"
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
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generar Expresión
                        </>
                      )}
                    </Button>
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
                              <span className="text-sm font-medium">
                                Tipos:
                              </span>
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
                          <Label className="text-sm font-medium">
                            Contexto
                          </Label>
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
                          {generatedExpression.examples.map(
                            (example, index) => (
                              <div
                                key={index}
                                className="p-3 bg-muted rounded-lg"
                              >
                                <p className="text-sm">{example}</p>
                              </div>
                            )
                          )}
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

              {/* Acciones */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      variant="outline"
                      className="flex-1"
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
                    <Button
                      onClick={handleSave}
                      disabled={actionLoading.create}
                      className="flex-1"
                    >
                      {actionLoading.create ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Expresión
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </ModalNova>
  );
}
