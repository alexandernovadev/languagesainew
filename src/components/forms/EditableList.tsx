import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Plus } from "lucide-react";

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function EditableList({
  items,
  onChange,
  placeholder = "Añadir item...",
}: EditableListProps) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onChange(updatedItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddItem();
            }
          }}
        />
        <Button type="button" onClick={handleAddItem} variant="secondary">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 rounded-md border p-2 min-h-[80px]">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <Input
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                className="opacity-50 group-hover:opacity-100 bg-red-500/80 hover:bg-red-500 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay items.
          </p>
        )}
      </div>
    </div>
  );
} 