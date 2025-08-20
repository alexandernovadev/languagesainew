import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  onCreatedAfterChange?: (value: string) => void;
  onCreatedBeforeChange?: (value: string) => void;
  onUpdatedAfterChange?: (value: string) => void;
  onUpdatedBeforeChange?: (value: string) => void;
}

export function DateRangeFilter({
  createdAfter,
  createdBefore,
  updatedAfter,
  updatedBefore,
  onCreatedAfterChange,
  onCreatedBeforeChange,
  onUpdatedAfterChange,
  onUpdatedBeforeChange,
}: DateRangeFilterProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {onCreatedAfterChange && onCreatedBeforeChange && (
        <>
          <div className="space-y-2">
            <Label className="text-sm">Creado desde</Label>
            <Input
              type="date"
              value={createdAfter || ""}
              onChange={(e) => onCreatedAfterChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Creado hasta</Label>
            <Input
              type="date"
              value={createdBefore || ""}
              onChange={(e) => onCreatedBeforeChange(e.target.value)}
            />
          </div>
        </>
      )}

      {onUpdatedAfterChange && onUpdatedBeforeChange && (
        <>
          <div className="space-y-2">
            <Label className="text-sm">Actualizado desde</Label>
            <Input
              type="date"
              value={updatedAfter || ""}
              onChange={(e) => onUpdatedAfterChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Actualizado hasta</Label>
            <Input
              type="date"
              value={updatedBefore || ""}
              onChange={(e) => onUpdatedBeforeChange(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
