import { ModalNova } from "@/shared/components/ui/modal-nova";
import { ExamPreview } from "./ExamPreview";
import type { IExam } from "@/types/models";
import type { ExamDetailMeta } from "./ExamDetailBar";

interface ExamPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: IExam | null;
}

export function ExamPreviewModal({ open, onOpenChange, exam }: ExamPreviewModalProps) {
  if (!exam) return null;

  const meta: ExamDetailMeta = {
    language: exam.language,
    difficulty: exam.difficulty,
    grammarTopics: exam.grammarTopics,
    topic: exam.topic,
  };

  const examPreviewData = {
    title: exam.title,
    questions: exam.questions,
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      height="h-[90dvh]"
    >
      <div className="px-2 sm:px-4 py-4">
        <ExamPreview
          exam={examPreviewData}
          meta={meta}
          scrollHeight="60dvh"
        />
      </div>
    </ModalNova>
  );
}
