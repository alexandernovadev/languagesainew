import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Sparkles, Eye, Save, Edit } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useExamGenerator } from "@/hooks/useExamGenerator";
import { useExamStore } from "@/lib/store/useExamStore";
import { ExamConfigForm } from "@/components/exam/ExamConfigForm";
import { ExamGenerationProgress } from "@/components/exam/ExamGenerationProgress";
import { ExamSummary } from "@/components/exam/ExamSummary";
import { ExamQuestionDisplay } from "@/components/exam/ExamQuestionDisplay";
import { ExamEditModal } from "@/components/exam/ExamEditModal";
import { ExamTitleEditModal } from "@/components/exam/ExamTitleEditModal";

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

  const {
    exam,
    isEditing,
    editingField,
    setExam,
    saveExam,
    resetExam: resetExamStore,
    startEditing
  } = useExamStore();

  const [activeTab, setActiveTab] = useState("config");

  // Sync exam data with store when exam is generated
  useEffect(() => {
    if (state.generatedExam && !exam) {
      setExam({
        title: `Examen: ${filters.topic}`,
        topic: filters.topic,
        level: filters.level,
        difficulty: filters.difficulty.toString(),
        questions: state.generatedExam.questions
      });
    }
  }, [state.generatedExam, filters, exam, setExam]);

  // Auto-navigate to progress tab when generation completes
  useEffect(() => {
    if (state.generatedExam && !state.isGenerating && activeTab === "config") {
      setActiveTab("progress");
    }
  }, [state.generatedExam, state.isGenerating, activeTab]);

  const handleGenerate = async () => {
    resetExamStore();
    
    // Cambiar inmediatamente a la pestaña progress
    setActiveTab("progress");
    
    try {
      await generateExam();
    } catch (error) {
      // Si hay error, volver a la pestaña de configuración
      setActiveTab("config");
    }
  };

  const handleRegenerate = async () => {
    resetExam();
    resetExamStore();
    setActiveTab("config");
  };

  const handleViewQuestions = () => {
    setActiveTab("questions");
  };

  const handleSaveExam = async () => {
    try {
      await saveExam();
      // TODO: Show success toast
    } catch (error) {
      // TODO: Show error toast
    }
  };

  const handleEditTitle = () => {
    startEditing(null, 'title');
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
                exam={exam || state.generatedExam}
                filters={filters}
                onRegenerate={handleRegenerate}
                onDownload={handleSaveExam}
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">
                            {exam?.title || `Examen: ${filters.topic}`}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditTitle}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {(exam?.questions || state.generatedExam.questions).length} preguntas • 
                          Nivel {getLevelLabel(filters.level)} • 
                          Dificultad {getDifficultyLabel(filters.difficulty)}
                        </p>
                      </div>
                      <Button onClick={handleSaveExam} variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Examen
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Questions */}
                <div className="space-y-6">
                  {(exam?.questions || state.generatedExam.questions).map((question, index) => (
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
                      <Button onClick={handleSaveExam} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Examen
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

      {/* Edit Modals */}
      <ExamEditModal 
        isOpen={isEditing && editingField !== 'title'} 
        onClose={() => {}} 
      />
      <ExamTitleEditModal 
        isOpen={isEditing && editingField === 'title'} 
        onClose={() => {}} 
      />
    </PageLayout>
  );
}
