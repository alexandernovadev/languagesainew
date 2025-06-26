import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextFiltersProps {
  topic?: string;
  tags?: string;
  onTopicChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export function TextFilters({
  topic,
  tags,
  onTopicChange,
  onTagsChange,
}: TextFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-medium">
          Tema
        </Label>
        <Input
          id="topic"
          placeholder="Buscar por tema..."
          value={topic || ""}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium">
          Etiquetas
        </Label>
        <Textarea
          id="tags"
          placeholder="Etiquetas separadas por comas (ej: grammar,vocabulary,reading)"
          value={tags || ""}
          onChange={(e) => onTagsChange(e.target.value)}
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Ingresa las etiquetas separadas por comas para filtrar preguntas que
          contengan esas etiquetas.
        </p>
      </div>
    </div>
  );
}
