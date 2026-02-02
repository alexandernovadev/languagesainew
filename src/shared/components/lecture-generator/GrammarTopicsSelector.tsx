import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { GrammarTopicOption } from "@/types/business";
import { cn } from "@/utils/common/classnames";
import { X } from "lucide-react";

interface GrammarTopicsSelectorProps {
  topics: GrammarTopicOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
}

export function GrammarTopicsSelector({
  topics,
  selected,
  onChange,
  maxSelections = 5,
}: GrammarTopicsSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (categoryValue: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryValue)) {
        next.delete(categoryValue);
      } else {
        next.add(categoryValue);
      }
      return next;
    });
  };

  const toggleTopic = (topicValue: string) => {
    if (selected.includes(topicValue)) {
      onChange(selected.filter((t) => t !== topicValue));
    } else {
      if (selected.length >= maxSelections) {
        return; // No permitir más selecciones
      }
      onChange([...selected, topicValue]);
    }
  };

  const removeTopic = (topicValue: string) => {
    onChange(selected.filter((t) => t !== topicValue));
  };

  // Obtener el label de un topic por su value
  const getTopicLabel = (topicValue: string): string => {
    for (const category of topics) {
      const topic = category.children.find((t) => t.value === topicValue);
      if (topic) return topic.label;
    }
    return topicValue;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Temas de Gramática</Label>
        <span className="text-xs text-muted-foreground">
          {selected.length}/{maxSelections} seleccionados
        </span>
      </div>

      {/* Topics seleccionados como chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((topicValue) => (
            <div
              key={topicValue}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
            >
              <span>{getTopicLabel(topicValue)}</span>
              <button
                type="button"
                onClick={() => removeTopic(topicValue)}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lista de categorías */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
        {topics.map((category) => {
          const isExpanded = expandedCategories.has(category.value);
          const categorySelected = category.children.filter((t) =>
            selected.includes(t.value)
          );

          return (
            <div key={category.value} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-left",
                  categorySelected.length > 0 && "bg-primary/5"
                )}
              >
                <span className="font-medium text-sm">{category.label}</span>
                <span className="text-xs text-muted-foreground">
                  {categorySelected.length}/{category.children.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {category.children.map((topic) => {
                    const isSelected = selected.includes(topic.value);
                    const isDisabled =
                      !isSelected && selected.length >= maxSelections;

                    return (
                      <div
                        key={topic.value}
                        className={cn(
                          "flex items-center gap-2 p-1.5 rounded hover:bg-muted transition-colors",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleTopic(topic.value)}
                          disabled={isDisabled}
                        />
                        <label
                          className={cn(
                            "text-sm cursor-pointer flex-1",
                            isDisabled && "cursor-not-allowed"
                          )}
                          onClick={() => !isDisabled && toggleTopic(topic.value)}
                        >
                          {topic.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
