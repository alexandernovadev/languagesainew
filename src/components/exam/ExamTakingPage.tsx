import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
  Send,
  LogIn,
} from "lucide-react";
import { useExamTaking } from "@/hooks/useExamTaking";
import { useAuth } from "@/hooks/useAuth";
import { examService, Exam } from "@/services/examService";
import { LoginModal } from "@/components/auth/LoginModal";
import { ExamQuestionTaking } from "./taking/ExamQuestionTaking";
import { ExamSubmissionModal } from "./ExamSubmissionModal";
import { ExamTimer } from "./ExamTimer";
import { ExamProgress } from "./ExamProgress";
import ExamResultsViewModal from "./ExamResultsViewModal";
import { ExamGradingProgress } from "./ExamGradingProgress";
import { toast } from "sonner";
import { getLanguageInfo } from "@/utils/common/language";

export function ExamTakingPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [showGradingErrorModal, setShowGradingErrorModal] = useState(false);

  const {
    exam: examData,
    currentAttempt,
    currentQuestionIndex,
    answers,
    isStarting,
    isFinishing,
    error,
    timeRemaining,
    isTimerRunning,
    startExam,
    finishExam,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    getAnswer,
    setAnswer,
    isQuestionAnswered,
    getAnsweredCount,
    formatTimeRemaining,
    isExamCompleted,
    getProgressPercentage,
    resetAttempt,
    checkCanStartExam,
  } = useExamTaking(examId);

  // Load exam data
  useEffect(() => {
    const loadExam = async () => {
      if (!examId) return;

      try {
        setLoading(true);
        const response = await examService.getExam(examId);
        if (response.success && response.data) {
          setExam(response.data);
        } else {
          throw new Error("No se pudo cargar el examen");
        }
      } catch (error) {
        console.error("Error loading exam:", error);
        toast.error("Error", {
          description: "No se pudo cargar el examen",
        });
        navigate("/exams");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, navigate]);

  // Handle exam start
  const handleStartExam = async () => {
    console.log("🎯 handleStartExam called", {
      exam: exam?.title,
      isStarting,
      user: user?._id,
      isAuthenticated,
    });

    if (!exam) {
      console.error("❌ No exam data available");
      return;
    }

    if (!isAuthenticated) {
      console.log("❌ User not authenticated");
      toast.error("Debes iniciar sesión", {
        description: "Necesitas estar logueado para tomar un examen",
      });
      return;
    }

    try {
      console.log("🚀 Starting exam:", exam.title);
      const success = await startExam(exam);
      console.log("📊 startExam result:", success);

      if (success) {
        console.log("✅ Exam started successfully");
        // Exam started successfully, component will re-render with attempt data
      } else {
        console.log("❌ Failed to start exam");
      }
    } catch (error) {
      console.error("💥 Error in handleStartExam:", error);
      toast.error("Error", {
        description:
          "No se pudo iniciar el examen. Por favor, intenta de nuevo.",
      });
    }
  };

  // Handle exam submission
  const handleSubmitExam = async () => {
    setShowSubmissionModal(false);
    try {
      const result = await finishExam();
      if (result) {
        // Check if AI couldn't grade automatically
        if (result.aiFeedback && result.aiFeedback.includes("No se pudo calificar automáticamente")) {
          setShowGradingErrorModal(true);
          return;
        }
        
        setExamResult(result);
        setShowResultsModal(true);
      }
    } catch (error) {
      console.error('Error finishing exam:', error);
      toast.error('Error al finalizar el examen');
    }
  };

  // Handle exit exam
  const handleExitExam = () => {
    if (getAnsweredCount() > 0) {
      setShowConfirmExit(true);
    } else {
      resetAttempt();
      navigate("/exams");
    }
  };

  // Handle confirm exit
  const handleConfirmExit = () => {
    resetAttempt();
    navigate("/exams");
  };

  // Handle beforeunload (prevent accidental exit)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentAttempt && getAnsweredCount() > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentAttempt, getAnsweredCount]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando examen...</span>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Examen no encontrado</h1>
          <Button onClick={() => navigate("/exams")}>Volver a exámenes</Button>
        </div>
      </div>
    );
  }

  // Show start screen if no attempt is active
  if (!currentAttempt) {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return (
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <LogIn className="h-6 w-6" />
                Inicia sesión para continuar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Necesitas estar logueado para tomar el examen "{exam.title}"
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/exams")}>
                    Volver a Exámenes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{exam.title}</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{exam.level}</Badge>
                              <Badge variant="outline">
                  {getLanguageInfo(exam.language).flag} {getLanguageInfo(exam.language).name}
                </Badge>
              {exam.topic && <Badge variant="outline">{exam.topic}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Información del examen</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Preguntas: {exam.questions?.length ?? 0}</p>
                  <p>• Intentos permitidos: {exam.attemptsAllowed}</p>
                  {exam.timeLimit && (
                    <p>• Tiempo límite: {exam.timeLimit} minutos</p>
                  )}
                  {exam.description && <p>• Descripción: {exam.description}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Instrucciones</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Lee cada pregunta cuidadosamente</p>
                  <p>• Responde todas las preguntas</p>
                  <p>• Puedes navegar entre preguntas</p>
                  <p>• Revisa tus respuestas antes de enviar</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleStartExam}
                disabled={isStarting}
                className="flex-1"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Comenzar Examen"
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate("/exams")}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show exam interface
  const totalQuestions = exam.questions?.length ?? 0;
  const currentQuestionObj = exam.questions?.[currentQuestionIndex] as any;
  const currentQuestion = currentQuestionObj?.question;
  const progressPercentage = getProgressPercentage(totalQuestions);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // If exam is being graded, only show grading progress
  if (isFinishing) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{exam.title}</h1>
            </div>
          </div>
        </div>
        
        <ExamGradingProgress isGrading={isFinishing} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Eliminar el temporizador de aquí */}
          </div>
        </div>

        {/* Progress */}
        <ExamProgress
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          answeredQuestions={(exam.questions ?? [])
            .map((q: any, index: number) => ({ id: q.question._id, index }))
            .filter((item: any) => isQuestionAnswered(item.id))
            .map((item: any) => item.index)}
          onQuestionClick={goToQuestion}
        />
      </div>

      {/* Question */}
      {currentQuestion && (
        <ExamQuestionTaking
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          currentAnswer={getAnswer(currentQuestion._id)}
          isAnswered={isQuestionAnswered(currentQuestion._id)}
          onAnswerChange={setAnswer}
          onNext={() => nextQuestion(totalQuestions)}
          onPrevious={previousQuestion}
          onNavigate={goToQuestion}
          totalQuestions={totalQuestions}
          answeredQuestions={Object.keys(answers).map((_, index) => index + 1)}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
          onExit={handleExitExam}
          examTimeLimit={exam.timeLimit}
          timeRemaining={timeRemaining}
          isTimerRunning={isTimerRunning}
          formatTimeRemaining={formatTimeRemaining}
          onFinish={currentQuestionIndex + 1 === totalQuestions ? () => setShowSubmissionModal(true) : undefined}
        />
      )}



      {/* Submission Modal */}
      <ExamSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onSubmit={handleSubmitExam}
        isSubmitting={isFinishing}
        answeredCount={getAnsweredCount()}
        totalQuestions={totalQuestions}
      />

      {/* Confirm Exit Modal */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Confirmar salida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                ¿Estás seguro de que quieres salir? Perderás todas las
                respuestas que has dado.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmExit(false)}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmExit}>
                  Salir sin guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal open={showLoginModal} setOpen={setShowLoginModal} />

      {/* Results Modal */}
      <ExamResultsViewModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        result={examResult}
        onRetakeExam={() => {
          setShowResultsModal(false);
          resetAttempt();
          // Optionally navigate to exam start
        }}
        onViewExam={() => {
          setShowResultsModal(false);
          // Optionally navigate to exam view
        }}
      />

      {/* Grading Error Modal */}
      {showGradingErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Error en la Calificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Problema detectado:</strong> La IA no pudo calificar automáticamente tu examen.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                  Esto puede deberse a un problema temporal con el sistema de calificación.
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>¿Qué puedes hacer?</strong>
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                  <li>• Intentar de nuevo en unos minutos</li>
                  <li>• Verificar tu conexión a internet</li>
                  <li>• Contactar soporte si el problema persiste</li>
                </ul>
              </div>
            </CardContent>
            <div className="flex gap-3 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowGradingErrorModal(false);
                  navigate("/exams");
                }}
              >
                Volver a Exámenes
              </Button>
              <Button
                onClick={() => {
                  setShowGradingErrorModal(false);
                  resetAttempt();
                }}
              >
                Intentar de Nuevo
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
