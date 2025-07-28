import { useState, useCallback, useEffect } from "react";
import { useExamAttempts } from "./useExamAttempts";
import { examService, Exam } from "@/services/examService";
import { toast } from "sonner";

export const useExamTaking = (examSlug?: string) => {
  const {
    startAttempt,
    getInProgressAttempt,
    submitAttempt,
    gradeAttempt,
    loading,
    error,
  } = useExamAttempts();

  const [exam, setExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isStarting, setIsStarting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load exam data
  useEffect(() => {
    const loadExam = async () => {
      if (!examSlug) return;

      try {
        const response = await examService.getExamBySlug(examSlug);
        if (response.success && response.data) {
          setExam(response.data);
        }
      } catch (error) {
        console.error("Error loading exam:", error);
      }
    };

    loadExam();
  }, [examSlug]);

  // Check for in-progress attempt
  useEffect(() => {
    const checkInProgressAttempt = async () => {
      if (!examSlug || !exam) return;

      try {
        const attempt = await getInProgressAttempt(exam._id);
        if (attempt) {
          setCurrentAttempt(attempt);
          // Load existing answers if any
          if (attempt.answers) {
            const existingAnswers: Record<string, string[]> = {};
            attempt.answers.forEach((answer: any) => {
              existingAnswers[answer.questionId] = answer.userAnswer;
            });
            setAnswers(existingAnswers);
          }
        }
      } catch (error) {
        console.error("Error checking in-progress attempt:", error);
        toast.error("Error al cargar el examen");
      }
    };

    checkInProgressAttempt();
  }, [examSlug, exam, getInProgressAttempt]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Auto-submit when time runs out
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timeRemaining]);

  const startExam = useCallback(
    async (examData: Exam) => {
      if (!examSlug || !exam) return false;

      setIsStarting(true);
      try {
        const attempt = await startAttempt(exam._id);
        if (attempt) {
          setCurrentAttempt(attempt);
          setCurrentQuestionIndex(0);
          setAnswers({});

          // Start timer if exam has time limit
          if (examData.timeLimit) {
            setTimeRemaining(examData.timeLimit * 60); // Convert to seconds
            setIsTimerRunning(true);
          }

          toast.success("Examen iniciado");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error starting exam:", error);
        toast.error("Error al iniciar el examen");
        return false;
      } finally {
        setIsStarting(false);
      }
    },
    [examSlug, exam, startAttempt]
  );

  const handleAutoSubmit = useCallback(async () => {
    if (!currentAttempt) return;

    setIsFinishing(true);
    try {
      const answersArray = Object.entries(answers).map(
        ([questionId, userAnswer]) => ({
          questionId,
          userAnswer,
        })
      );

      await submitAttempt(currentAttempt._id, answersArray);
      await gradeAttempt(currentAttempt._id);

      toast.success("Examen enviado automáticamente (tiempo agotado)");
      // Navigate to results or exam list
    } catch (error) {
      console.error("Error auto-submitting exam:", error);
      toast.error("Error al enviar el examen automáticamente");
    } finally {
      setIsFinishing(false);
    }
  }, [currentAttempt, answers, submitAttempt, gradeAttempt]);

  const finishExam = useCallback(async () => {
    if (!currentAttempt) return null;

    setIsFinishing(true);
    try {
      const answersArray = Object.entries(answers).map(
        ([questionId, userAnswer]) => ({
          questionId,
          userAnswer,
        })
      );

      await submitAttempt(currentAttempt._id, answersArray);
      const gradedAttempt = await gradeAttempt(currentAttempt._id);

      toast.success("Examen enviado exitosamente");
      return gradedAttempt;
    } catch (error) {
      console.error("Error finishing exam:", error);
      toast.error("Error al enviar el examen");
      return null;
    } finally {
      setIsFinishing(false);
    }
  }, [currentAttempt, answers, submitAttempt, gradeAttempt]);

  const nextQuestion = useCallback(
    (totalQuestions: number) => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    },
    [currentQuestionIndex]
  );

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const getAnswer = useCallback(
    (questionId: string): string[] => {
      return answers[questionId] || [];
    },
    [answers]
  );

  const setAnswer = useCallback((questionId: string, answer: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const isQuestionAnswered = useCallback(
    (questionId: string): boolean => {
      const answer = answers[questionId];
      return answer && answer.length > 0;
    },
    [answers]
  );

  const getAnsweredCount = useCallback((): number => {
    return Object.keys(answers).length;
  }, [answers]);

  const formatTimeRemaining = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const isExamCompleted = useCallback(
    (totalQuestions: number): boolean => {
      return getAnsweredCount() === totalQuestions;
    },
    [getAnsweredCount]
  );

  const getProgressPercentage = useCallback(
    (totalQuestions: number): number => {
      return (getAnsweredCount() / totalQuestions) * 100;
    },
    [getAnsweredCount]
  );

  const resetAttempt = useCallback(() => {
    setCurrentAttempt(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setIsTimerRunning(false);
  }, []);

  const checkCanStartExam = useCallback(async (): Promise<boolean> => {
    if (!examSlug || !exam) return false;

    try {
      const attempt = await getInProgressAttempt(exam._id);
      return !attempt; // Can start if no in-progress attempt
    } catch (error) {
      return true; // Assume can start if error
    }
  }, [examSlug, exam, getInProgressAttempt]);

  return {
    exam,
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
  };
};
