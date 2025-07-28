import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Eye,
  Save,
  Edit,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useExamGenerator } from "@/hooks/useExamGenerator";
import { useExamStore } from "@/lib/store/useExamStore";
import { examService } from "@/services/examService";
import { ExamConfigForm } from "@/components/exam/ExamConfigForm";
import { ExamGenerationProgress } from "@/components/exam/ExamGenerationProgress";
import { ExamGenerationSummary } from "@/components/exam/ExamGenerationSummary";
import { ExamSummary } from "@/components/exam/ExamSummary";
import { ExamQuestionDisplay } from "@/components/exam/ExamQuestionDisplay";
import { ExamEditModal } from "@/components/exam/ExamEditModal";
import { ExamTitleEditModal } from "@/components/exam/ExamTitleEditModal";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { toast } from "sonner";

export default function ExamGeneratorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editExamId = searchParams.get("edit");

  const {
    state,
    filters,
    updateFilter,
    generateExam,
    resetExam,
    loadExistingExam,
  } = useExamGenerator();

  const {
    exam,
    isEditing,
    editingField,
    isSaving,
    saveError,
    setExam,
    saveExam,
    resetExam: resetExamStore,
    startEditing,
    clearSaveError,
  } = useExamStore();

  const [activeTab, setActiveTab] = useState("config");
  const [showTitleModal, setShowTitleModal] = useState(false);

  // Sync exam data with store when exam is generated
  useEffect(() => {
    if (state.generatedExam && !exam) {
      setExam({
        title: state.generatedExam.examTitle || `Examen: ${filters.topic}`,
        topic: filters.topic,
        level: filters.level,
        difficulty: filters.difficulty.toString(),
        language: filters.userLang, // Agregar el idioma de los filtros
        questions: state.generatedExam.questions,
        examSlug: state.generatedExam.examSlug,
      });
    }
  }, [state.generatedExam, filters, exam, setExam]);

  // Auto-navigate to progress tab when generation completes
  useEffect(() => {
    if (state.generatedExam && !state.isGenerating && activeTab === "config") {
      setActiveTab("progress");
    }
  }, [state.generatedExam, state.isGenerating, activeTab]);

  // Load existing exam for editing
  useEffect(() => {
    const loadExamForEditing = async () => {
      if (editExamId) {
        try {
          const response = await examService.getExam(editExamId);
          if (response.success && response.data) {
            const examData = response.data;

            // Convert exam data to store format
            const examForStore = {
              title: examData.title,
              topic: examData.topic || "",
              level: examData.level,
              difficulty: "3", // Default difficulty
              questions: [], // We'll handle questions separately if needed
            };

            setExam(examForStore);

            // Load the exam into the generator state
            const mockGeneratedExam = {
              examTitle: examData.title || `Examen: ${examData.topic || ""}`,
              examSlug: examData.slug || "exam-general",
              questions: [],
            };

            loadExistingExam(
              mockGeneratedExam,
              examData.topic || "",
              examData.level || "B1"
            );

            // Navigate to questions tab
            setActiveTab("questions");

            toast.success("Examen cargado", {
              description: "El examen ha sido cargado para edición",
            });
          }
        } catch (error) {
          console.error("Error loading exam for editing:", error);
          toast.error("Error", {
            description: "No se pudo cargar el examen para edición",
          });
        }
      }
    };

    loadExamForEditing();
  }, [editExamId, loadExistingExam, setExam, setActiveTab]);

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

  const handleNewGeneration = () => {
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
      // Show success toast and redirect to exams page
      toast.success("¡Éxito!", {
        description: "Guardado con éxito",
      });
      navigate("/exams");
    } catch (error) {
      // The error is already handled in the store
    }
  };

  const handleEditTitle = () => {
    startEditing(null, "title");
    setShowTitleModal(true);
  };

  const handleBackToConfig = () => {
    setActiveTab("config");
  };

  // Create a mock exam object for the ExamHeader component
  const createMockExamForHeader = () => {
    const currentExam = exam || state.generatedExam;
    const examTitle =
      exam?.title ||
      state.generatedExam?.examTitle ||
      `Examen: ${filters.topic}`;
    const examSlug = state.generatedExam?.examSlug || "exam-temp";
    return {
      _id: "temp",
      title: examTitle,
      slug: examSlug,
      description: `Examen generado sobre ${filters.topic}`,
      language: filters.userLang || "en", // Usar userLang de los filtros o "en" como default
      level: filters.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
      topic: filters.topic,
      source: "ai" as const,
      attemptsAllowed: 3,
      timeLimit: 60,
      adaptive: false,
      version: 1,
      questions: ((currentExam as any)?.questions || []).map(
        (q: any, index: number) => ({
          _id: `temp-q-${index}`,
          question: {
            _id: `temp-q-${index}`,
            text: q.text,
            type: q.type,
            level: filters.level,
            topic: filters.topic,
            difficulty: filters.difficulty,
            options: q.options?.map((opt: any, optIndex: number) => ({
              _id: `temp-opt-${index}-${optIndex}`,
              value: opt.value,
              label: opt.label,
              isCorrect: opt.isCorrect,
            })),
            correctAnswers: q.correctAnswers,
            explanation: q.explanation,
            tags: q.tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          weight: 1,
          order: index,
        })
      ),
      createdBy: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  return (
    <PageLayout>
      <PageHeader
        title="Generador de Exámenes"
        description="Crea exámenes personalizados con IA para diferentes niveles y temas."
        actions={
          <div className="flex gap-2">
            {state.generatedExam && (
              <Button variant="outline" onClick={handleNewGeneration}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nueva Generación
              </Button>
            )}
          </div>
        }
      />

      <div className="space-y-6">
        {/* Error notification */}
        {saveError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{saveError}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSaveError}
                className="text-destructive hover:text-destructive/80"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config" disabled={state.isGenerating}>
              <FileText className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              disabled={!state.isGenerating && !state.generatedExam}
            >
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
                onDownload={handleSaveExam}
                onView={handleViewQuestions}
                isSaving={isSaving}
              />
            ) : (
              <div className="space-y-6">
                <ExamGenerationProgress isGenerating={state.isGenerating} />
                <ExamGenerationSummary filters={filters} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {state.generatedExam ? (
              <div className="space-y-6">
                {/* Exam header with edit button */}
                <ExamHeader
                  exam={createMockExamForHeader()}
                  showStats={true}
                  showEditButton={true}
                  onEditTitle={handleEditTitle}
                />
                {/* Modal for editing title */}
                <ExamTitleEditModal
                  isOpen={showTitleModal}
                  onClose={() => setShowTitleModal(false)}
                />
                {/* Questions using ExamQuestionDisplay for editing functionality */}
                <div className="space-y-6">
                  {(
                    exam?.questions ||
                    (state.generatedExam as any)?.questions ||
                    []
                  ).map((question: any, index: number) => (
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
                      <Button
                        onClick={handleRegenerate}
                        className="flex-1"
                        variant="outline"
                      >
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
        isOpen={isEditing && editingField !== "title"}
        onClose={() => {}}
        exam={null}
        onExamUpdated={() => {}}
      />
    </PageLayout>
  );
}
