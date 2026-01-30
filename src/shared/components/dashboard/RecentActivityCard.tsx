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
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
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
                  className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-xs sm:text-sm truncate flex-1 min-w-0">
                        {getItemTitle(item)}
                      </p>
                      {getItemBadge && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {getItemBadge(item)}
                        </Badge>
                      )}
                    </div>
                    {getItemSubtitle && (
                      <p className="text-xs text-muted-foreground truncate break-words">
                        {getItemSubtitle(item)}
                      </p>
                    )}
                    {createdAt && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
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
