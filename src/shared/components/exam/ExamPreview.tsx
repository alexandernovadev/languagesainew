import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ExamQuestionCard } from "./ExamQuestionCard";
import { ExamDetailBar } from "./ExamDetailBar";
import type { IExam, IExamQuestion } from "@/types/models";
import type { ExamDetailMeta } from "./ExamDetailBar";

export interface ExamPreviewData {
  title: string;
  questions: IExamQuestion[];
}

interface ExamPreviewProps {
  exam: ExamPreviewData;
  meta: ExamDetailMeta;
  actions?: React.ReactNode;
  middleContent?: React.ReactNode;
  scrollHeight?: string;
}

export function ExamPreview({ exam, meta, actions, middleContent, scrollHeight = "50dvh" }: ExamPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      <ExamDetailBar meta={meta} questionCount={exam.questions.length} />

      {middleContent}

      <ScrollArea
        className="pr-4"
        style={{ height: `min(${scrollHeight}, 60dvh)` }}
      >
        <div className="space-y-4 pb-4">
          {exam.questions.map((q, i) => (
            <ExamQuestionCard key={i} question={q} index={i} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
