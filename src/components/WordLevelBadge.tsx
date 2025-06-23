import { Badge } from "@/components/ui/badge";

export function WordLevelBadge({
  level,
  className = "",
}: {
  level?: "easy" | "medium" | "hard";
  className?: string;
}) {
  const colorClass =
    level === "easy"
      ? "border-green-500 text-green-500"
      : level === "medium"
      ? "border-blue-500 text-blue-500"
      : level === "hard"
      ? "border-red-600 text-red-600"
      : "";

  return (
    <Badge
      variant="outline"
      className={`uppercase tracking-wider font-semibold px-3 py-1 ${colorClass} ${className}`}
    >
      {level}
    </Badge>
  );
} 