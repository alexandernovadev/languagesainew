import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  AlertTriangle,
  Loader2,
  Send,
  LogIn,
} from "lucide-react";
import { useExamAttempt } from "@/hooks/useExamAttempt";
import { useAuth } from "@/hooks/useAuth";
import { examService, Exam } from "@/services/examService";
import { useToast } from "@/hooks/use-toast";
import { LoginModal } from "@/components/auth/LoginModal";
import { ExamQuestionTaking } from "./ExamQuestionTaking";
import { ExamSubmissionModal } from "./ExamSubmissionModal";
import { ExamTimer } from "./ExamTimer";
import { ExamProgress } from "./ExamProgress";

export function ExamTakingPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    currentAttempt,
    currentQuestionIndex,
    answers,
    isStarting,
    isFinishing,
    error,
    timeRemaining,
    isTimerRunning,
    startExam,
    submitAnswer,
    finishExam,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    getAnswer,
    isQuestionAnswered,
    getAnsweredCount,
    formatTimeRemaining,
    isExamCompleted,
    getProgressPercentage,
    resetAttempt,
    checkCanStartExam,
  } = useExamAttempt();

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
        toast({
          title: "Error",
          description: "No se pudo cargar el examen",
          variant: "destructive",
        });
        navigate("/exams");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, navigate, toast]);

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
      toast({
        title: "Debes iniciar sesión",
        description: "Necesitas estar logueado para tomar un examen",
        variant: "destructive",
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
      toast({
        title: "Error",
        description:
          "No se pudo iniciar el examen. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async (questionId: string, answer: any) => {
    await submitAnswer(questionId, answer);
  };

  // Handle exam submission
  const handleSubmitExam = async () => {
    setShowSubmissionModal(false);
    await finishExam();
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
              <Badge variant="outline">{exam.language}</Badge>
              {exam.topic && <Badge variant="outline">{exam.topic}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Información del examen</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Preguntas: {exam.questions.length}</p>
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
  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const progressPercentage = getProgressPercentage(totalQuestions);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">
              Pregunta {currentQuestionIndex + 1} de {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {exam.timeLimit && (
              <ExamTimer
                timeRemaining={timeRemaining}
                isRunning={isTimerRunning}
                formatTime={formatTimeRemaining}
              />
            )}
            <Button
              variant="outline"
              onClick={handleExitExam}
              disabled={isFinishing}
            >
              Salir
            </Button>
          </div>
        </div>

        {/* Progress */}
        <ExamProgress
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          answeredQuestions={Array.from(Array(totalQuestions).keys()).filter(
            (i) => isQuestionAnswered(exam.questions[i].question._id)
          )}
          onQuestionClick={goToQuestion}
        />
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {currentQuestion && (
            <ExamQuestionTaking
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              currentAnswer={getAnswer(currentQuestion.question._id)}
              onAnswerSubmit={(answer) =>
                handleAnswerSubmit(currentQuestion.question._id, answer)
              }
              isAnswered={isQuestionAnswered(currentQuestion.question._id)}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={isFirstQuestion || isFinishing}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {getAnsweredCount()} de {totalQuestions} respondidas
          </div>

          {isLastQuestion ? (
            <Button
              onClick={() => setShowSubmissionModal(true)}
              disabled={isFinishing || !isExamCompleted(totalQuestions)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isFinishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Finalizar Examen
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => nextQuestion(totalQuestions)}
              disabled={isFinishing}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

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
    </div>
  );
}
