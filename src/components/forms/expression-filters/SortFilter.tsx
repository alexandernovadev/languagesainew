import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EXPRESSION_SORT_OPTIONS, EXPRESSION_SORT_ORDERS } from "./constants";

interface SortFilterProps {
  sortBy?: string;
  sortOrder?: string;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

export function SortFilter({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm">Ordenar por</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            {EXPRESSION_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Orden</Label>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent>
            {EXPRESSION_SORT_ORDERS.map((order) => (
              <SelectItem key={order.value} value={order.value}>
                {order.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
