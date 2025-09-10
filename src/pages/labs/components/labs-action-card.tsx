import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface LabsActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onAction: () => void;
  loading?: boolean;
  dangerous?: boolean;
  disabled?: boolean;
  variant?: "default" | "danger" | "warning" | "info" | "success";
}

export function LabsActionCard({
  title,
  description,
  icon: Icon,
  onAction,
  loading = false,
  dangerous = false,
  disabled = false,
  variant = "default",
}: LabsActionCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          card: "border-red-500/20 hover:border-red-500/40",
          icon: "text-red-400",
        };
      case "warning":
        return {
          card: "border-yellow-500/20 hover:border-yellow-500/40",
          icon: "text-yellow-400",
        };
      case "info":
        return {
          card: "border-blue-500/20 hover:border-blue-500/40",
          icon: "text-blue-400",
        };
      default:
        return {
          card: "border-zinc-700 hover:border-zinc-600",
          icon: "text-zinc-400",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={cn("transition-all duration-200", styles.card)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2 rounded-lg flex-shrink-0",
              styles.icon
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-zinc-100 text-lg break-words mb-2">
              {title}
            </CardTitle>
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
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ejecutar
          {dangerous && (
            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
              <AlertTriangle className="h-3 w-3 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-300">WARNING</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
