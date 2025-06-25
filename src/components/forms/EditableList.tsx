import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Plus } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

// Componente para cada item arrastrable
function DraggableItem({ id, index, item, onChange, onRemove, listeners, attributes, isDragging }: any) {
  return (
    <div
      className={`flex items-center gap-2 group transition-colors duration-150 ${isDragging ? 'ring-2 ring-primary' : ''}`}
      {...attributes}
    >
      <span {...listeners} className="flex items-center cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </span>
      <Input
        value={item}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-grow"
      />
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onRemove(index)}
        className="opacity-50 group-hover:opacity-100 bg-red-500/80 hover:bg-red-500 text-white"
        disabled={isDragging}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function EditableList({
  items,
  onChange,
  placeholder = "Añadir item...",
}: EditableListProps) {
  const [newItem, setNewItem] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item, index) => `${index}-${item}` === active.id);
      const newIndex = items.findIndex((item, index) => `${index}-${item}` === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems);
    }
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item, index) => `${index}-${item}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((item, index) => {
                  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
                    id: `${index}-${item}` 
                  });
                  const style = {
                    transform: CSS.Transform.toString(transform),
                    transition,
                  };
                  return (
                    <div ref={setNodeRef} style={style} key={`${index}-${item}`}>
                      <DraggableItem
                        id={`${index}-${item}`}
                        index={index}
                        item={item}
                        onChange={handleItemChange}
                        onRemove={handleRemoveItem}
                        listeners={listeners}
                        attributes={attributes}
                        isDragging={isDragging}
                      />
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay items.
          </p>
        )}
      </div>
    </div>
  );
}
