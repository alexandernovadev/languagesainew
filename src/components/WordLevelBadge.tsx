import { Badge } from "@/components/ui/badge";

export function WordLevelBadge({
  level,
  className = "",
}: {
  level?: "easy" | "medium" | "hard";
  className?: string;
}) {
  const getLevelConfig = (level?: string) => {
    switch (level) {
      case "easy":
        return {
          variant: "default" as const,
        };
      case "medium":
        return {
          variant: "secondary" as const,
        };
      case "hard":
        return {
          variant: "destructive" as const,
        };
      default:
        return {
          variant: "outline" as const,
        };
    }
  };

  const config = getLevelConfig(level);

  return (
    <Badge variant={config.variant} className={className}>
      {level === "easy" && "Fácil"}
      {level === "medium" && "Medio"}
      {level === "hard" && "Difícil"}
      {!level && "N/A"}
    </Badge>
  );
}
