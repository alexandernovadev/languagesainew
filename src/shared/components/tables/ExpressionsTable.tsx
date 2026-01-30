import { IExpression } from "@/types/models/Expression";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Edit, Trash2, Image as ImageIcon, Volume2, MessageSquare } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getDifficultyVariant } from "@/utils/common";

interface ExpressionsTableProps {
  expressions: IExpression[];
  loading: boolean;
  onEdit: (expression: IExpression) => void;
  onDelete: (expression: IExpression) => void;
}

export function ExpressionsTable({ expressions, loading, onEdit, onDelete }: ExpressionsTableProps) {
  const speak = (text: string, lang: string = 'en-US', rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (expressions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No expressions found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {expressions.map((expression) => (
        <Card key={expression._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4 items-start">
              {/* Image */}
              <div className="flex-shrink-0">
                {expression.img ? (
                  <img
                    src={expression.img}
                    alt={expression.expression}
                    className="h-28 w-28 object-cover rounded"
                  />
                ) : (
                  <div className="h-28 w-28 bg-muted rounded flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  {/* Expression Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-2xl capitalize">{expression.expression}</h3>
                      <button
                        onClick={() => speak(expression.expression, 'en-US', 1)}
                        className="p-1 border rounded hover:bg-muted transition-colors"
                        title="Play normal speed"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => speak(expression.expression, 'en-US', 0.1)}
                        className="p-1 border rounded hover:bg-muted transition-colors text-xl leading-none"
                        title="Play very slow speed"
                      >
                        🐢
                      </button>
                    </div>
                    {expression.spanish?.expression && (
                      <p className="text-lg capitalize text-blue-600 dark:text-blue-400">
                        {expression.spanish.expression}
                      </p>
                    )}
                    {expression.context && (
                      <div className="flex items-start gap-1 mt-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground italic">{expression.context}</p>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={getDifficultyVariant(expression.difficulty)}>
                      {expression.difficulty || "N/A"}
                    </Badge>
                  </div>
                </div>

                {/* Definition */}
                <p className="text-sm mb-2">{expression.definition}</p>
                
                {/* Spanish Definition */}
                {expression.spanish?.definition && (
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">
                    {expression.spanish.definition}
                  </p>
                )}

                {/* Type tags */}
                {expression.type && expression.type.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {expression.type.map((t, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(expression)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(expression)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
