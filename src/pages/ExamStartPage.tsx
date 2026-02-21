import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { ExamDetailBar } from "@/shared/components/exam/ExamDetailBar";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { examService } from "@/services/examService";
import { clearAllDraftsForExam } from "@/shared/hooks/useExamAttemptDraft";
import { useUserStore } from "@/lib/store/user-store";
import type { IExam } from "@/types/models";
import type { ExamDetailMeta } from "@/shared/components/exam/ExamDetailBar";
import { Loader2, Play, ArrowLeft, Clock, Shuffle } from "lucide-react";
import { toast } from "sonner";

const TIME_LIMIT_OPTIONS = [
  { value: "0", label: "Sin límite" },
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "60 minutos" },
];

export default function ExamStartPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useUserStore((s) => s.user?._id);
  const [exam, setExam] = useState<IExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  useEffect(() => {
    if (!id) return;
    examService
      .getById(id)
      .then(setExam)
      .catch(() => toast.error("No se pudo cargar el examen"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = async () => {
    if (!id || !userId || !exam) return;
    setStarting(true);
    try {
      clearAllDraftsForExam(id);
      const attempt = await examService.startAttempt(id);
      const attemptId = typeof attempt._id === "string" ? attempt._id : (attempt as any)._id;
      navigate(`/exams/${id}/attempt/${attemptId}`, {
        state: { timeLimitMinutes, shuffleQuestions },
      });
    } catch {
      toast.error("No se pudo iniciar el examen");
      setStarting(false);
    }
  };

  if (loading || !exam) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const meta: ExamDetailMeta = {
    language: exam.language,
    difficulty: exam.difficulty,
    grammarTopics: exam.grammarTopics,
    topic: exam.topic,
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={exam.title}
        description="Revisa los detalles antes de comenzar"
      />
      <ExamDetailBar meta={meta} questionCount={exam.questions.length} />

      <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
        <h3 className="font-medium text-sm">Opciones</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Tiempo límite
            </Label>
            <Select
              value={String(timeLimitMinutes)}
              onValueChange={(v) => setTimeLimitMinutes(parseInt(v, 10))}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_LIMIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="shuffle"
              checked={shuffleQuestions}
              onCheckedChange={(c) => setShuffleQuestions(!!c)}
            />
            <Label
              htmlFor="shuffle"
              className="flex items-center gap-2 text-sm font-normal cursor-pointer"
            >
              <Shuffle className="h-4 w-4" />
              Mezclar orden de preguntas
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={() => navigate("/exams")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Button onClick={handleStart} disabled={starting}>
          {starting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Comenzar examen
        </Button>
      </div>
    </div>
  );
}
