import { Button } from "@/shared/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DangerZoneItemProps {
  title: string;
  description: string;
  loading: boolean;
  onDelete: () => void;
}

export function DangerZoneItem({ title, description, loading, onDelete }: DangerZoneItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base sm:text-lg">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">{description}</p>
      </div>
      <Button
        onClick={onDelete}
        disabled={loading}
        variant="destructive"
        className="w-full sm:w-auto flex-shrink-0"
        size="sm"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </>
        )}
      </Button>
    </div>
  );
}
