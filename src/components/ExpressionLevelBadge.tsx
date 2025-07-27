import { Badge } from "@/components/ui/badge";

interface ExpressionLevelBadgeProps {
  level: "easy" | "medium" | "hard";
  className?: string;
}

export function ExpressionLevelBadge({ level, className = "" }: ExpressionLevelBadgeProps) {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case "easy":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
        };
      case "medium":
        return {
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        };
      case "hard":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-200",
        };
      default:
        return {
          variant: "outline" as const,
          className: "",
        };
    }
  };

  const config = getLevelConfig(level);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {level === "easy" && "Fácil"}
      {level === "medium" && "Medio"}
      {level === "hard" && "Difícil"}
    </Badge>
  );
} 