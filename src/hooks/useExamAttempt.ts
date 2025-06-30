import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useExamAttemptStore } from "@/lib/store/useExamAttemptStore";
import { examAttemptService } from "@/services/examAttemptService";
import { useUserStore } from "@/lib/store/user-store";
import { Exam } from "@/services/examService";

export const useExamAttempt = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentAttempt,
    currentExamId,
    currentQuestionIndex,
    answers,
    answeredQuestions,
    isStarting,
    isSubmitting,
    isFinishing,
    error,
    timeRemaining,
    isTimerRunning,
    setCurrentAttempt,
    setCurrentExamId,
    setCurrentQuestionIndex,
    setAnswer,
    getAnswer,
    isQuestionAnswered,
    getAnsweredCount,
    setTimeRemaining,
    startTimer,
    stopTimer,
    updateTimer,
    setStarting,
    setSubmitting,
    setFinishing,
    setError,
    resetAttempt,
    resetAnswers,
  } = useExamAttemptStore();

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        updateTimer();
      }, 1000);
    } else if (timeRemaining <= 0 && isTimerRunning) {
      stopTimer();
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timeRemaining, updateTimer, stopTimer]);

  // Check if user can start an exam
  const checkCanStartExam = useCallback(
    async (examId: string): Promise<boolean> => {
      console.log("🔍 checkCanStartExam called with examId:", examId);
      
      if (!user?._id) {
        console.log("❌ No user ID found");
        toast.error("Error", {
          description: "Debes iniciar sesión para tomar un examen",
        });
        return false;
      }

      console.log("✅ User ID found:", user._id);

      try {
        console.log("🌐 Calling examAttemptService.checkCanCreateAttempt...", {
          userId: user._id,
          examId,
        });
        
        const canCreate = await examAttemptService.checkCanCreateAttempt(
          user._id,
          examId
        );
        
        console.log("📡 examAttemptService.checkCanCreateAttempt result:", canCreate);

        if (!canCreate.canCreate) {
          console.log("❌ Cannot create attempt:", canCreate.message);
          toast.error("No puedes tomar este examen", {
            description:
              canCreate.message || "Has alcanzado el límite de intentos",
          });
          return false;
        }

        console.log("✅ Can create attempt");
        return true;
      } catch (error) {
        console.error("💥 Error checking if can start exam:", error);
        toast.error("Error", {
          description: "No se pudo verificar si puedes tomar el examen",
        });
        return false;
      }
    },
    [user?._id]
  );

  // Start an exam attempt
  const startExam = useCallback(
    async (exam: Exam): Promise<boolean> => {
      console.log("🚀 startExam called with exam:", exam.title);
      
      if (!user?._id) {
        console.log("❌ No user ID in startExam");
        toast.error("Error", {
          description: "Debes iniciar sesión para tomar un examen",
        });
        return false;
      }

      console.log("✅ User ID found in startExam:", user._id);

      try {
        setStarting(true);
        setError(null);

        console.log("🔍 Checking if can start exam...", {
          userId: user._id,
          examId: exam._id,
        });

        // Check if can start
        const canStart = await checkCanStartExam(exam._id);
        console.log("📋 checkCanStartExam result:", canStart);

        if (!canStart) {
          console.log("❌ Cannot start exam - checkCanStartExam returned false");
          setStarting(false);
          return false;
        }

        console.log("✅ Can start exam, creating attempt...", { user: user._id, exam: exam._id });

        // Create attempt
        const attempt = await examAttemptService.createAttempt({
          userId: user._id,
          examId: exam._id,
        });

        console.log("🎉 Attempt created:", attempt);

        // Set up the attempt
        setCurrentAttempt(attempt);
        setCurrentExamId(exam._id);
        setCurrentQuestionIndex(0);
        resetAnswers();

        // Set up timer if exam has time limit
        if (exam.timeLimit) {
          setTimeRemaining(exam.timeLimit * 60); // Convert minutes to seconds
          startTimer();
        }

        toast.success("¡Examen iniciado!", {
          description: `Has comenzado el examen "${exam.title}"`,
        });

        console.log("✅ Exam started successfully");
        return true;
      } catch (error) {
        console.error("💥 Error starting exam:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error al iniciar el examen";
        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
        return false;
      } finally {
        setStarting(false);
      }
    },
    [
      user?._id,
      checkCanStartExam,
      setStarting,
      setError,
      setCurrentAttempt,
      setCurrentExamId,
      setCurrentQuestionIndex,
      resetAnswers,
      setTimeRemaining,
      startTimer,
    ]
  );

  // Submit an individual answer
  const submitAnswer = useCallback(
    async (questionId: string, answer: any): Promise<boolean> => {
      if (!currentAttempt?._id) {
        console.error("No active attempt");
        return false;
      }

      try {
        // Update local state immediately for better UX
        setAnswer(questionId, answer);

        // Submit to backend
        await examAttemptService.submitAnswer(currentAttempt._id, {
          questionId,
          answer,
        });

        return true;
      } catch (error) {
        console.error("Error submitting answer:", error);
        // Don't show toast for every answer submission error to avoid spam
        return false;
      }
    },
    [currentAttempt?._id, setAnswer]
  );

  // Navigate to next question
  const nextQuestion = useCallback(
    (totalQuestions: number) => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    },
    [currentQuestionIndex, setCurrentQuestionIndex]
  );

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  // Navigate to specific question
  const goToQuestion = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(index);
    },
    [setCurrentQuestionIndex]
  );

  // Handle time up
  const handleTimeUp = useCallback(async () => {
    if (currentAttempt?._id) {
      toast.error("Tiempo agotado", {
        description:
          "Se ha agotado el tiempo del examen. Enviando respuestas...",
      });

      await finishExam();
    }
  }, [currentAttempt?._id]);

  // Finish the exam
  const finishExam = useCallback(async (): Promise<boolean> => {
    if (!currentAttempt?._id) {
      console.error("No active attempt");
      return false;
    }

    try {
      setFinishing(true);
      setError(null);
      stopTimer();

      // Submit the attempt
      const submittedAttempt = await examAttemptService.submitAttempt(
        currentAttempt._id
      );
      setCurrentAttempt(submittedAttempt);

      toast.success("¡Examen enviado!", {
        description:
          "Tu examen ha sido enviado exitosamente. Los resultados estarán disponibles pronto.",
      });

      // Navigate to results page
      navigate(`/exams/${currentExamId}/results/${submittedAttempt._id}`);

      return true;
    } catch (error) {
      console.error("Error finishing exam:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al finalizar el examen";
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
      return false;
    } finally {
      setFinishing(false);
    }
  }, [
    currentAttempt?._id,
    setFinishing,
    setError,
    stopTimer,
    setCurrentAttempt,
    navigate,
    currentExamId,
  ]);

  // Get attempt history
  const getAttemptHistory = useCallback(
    async (examId: string): Promise<any[]> => {
      if (!user?._id) return [];

      try {
        return await examAttemptService.getAttemptsByUserAndExam(user._id, examId);
      } catch (error) {
        console.error("Error getting attempt history:", error);
        return [];
      }
    },
    [user?._id]
  );

  // Get user stats
  const getUserStats = useCallback(async (): Promise<any | null> => {
    if (!user?._id) return null;

    try {
      return await examAttemptService.getUserStats(user._id);
    } catch (error) {
      console.error("Error getting user stats:", error);
      return null;
    }
  }, [user?._id]);

  // Format time remaining
  const formatTimeRemaining = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Check if exam is completed
  const isExamCompleted = useCallback(
    (totalQuestions: number): boolean => {
      return getAnsweredCount() === totalQuestions;
    },
    [getAnsweredCount]
  );

  // Get progress percentage
  const getProgressPercentage = useCallback(
    (totalQuestions: number): number => {
      if (totalQuestions === 0) return 0;
      return Math.round((getAnsweredCount() / totalQuestions) * 100);
    },
    [getAnsweredCount]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    // State
    currentAttempt,
    currentExamId,
    currentQuestionIndex,
    answers,
    answeredQuestions,
    isStarting,
    isSubmitting,
    isFinishing,
    error,
    timeRemaining,
    isTimerRunning,

    // Actions
    startExam,
    submitAnswer,
    finishExam,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    getAnswer,
    isQuestionAnswered,
    getAnsweredCount,
    getAttemptHistory,
    getUserStats,
    formatTimeRemaining,
    isExamCompleted,
    getProgressPercentage,
    resetAttempt,
    checkCanStartExam,
  };
};
