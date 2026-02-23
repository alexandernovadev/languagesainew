import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { ExamQuestionInput } from "@/shared/components/exam/ExamQuestionInput";
import { ExamAttemptResultCard } from "@/shared/components/exam/ExamAttemptResultCard";
import { ExamDetailBar } from "@/shared/components/exam/ExamDetailBar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { examService } from "@/services/examService";
import {
  loadExamAttemptDraft,
  saveExamAttemptDraft,
  clearExamAttemptDraft,
} from "@/shared/hooks/useExamAttemptDraft";
import { shuffleArray } from "@/utils/common/shuffle";
import type { IExam, IExamAttempt } from "@/types/models";
import { cn } from "@/utils/common/classnames";
import { Loader2, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return "00:00";
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function ExamAttemptPage() {
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [exam, setExam] = useState<IExam | null>(null);
  const [attempt, setAttempt] = useState<IExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<(number | string | number[] | null)[]>([]);
  const [submittedAttempt, setSubmittedAttempt] = useState<IExamAttempt | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0);
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);
  const [tick, setTick] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startOptions = (location.state as { timeLimitMinutes?: number; shuffleQuestions?: boolean }) ?? {};

  const loadData = useCallback(async () => {
    if (!id || !attemptId) return;
    try {
      const [examData, attemptData] = await Promise.all([
        examService.getById(id),
        examService.getAttempt(id, attemptId),
      ]);
      setExam(examData);
      setAttempt(attemptData);

      const attemptStartedAt =
        typeof attemptData.startedAt === "string"
          ? new Date(attemptData.startedAt).getTime()
          : (attemptData.startedAt as Date).getTime();

      const draft = loadExamAttemptDraft(id, attemptId, examData.questions.length);
      const questionCount = examData.questions.length;

      if (draft) {
        setAnswers(draft.answers);
        setStartedAt(draft.startedAt);
        setTimeLimitMinutes(draft.timeLimitMinutes ?? 0);
        setCurrentQuestionIndex(
          Math.min(draft.currentQuestionIndex ?? 0, questionCount - 1)
        );
        if (draft.shuffledOrder && draft.shuffledOrder.length === questionCount) {
          setShuffledOrder(draft.shuffledOrder);
        }
      } else {
        const initial: (number | string | number[] | null)[] = examData.questions.map((q) =>
          q.type === "multiple" ? [] : null
        );
        const tl = startOptions.timeLimitMinutes ?? 0;
        const shuffle = startOptions.shuffleQuestions ?? false;
        const order = shuffle
          ? shuffleArray(Array.from({ length: questionCount }, (_, i) => i))
          : undefined;

        setAnswers(initial);
        setStartedAt(attemptStartedAt);
        setTimeLimitMinutes(tl);
        setShuffledOrder(order ?? null);

        saveExamAttemptDraft(id, attemptId, {
          startedAt: attemptStartedAt,
          answers: initial,
          timeLimitMinutes: tl,
          shuffleQuestions: shuffle,
          shuffledOrder: order,
        });
      }
    } catch {
      toast.error("No se pudo cargar el examen");
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  }, [id, attemptId, navigate, startOptions.timeLimitMinutes, startOptions.shuffleQuestions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const elapsedMs =
    startedAt != null
      ? timeLimitMinutes > 0
        ? Math.min(Date.now() - startedAt, timeLimitMinutes * 60 * 1000)
        : Date.now() - startedAt
      : 0;

  const remainingMs =
    timeLimitMinutes > 0 && startedAt != null
      ? Math.max(0, timeLimitMinutes * 60 * 1000 - (Date.now() - startedAt))
      : null;

  useEffect(() => {
    if (startedAt == null) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const hasAutoSubmittedRef = useRef(false);
  useEffect(() => {
    if (
      remainingMs === 0 &&
      timeLimitMinutes > 0 &&
      !hasAutoSubmittedRef.current &&
      !submitting &&
      exam &&
      id &&
      attemptId
    ) {
      hasAutoSubmittedRef.current = true;
      (async () => {
        setSubmitting(true);
        try {
          const answersToSend = exam.questions.map((_, i) => answers[i] ?? (exam.questions[i].type === "multiple" ? [] : ""));
          const normalized = answersToSend.map((a) =>
            Array.isArray(a) ? a : typeof a === "number" ? a : String(a ?? "")
          );
          const result = await examService.submitAttempt(id, attemptId, normalized);
          clearExamAttemptDraft(id, attemptId);
          setSubmittedAttempt(result);
          toast.success(`Tiempo agotado. Puntuación: ${result.score}%`);
        } catch {
          toast.error("Error al enviar el examen");
        } finally {
          setSubmitting(false);
        }
      })();
    }
  }, [remainingMs, timeLimitMinutes, submitting, exam, id, attemptId, answers]);

  useEffect(() => {
    if (id && attemptId && startedAt != null && exam) {
      saveExamAttemptDraft(id, attemptId, {
        startedAt,
        answers,
        timeLimitMinutes,
        shuffleQuestions: shuffledOrder != null,
        shuffledOrder: shuffledOrder ?? undefined,
        currentQuestionIndex,
      });
    }
  }, [currentQuestionIndex, id, attemptId, startedAt, exam, answers, timeLimitMinutes, shuffledOrder]);

  const handleAnswerChange = useCallback(
    (index: number, value: number | string | number[]) => {
      if (!id || !attemptId || !exam || startedAt == null) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = value;
        saveExamAttemptDraft(id, attemptId, {
          startedAt,
          answers: next,
          timeLimitMinutes,
          shuffleQuestions: shuffledOrder != null,
          shuffledOrder: shuffledOrder ?? undefined,
        });
        return next;
      });
    },
    [id, attemptId, exam, startedAt, timeLimitMinutes, shuffledOrder]
  );

  const handleSubmit = async () => {
    if (!id || !attemptId || !exam) return;
    setSubmitting(true);
    try {
      const answersToSend = exam.questions.map((_, i) => answers[i] ?? (exam.questions[i].type === "multiple" ? [] : ""));
      const normalized = answersToSend.map((a) =>
        Array.isArray(a) ? a : typeof a === "number" ? a : String(a ?? "")
      );
      const result = await examService.submitAttempt(id, attemptId, normalized);
      clearExamAttemptDraft(id, attemptId);
      setSubmittedAttempt(result);
      toast.success(`Examen completado. Puntuación: ${result.score}%`);
    } catch {
      toast.error("Error al enviar el examen");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !exam || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-[40dvh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submittedAttempt) {
    const resultExam = typeof submittedAttempt.examId === "object" ? submittedAttempt.examId : exam;
    const meta = resultExam
      ? {
        language: resultExam.language,
        difficulty: resultExam.difficulty,
        grammarTopics: resultExam.grammarTopics,
        topic: resultExam.topic,
      }
      : null;

    return (
      <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {resultExam?.title ?? exam?.title ?? "Examen completado"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Revisa tus respuestas y el feedback de la IA
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-6 py-4 min-w-[100px]">
                <span
                  className={cn(
                    "text-3xl font-bold tabular-nums",
                    submittedAttempt.score >= 70
                      ? "text-emerald-600 dark:text-emerald-400"
                      : submittedAttempt.score >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {submittedAttempt.score}%
                </span>
                <span className="text-xs font-medium text-muted-foreground mt-0.5">
                  Puntuación
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/exams")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    navigate("/exams", { state: { openAttemptsExam: exam ?? resultExam } })
                  }
                >
                  Ver intentos
                </Button>
              </div>
            </div>
          </div>

          {meta && (
            <ExamDetailBar
              meta={meta}
              questionCount={submittedAttempt.attemptQuestions.length}
            />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resultados por pregunta</h2>
          <ScrollArea className="h-[calc(100dvh-320px)] pr-4">
            <div className="space-y-4 pb-8">
              {submittedAttempt.attemptQuestions.map((aq, i) => (
                <ExamAttemptResultCard key={i} aq={aq} index={i} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  const questionCount = exam.questions.length;
  const displayOrder = shuffledOrder ?? exam.questions.map((_, i) => i);
  const originalIndex = displayOrder[currentQuestionIndex];
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questionCount - 1;
  const currentAnswer = answers[originalIndex];
  const hasAnswer =
    currentAnswer != null &&
    (Array.isArray(currentAnswer)
      ? currentAnswer.length > 0
      : typeof currentAnswer !== "string" || currentAnswer.trim() !== "");

  return (
    <div className="flex flex-col min-h-[calc(100dvh-120px)] p-4 sm:p-6">
      <PageHeader
        title={exam.title}
      />
      <div className="flex items-center justify-between">
      <h6 className="text-sm text-muted-foreground">
        {`Pregunta ${currentQuestionIndex + 1} de ${questionCount}`}
      </h6>

      <div className="flex items-center justify-between gap-2">

        <span
          className={`text-lg font-mono font-medium tabular-nums ${remainingMs != null && remainingMs < 60000 ? "text-destructive" : ""
          }`}
          >
          {remainingMs != null ? formatCountdown(remainingMs) : formatElapsed(elapsedMs)}
        </span>
        <Button variant="outline" size="sm" onClick={() => navigate("/exams")}>
          <ArrowLeft className="h-2 w-2" />
        </Button>
          </div>
      </div>

      <div className="flex-1 flex flex-col py-4">
        <ExamQuestionInput
          key={originalIndex}
          question={exam.questions[originalIndex]}
          index={currentQuestionIndex}
          value={answers[originalIndex] ?? null}
          onChange={(v) => handleAnswerChange(originalIndex, v)}
          shuffleOptions={shuffledOrder != null}
        />

        <div className="flex items-center justify-end gap-2 mt-4 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {isLast ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !hasAnswer}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Calificar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
              disabled={!hasAnswer}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
