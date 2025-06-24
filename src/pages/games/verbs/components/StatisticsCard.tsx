import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatisticsCardProps {
  currentPage: number;
  totalPages: number;
  correctAnswers: number;
  totalAnswers: number;
}

export function StatisticsCard({
  currentPage,
  totalPages,
  correctAnswers,
  totalAnswers,
}: StatisticsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-sm">
              Página {currentPage} de {totalPages}
            </Badge>
            <Badge
              variant={
                correctAnswers === totalAnswers ? "default" : "secondary"
              }
              className="text-sm"
            >
              {correctAnswers}/{totalAnswers} correctas
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round((correctAnswers / totalAnswers) * 100)}% de acierto
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
