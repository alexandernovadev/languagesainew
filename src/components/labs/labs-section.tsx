import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/common/classnames";

interface LabsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "info";
}

export function LabsSection({
  title,
  description,
  icon: Icon,
  children,
  variant = "default",
}: LabsSectionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          header: "border-red-500/20 bg-red-950/10",
          icon: "text-red-400",
          title: "text-red-100",
        };
      case "warning":
        return {
          header: "border-yellow-500/20 bg-yellow-950/10",
          icon: "text-yellow-400",
          title: "text-yellow-100",
        };
      case "info":
        return {
          header: "border-blue-500/20 bg-blue-950/10",
          icon: "text-blue-400",
          title: "text-blue-100",
        };
      default:
        return {
          header: "border-zinc-700 bg-zinc-900/50",
          icon: "text-zinc-400",
          title: "text-zinc-100",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className="border-zinc-800 bg-zinc-900/30">
      <CardHeader className={cn("pb-4", styles.header)}>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-zinc-800/50", styles.icon)}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className={cn("text-xl", styles.title)}>
              {title}
            </CardTitle>
            <p className="text-zinc-400 text-sm mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
