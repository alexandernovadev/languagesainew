import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Eye, Play } from 'lucide-react';
import { Exam } from '@/services/examService';

interface ExamCardProps {
  exam: Exam;
  onViewExam: (exam: Exam) => void;
  onTakeExam: (exam: Exam) => void;
}

export default function ExamCard({ exam, onViewExam, onTakeExam }: ExamCardProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      A1: 'bg-green-100 text-green-800',
      A2: 'bg-blue-100 text-blue-800',
      B1: 'bg-yellow-100 text-yellow-800',
      B2: 'bg-orange-100 text-orange-800',
      C1: 'bg-red-100 text-red-800',
      C2: 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{exam.title}</CardTitle>
          <Badge className={getLevelColor(exam.level)}>
            {exam.level}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{exam.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{exam.questions.length} preguntas</span>
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
            <Badge variant={exam.source === 'ai' ? 'default' : 'secondary'}>
              {exam.source === 'ai' ? 'IA' : 'Manual'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(exam.createdAt)}
            </span>
          </div>

          {exam.topic && (
            <Badge variant="outline" className="text-xs">
              {exam.topic}
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewExam(exam)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Examen
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