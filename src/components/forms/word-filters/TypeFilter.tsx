import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { WORD_TYPES } from "./constants";
import { ChevronDown, X } from "lucide-react";

interface TypeFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  const selectedTypes = value ? value.split(',') : [];

  const handleTypeToggle = (typeValue: string, checked: boolean) => {
    if (checked) {
      // Agregar tipo
      const newTypes = [...selectedTypes, typeValue];
      onChange(newTypes.join(','));
    } else {
      // Remover tipo
      const newTypes = selectedTypes.filter(t => t !== typeValue);
      onChange(newTypes.length > 0 ? newTypes.join(',') : undefined);
    }
  };

  const clearAll = () => {
    onChange(undefined);
  };

  const getDisplayText = () => {
    if (selectedTypes.length === 0) return "Seleccionar tipo gramatical";
    if (selectedTypes.length === 1) {
      const type = WORD_TYPES.find(t => t.value === selectedTypes[0]);
      return type?.label || selectedTypes[0];
    }
    return `${selectedTypes.length} tipos seleccionados`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Tipos Gramaticales</h4>
            {selectedTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-auto p-1 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {WORD_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={selectedTypes.includes(type.value)}
                  onCheckedChange={(checked) => 
                    handleTypeToggle(type.value, checked as boolean)
                  }
                />
                <Label htmlFor={type.value} className="text-sm font-normal cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>

          {selectedTypes.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-1">
                {selectedTypes.map((typeValue) => {
                  const type = WORD_TYPES.find(t => t.value === typeValue);
                  return (
                    <Badge
                      key={typeValue}
                      variant="secondary"
                      className="text-xs cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                    >
                      {type?.label || typeValue}
                      <button
                        onClick={() => handleTypeToggle(typeValue, false)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 