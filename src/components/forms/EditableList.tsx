import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

// Comentario: Asegúrate de que el contenedor padre NO tenga overflow:hidden para que el drag & drop funcione correctamente.

// Utilidad para mapear items a objetos con id único
function withIds(items: string[], ids: string[]) {
  return items.map((item, idx) => ({ id: ids[idx], value: item }));
}

// Componente para cada item arrastrable
function DraggableItem({
  id,
  index,
  item,
  onChange,
  onRemove,
  listeners,
  attributes,
  isDragging,
}: any) {
  return (
    <div
      className={`flex items-center gap-2 group transition-colors duration-150 ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
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
  const [ids, setIds] = useState<string[]>(() => items.map(() => uuidv4()));

  // Sincronizar ids si cambia la longitud de items
  if (items.length !== ids.length) {
    setIds((prev) => {
      if (items.length > prev.length) {
        // Se agregó un item
        return [
          ...prev,
          ...Array(items.length - prev.length)
            .fill(0)
            .map(() => uuidv4()),
        ];
      } else {
        // Se eliminó un item
        return prev.slice(0, items.length);
      }
    });
  }

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
      setIds((prev) => [...prev, uuidv4()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onChange(updatedItems);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = ids.findIndex((id) => id === active.id);
      const newIndex = ids.findIndex((id) => id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newIds = arrayMove(ids, oldIndex, newIndex);
      onChange(newItems);
      setIds(newIds);
      toast("¡Orden cambiado!", {
        description: `Nuevo orden: ${newItems.join(", ")}`,
        duration: 1500,
      });
    }
  };

  const itemsWithIds = withIds(items, ids);

  return (
    <div className="space-y-2">
      {/* Asegúrate de que el padre de este componente NO tenga overflow:hidden */}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {itemsWithIds.map((itemObj, index) => {
                  const {
                    attributes,
                    listeners,
                    setNodeRef,
                    transform,
                    transition,
                    isDragging,
                  } = useSortable({
                    id: itemObj.id,
                  });
                  const style = {
                    transform: CSS.Transform.toString(transform),
                    transition,
                  };
                  return (
                    <div ref={setNodeRef} style={style} key={itemObj.id}>
                      <DraggableItem
                        id={itemObj.id}
                        index={index}
                        item={itemObj.value}
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
