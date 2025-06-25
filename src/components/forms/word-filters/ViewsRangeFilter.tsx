import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ViewsRangeFilterProps {
  seenMin?: number;
  seenMax?: number;
  onSeenMinChange: (value: number | undefined) => void;
  onSeenMaxChange: (value: number | undefined) => void;
}

export function ViewsRangeFilter({ 
  seenMin, 
  seenMax, 
  onSeenMinChange, 
  onSeenMaxChange 
}: ViewsRangeFilterProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="seenMin" className="text-sm font-medium">
          Mínimo de vistas
        </Label>
        <Input
          id="seenMin"
          type="number"
          min="0"
          placeholder="0"
          value={seenMin || ""}
          onChange={(e) => {
            const value = e.target.value;
            onSeenMinChange(value ? parseInt(value) : undefined);
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seenMax" className="text-sm font-medium">
          Máximo de vistas
        </Label>
        <Input
          id="seenMax"
          type="number"
          min="0"
          placeholder="100"
          value={seenMax || ""}
          onChange={(e) => {
            const value = e.target.value;
            onSeenMaxChange(value ? parseInt(value) : undefined);
          }}
        />
      </div>
    </div>
  );
} 