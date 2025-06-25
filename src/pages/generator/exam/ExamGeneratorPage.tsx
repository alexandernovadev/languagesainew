import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Sparkles, Eye, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useExamGenerator } from "@/hooks/useExamGenerator";
import { ExamConfigForm } from "@/components/exam/ExamConfigForm";
import { ExamGenerationProgress } from "@/components/exam/ExamGenerationProgress";
import { ExamSummary } from "@/components/exam/ExamSummary";
import { ExamQuestionDisplay } from "@/components/exam/ExamQuestionDisplay";

export default function ExamGeneratorPage() {
  const {
    state,
    filters,
    updateFilter,
    generateExam,
    resetExam,
    resetFilters,
    getQuestionTypeLabel,
    getLevelLabel,
    getDifficultyLabel
  } = useExamGenerator();

  const [activeTab, setActiveTab] = useState("config");

  const handleGenerate = async () => {
    await generateExam();
    setActiveTab("progress");
  };

  const handleRegenerate = async () => {
    resetExam();
    setActiveTab("config");
  };

  const handleViewQuestions = () => {
    setActiveTab("questions");
  };

  const handleDownload = () => {
    // TODO: Implement PDF download functionality
    console.log("Downloading exam as PDF...");
  };

  const handleBackToConfig = () => {
    setActiveTab("config");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Generador de Exámenes"
        description="Crea exámenes personalizados con IA para diferentes niveles y temas."
        actions={
          <div className="flex gap-2">
            {state.generatedExam && (
              <Button variant="outline" onClick={handleBackToConfig}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nueva Generación
              </Button>
            )}
          </div>
        }
      />

      <div className="space-y-6">
        {/* Progress indicator */}
        {state.isGenerating && (
          <ExamGenerationProgress 
            progress={state.progress} 
            isGenerating={state.isGenerating} 
          />
        )}

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config" disabled={state.isGenerating}>
              <FileText className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={!state.isGenerating && !state.generatedExam}>
              <Sparkles className="h-4 w-4 mr-2" />
              Progreso
            </TabsTrigger>
            <TabsTrigger value="questions" disabled={!state.generatedExam}>
              <Eye className="h-4 w-4 mr-2" />
              Preguntas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <ExamConfigForm
              filters={filters}
              updateFilter={updateFilter}
              onGenerate={handleGenerate}
              isGenerating={state.isGenerating}
              error={state.error}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {state.generatedExam ? (
              <ExamSummary
                exam={state.generatedExam}
                filters={filters}
                onRegenerate={handleRegenerate}
                onDownload={handleDownload}
                onView={handleViewQuestions}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Generando Examen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground shimmer-text">
                    El examen se está generando. Por favor espera...
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {state.generatedExam ? (
              <div className="space-y-6">
                {/* Exam header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Examen: {filters.topic}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {state.generatedExam.questions.length} preguntas • 
                          Nivel {getLevelLabel(filters.level)} • 
                          Dificultad {getDifficultyLabel(filters.difficulty)}
                        </p>
                      </div>
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Questions */}
                <div className="space-y-6">
                  {state.generatedExam.questions.map((question, index) => (
                    <ExamQuestionDisplay
                      key={index}
                      question={question}
                      questionNumber={index + 1}
                    />
                  ))}
                </div>

                {/* Footer actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleRegenerate} className="flex-1" variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generar Nuevo Examen
                      </Button>
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No hay examen generado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Genera un examen primero para ver las preguntas.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
