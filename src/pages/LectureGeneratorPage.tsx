import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useLectureGenerator } from "@/shared/hooks/useLectureGenerator";
import { TopicGeneratorSection } from "@/shared/components/lecture-generator/TopicGeneratorSection";
import { LectureParamsModal } from "@/shared/components/lecture-generator/LectureParamsModal";
import { ParamsSummary } from "@/shared/components/lecture-generator/ParamsSummary";
import { LecturePreview } from "@/shared/components/lecture-generator/LecturePreview";
import { Button } from "@/shared/components/ui/button";
import { Rocket, Loader2 } from "lucide-react";

export default function LectureGeneratorPage() {
  const navigate = useNavigate();
  const {
    // Estado
    keywords,
    setKeywords,
    generatedTopic,
    isGeneratingTopic,
    generatedText,
    isGenerating,
    params,
    paramsModalOpen,
    setParamsModalOpen,
    
    // Tema
    generateTopic,
    
    // Generación
    generateText,
    
    // Parámetros
    updateParam,
    
    // Acciones
    saveLecture,
    regenerate,
    clearPreview,
  } = useLectureGenerator();

  const handleApplyParams = (newParams: typeof params) => {
    Object.entries(newParams).forEach(([key, value]) => {
      updateParam(key as keyof typeof params, value);
    });
  };

  const handleGenerate = async () => {
    try {
      await generateText();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleSave = async () => {
    try {
      await saveLecture();
      // Redirigir a la página de lecturas después de guardar exitosamente
      navigate("/lectures");
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerate();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleCopy = () => {
    // Ya manejado en LecturePreview
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Generador de Lecturas"
        description="Genera lecturas personalizadas con IA"
      />

      {/* Sección 1: Generar Tema */}
      <TopicGeneratorSection
        keywords={keywords}
        setKeywords={setKeywords}
        generatedTopic={generatedTopic}
        isGeneratingTopic={isGeneratingTopic}
        onGenerateTopic={generateTopic}
        onOpenParams={() => setParamsModalOpen(true)}
      />

      {/* Sección 2: Badges de Parámetros */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Parámetros Actuales:
        </h3>
        <ParamsSummary
          params={params}
          onBadgeClick={() => setParamsModalOpen(true)}
        />
      </div>

      {/* Sección 3: Botón de Generación */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={
            isGenerating || 
            isGeneratingTopic || 
            (generatedTopic.trim().length < 100 && keywords.trim().length < 100)
          }
          size="lg"
          className="min-w-[200px]"
          title={
            (generatedTopic.trim().length < 100 && keywords.trim().length < 100)
              ? "Necesitas un tema de al menos 100 caracteres para generar la lectura"
              : undefined
          }
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2" />
              Generar Lectura
            </>
          )}
        </Button>
      </div>

      {/* Sección 4: Preview */}
      <LecturePreview
        generatedText={generatedText}
        isGenerating={isGenerating}
        onSave={handleSave}
        onRegenerate={handleRegenerate}
        onCopy={handleCopy}
      />

      {/* Modal de Parámetros */}
      <LectureParamsModal
        open={paramsModalOpen}
        onOpenChange={setParamsModalOpen}
        params={params}
        onApply={handleApplyParams}
      />
    </div>
  );
}
