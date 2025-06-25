import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  onCreatedAfterChange: (value: string | undefined) => void;
  onCreatedBeforeChange: (value: string | undefined) => void;
  onUpdatedAfterChange: (value: string | undefined) => void;
  onUpdatedBeforeChange: (value: string | undefined) => void;
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
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Fecha de Creación</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="createdAfter" className="text-xs">
              Después de
            </Label>
            <Input
              id="createdAfter"
              type="datetime-local"
              value={createdAfter || ""}
              onChange={(e) => onCreatedAfterChange(e.target.value || undefined)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="createdBefore" className="text-xs">
              Antes de
            </Label>
            <Input
              id="createdBefore"
              type="datetime-local"
              value={createdBefore || ""}
              onChange={(e) => onCreatedBeforeChange(e.target.value || undefined)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Fecha de Actualización</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="updatedAfter" className="text-xs">
              Después de
            </Label>
            <Input
              id="updatedAfter"
              type="datetime-local"
              value={updatedAfter || ""}
              onChange={(e) => onUpdatedAfterChange(e.target.value || undefined)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="updatedBefore" className="text-xs">
              Antes de
            </Label>
            <Input
              id="updatedBefore"
              type="datetime-local"
              value={updatedBefore || ""}
              onChange={(e) => onUpdatedBeforeChange(e.target.value || undefined)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 