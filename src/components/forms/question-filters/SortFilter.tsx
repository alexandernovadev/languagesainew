import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SortFilterProps {
  sortBy?: string;
  sortOrder?: string;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

const sortOptions = [
  { value: "createdAt", label: "Fecha de creación" },
  { value: "updatedAt", label: "Fecha de actualización" },
  { value: "text", label: "Texto de la pregunta" },
  { value: "level", label: "Nivel CEFR" },
  { value: "type", label: "Tipo de pregunta" },
  { value: "difficulty", label: "Dificultad" },
];

const orderOptions = [
  { value: "desc", label: "Descendente" },
  { value: "asc", label: "Ascendente" },
];

export function SortFilter({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortFilterProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ordenar por</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Orden</Label>
        <RadioGroup value={sortOrder} onValueChange={onSortOrderChange}>
          <div className="grid grid-cols-1 gap-2">
            {orderOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`order-${option.value}`} />
                <Label htmlFor={`order-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
} 