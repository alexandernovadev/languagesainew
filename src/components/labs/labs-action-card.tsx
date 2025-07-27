import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface LabsActionCardProps {
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  onAction: () => void;
  loading?: boolean;
  dangerous?: boolean;
  requiresAuth?: boolean;
  disabled?: boolean;
  variant?: "default" | "danger" | "warning" | "info";
}

export function LabsActionCard({
  title,
  description,
  category,
  icon: Icon,
  onAction,
  loading = false,
  dangerous = false,
  requiresAuth = false,
  disabled = false,
  variant = "default",
}: LabsActionCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          card: "border-red-500/20 bg-red-950/10 hover:bg-red-950/20",
          icon: "text-red-400",
        };
      case "warning":
        return {
          card: "border-yellow-500/20 bg-yellow-950/10 hover:bg-yellow-950/20",
          icon: "text-yellow-400",
        };
      case "info":
        return {
          card: "border-blue-500/20 bg-blue-950/10 hover:bg-blue-950/20",
          icon: "text-blue-400",
        };
      default:
        return {
          card: "border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/80",
          icon: "text-zinc-400",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={cn("transition-all duration-200", styles.card)}>
            <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg bg-zinc-800/50 flex-shrink-0", styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-zinc-100 text-lg break-words">{title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary">
                {category}
              </Badge>
              {dangerous && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  PELIGROSO
                </Badge>
              )}
              {requiresAuth && (
                <Badge variant="secondary">
                  Requiere Auth
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-zinc-400 text-sm mb-4 leading-relaxed break-words">
          {description}
        </p>
        <Button
          onClick={onAction}
          disabled={loading || disabled}
          variant={dangerous ? "destructive" : "default"}
          className={cn(
            "w-full",
            dangerous && "bg-red-600 hover:bg-red-700 text-white"
          )}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {dangerous ? "Ejecutar (PELIGROSO)" : "Ejecutar"}
        </Button>
      </CardContent>
    </Card>
  );
} 