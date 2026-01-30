import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LucideIcon, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { IWord } from "@/types/models/Word";
import { ILecture } from "@/types/models/Lecture";
import { IExpression } from "@/types/models/Expression";
import { useNavigate } from "react-router-dom";

interface RecentActivityCardProps {
  title: string;
  icon: LucideIcon;
  items: (IWord | ILecture | IExpression)[];
  type: "words" | "lectures" | "expressions";
  getItemTitle: (item: IWord | ILecture | IExpression) => string;
  getItemSubtitle?: (item: IWord | ILecture | IExpression) => string;
  getItemBadge?: (item: IWord | ILecture | IExpression) => string;
}

export function RecentActivityCard({
  title,
  icon: Icon,
  items,
  type,
  getItemTitle,
  getItemSubtitle,
  getItemBadge,
}: RecentActivityCardProps) {
  const navigate = useNavigate();

  const handleItemClick = (item: IWord | ILecture | IExpression) => {
    const id = (item as any)._id || (item as any).id;
    if (id) {
      navigate(`/${type}/${id}`);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay actividad reciente
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const id = (item as any)._id || (item as any).id;
              const createdAt = (item as any).createdAt
                ? new Date((item as any).createdAt)
                : null;
              
              return (
                <div
                  key={id || index}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {getItemTitle(item)}
                      </p>
                      {getItemBadge && (
                        <Badge variant="outline" className="text-xs">
                          {getItemBadge(item)}
                        </Badge>
                      )}
                    </div>
                    {getItemSubtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {getItemSubtitle(item)}
                      </p>
                    )}
                    {createdAt && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(createdAt, {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
