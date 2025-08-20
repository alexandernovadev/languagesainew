import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFiltersProps {
  definition?: string;
  expression?: string;
  IPA?: string;
  spanishWord?: string;
  spanishExpression?: string;
  spanishDefinition?: string;
  onDefinitionChange?: (value: string) => void;
  onExpressionChange?: (value: string) => void;
  onIPAChange?: (value: string) => void;
  onSpanishWordChange?: (value: string) => void;
  onSpanishExpressionChange?: (value: string) => void;
  onSpanishDefinitionChange?: (value: string) => void;
}

export function TextFilters({
  definition,
  expression,
  IPA,
  spanishWord,
  spanishExpression,
  spanishDefinition,
  onDefinitionChange,
  onExpressionChange,
  onIPAChange,
  onSpanishWordChange,
  onSpanishExpressionChange,
  onSpanishDefinitionChange,
}: TextFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {onDefinitionChange && (
        <div className="space-y-2">
          <Label className="text-sm">Definición</Label>
          <Input
            placeholder="Buscar en definición..."
            value={definition || ""}
            onChange={(e) => onDefinitionChange(e.target.value)}
          />
        </div>
      )}

      {onExpressionChange && (
        <div className="space-y-2">
          <Label className="text-sm">Expresión</Label>
          <Input
            placeholder="Buscar expresión..."
            value={expression || ""}
            onChange={(e) => onExpressionChange(e.target.value)}
          />
        </div>
      )}

      {onIPAChange && (
        <div className="space-y-2">
          <Label className="text-sm">IPA</Label>
          <Input
            placeholder="Buscar en IPA..."
            value={IPA || ""}
            onChange={(e) => onIPAChange(e.target.value)}
          />
        </div>
      )}

      {onSpanishWordChange && (
        <div className="space-y-2">
          <Label className="text-sm">Palabra en Español</Label>
          <Input
            placeholder="Buscar palabra en español..."
            value={spanishWord || ""}
            onChange={(e) => onSpanishWordChange(e.target.value)}
          />
        </div>
      )}

      {onSpanishExpressionChange && (
        <div className="space-y-2">
          <Label className="text-sm">Expresión en Español</Label>
          <Input
            placeholder="Buscar expresión en español..."
            value={spanishExpression || ""}
            onChange={(e) => onSpanishExpressionChange(e.target.value)}
          />
        </div>
      )}

      {onSpanishDefinitionChange && (
        <div className="space-y-2">
          <Label className="text-sm">Definición en Español</Label>
          <Input
            placeholder="Buscar definición en español..."
            value={spanishDefinition || ""}
            onChange={(e) => onSpanishDefinitionChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
