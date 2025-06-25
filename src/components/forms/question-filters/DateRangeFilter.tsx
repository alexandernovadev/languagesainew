import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  createdAfter?: string;
  createdBefore?: string;
  onCreatedAfterChange: (value: string) => void;
  onCreatedBeforeChange: (value: string) => void;
}

export function DateRangeFilter({ 
  createdAfter, 
  createdBefore, 
  onCreatedAfterChange, 
  onCreatedBeforeChange 
}: DateRangeFilterProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="createdAfter" className="text-sm font-medium">
          Creado después de
        </Label>
        <Input
          id="createdAfter"
          type="datetime-local"
          value={createdAfter || ""}
          onChange={(e) => onCreatedAfterChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="createdBefore" className="text-sm font-medium">
          Creado antes de
        </Label>
        <Input
          id="createdBefore"
          type="datetime-local"
          value={createdBefore || ""}
          onChange={(e) => onCreatedBeforeChange(e.target.value)}
        />
      </div>
    </div>
  );
} 