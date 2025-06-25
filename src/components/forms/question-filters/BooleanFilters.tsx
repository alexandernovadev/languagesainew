import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BooleanFiltersProps {
  hasMedia: boolean;
  onHasMediaChange: (value: boolean) => void;
}

export function BooleanFilters({ hasMedia, onHasMediaChange }: BooleanFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Con multimedia</Label>
          <p className="text-xs text-muted-foreground">
            Solo preguntas que incluyan audio, imagen o video
          </p>
        </div>
        <Switch
          checked={hasMedia}
          onCheckedChange={onHasMediaChange}
        />
      </div>
    </div>
  );
} 