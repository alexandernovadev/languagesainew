import { Button } from "@/shared/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface WordDetailHeaderProps {
  onRefreshAll: () => void;
  loading: boolean;
}

export function WordDetailHeader({ onRefreshAll, loading }: WordDetailHeaderProps) {
  return (
    <div className="relative">
      <Button
        onClick={onRefreshAll}
        disabled={loading}
        variant="outline"
        size="sm"
        className={cn(
          "absolute right-4 top-4 z-10",
          loading && "animate-pulse"
        )}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {loading ? "Generando..." : "Refresh AI"}
      </Button>
    </div>
  );
}
