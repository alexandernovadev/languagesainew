import { IExpression } from "@/types/models/Expression";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ExpressionsTableProps {
  expressions: IExpression[];
  loading: boolean;
  onEdit: (expression: IExpression) => void;
  onDelete: (expression: IExpression) => void;
}

export function ExpressionsTable({ expressions, loading, onEdit, onDelete }: ExpressionsTableProps) {
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

  const getDifficultyVariant = (difficulty?: string): "default" | "secondary" | "yellow" | "destructive" | "blue" | "outline" => {
    switch (difficulty) {
      case "A1":
        return "default";
      case "A2":
        return "secondary";
      case "B1":
        return "yellow";
      case "B2":
        return "blue";
      case "C1":
        return "destructive";
      case "C2":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expression</TableHead>
              <TableHead>Definition</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Language</TableHead>
              <TableHead className="text-center">Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expressions.map((expression) => (
              <TableRow key={expression._id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{expression.expression}</div>
                    {expression.spanish?.expression && (
                      <div className="text-xs text-muted-foreground">
                        {expression.spanish.expression}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={expression.definition}>
                    {expression.definition}
                  </div>
                </TableCell>
                <TableCell>
                  {expression.type && expression.type.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {expression.type.slice(0, 2).map((t, idx) => (
                        <Badge key={idx} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                      {expression.type.length > 2 && (
                        <Badge variant="secondary">
                          +{expression.type.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyVariant(expression.difficulty)}>
                    {expression.difficulty || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{expression.language.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {expression.img ? (
                    <ImageIcon className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(expression)}
                      title="Edit expression"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(expression)}
                      title="Delete expression"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
