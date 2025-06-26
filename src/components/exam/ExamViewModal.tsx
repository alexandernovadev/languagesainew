import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Edit } from "lucide-react";
import { Exam } from "@/services/examService";
import { ExamHeader } from "./ExamHeader";
import { ExamQuestionView } from "./ExamQuestionView";

interface ExamViewModalProps {
  exam: Exam | null;
  isOpen: boolean;
  onClose: () => void;
  onEditExam: (exam: Exam) => void;
}

export default function ExamViewModal({
  exam,
  isOpen,
  onClose,
  onEditExam,
}: ExamViewModalProps) {
  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                Vista del Examen
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditExam(exam)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Exam Header */}
            <ExamHeader exam={exam} showStats={true} />

            {/* Questions */}
            <div className="space-y-6">
              {exam.questions.map((questionItem, index) => (
                <ExamQuestionView
                  key={questionItem._id}
                  question={questionItem.question}
                  questionNumber={index + 1}
                  showAnswers={true}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
