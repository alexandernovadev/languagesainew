import { Button } from "@/shared/components/ui/button";
import { Sparkles } from "lucide-react";
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
        size="icon"
        title="Refresh AI"
        className="absolute right-4 top-4 z-10 h-9 w-9"
      >
        <Sparkles className={cn("h-4 w-4", loading && "animate-spin")} />
      </Button>
    </div>
  );
}
