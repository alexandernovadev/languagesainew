import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Eye, Play, Edit } from "lucide-react";
import { Exam } from "@/services/examService";
import { formatDateShort } from "@/utils/common/time";

interface ExamCardProps {
  exam: Exam;
  onViewExam: (exam: Exam) => void;
  onTakeExam: (exam: Exam) => void;
  onEditExam: (exam: Exam) => void;
}

export default function ExamCard({
  exam,
  onViewExam,
  onTakeExam,
  onEditExam,
}: ExamCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mr-2">{exam.title}</CardTitle>
          <Badge variant={"yellow"}>{exam.level}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{exam.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{exam.questions?.length || 0} preguntas</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>{exam.timeLimit} min</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>{exam.attemptsAllowed} intentos</span>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant={exam.source === "ai" ? "blue" : "silver"}>
              {exam.source === "ai" ? "IA" : "Manual"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDateShort(exam.createdAt)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewExam(exam)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditExam(exam)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              size="sm"
              onClick={() => onTakeExam(exam)}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Contestar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
