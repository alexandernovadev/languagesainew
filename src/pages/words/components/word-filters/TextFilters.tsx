import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFiltersProps {
  definition?: string;
  IPA?: string;
  spanishWord?: string;
  spanishDefinition?: string;
  onDefinitionChange: (value: string | undefined) => void;
  onIPAChange: (value: string | undefined) => void;
  onSpanishWordChange: (value: string | undefined) => void;
  onSpanishDefinitionChange: (value: string | undefined) => void;
}

export function TextFilters({
  definition,
  IPA,
  spanishWord,
  spanishDefinition,
  onDefinitionChange,
  onIPAChange,
  onSpanishWordChange,
  onSpanishDefinitionChange,
}: TextFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="definition" className="text-sm font-medium">
          Definición (contiene)
        </Label>
        <Input
          id="definition"
          placeholder="Buscar en definición..."
          value={definition || ""}
          onChange={(e) => onDefinitionChange(e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="IPA" className="text-sm font-medium">
          Fonética (IPA)
        </Label>
        <Input
          id="IPA"
          placeholder="/rʌn/"
          value={IPA || ""}
          onChange={(e) => onIPAChange(e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spanishWord" className="text-sm font-medium">
          Palabra en Español
        </Label>
        <Input
          id="spanishWord"
          placeholder="Buscar palabra en español..."
          value={spanishWord || ""}
          onChange={(e) => onSpanishWordChange(e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spanishDefinition" className="text-sm font-medium">
          Definición en Español
        </Label>
        <Input
          id="spanishDefinition"
          placeholder="Buscar en definición en español..."
          value={spanishDefinition || ""}
          onChange={(e) =>
            onSpanishDefinitionChange(e.target.value || undefined)
          }
        />
      </div>
    </div>
  );
}
