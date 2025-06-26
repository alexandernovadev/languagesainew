import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, SORT_ORDERS } from "./constants";

interface SortFilterProps {
  sortBy?: string;
  sortOrder?: string;
  onSortByChange: (value: string | undefined) => void;
  onSortOrderChange: (value: string | undefined) => void;
}

export function SortFilter({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortFilterProps) {
  return (
    <div className="flex gap-2">
      <Select
        value={sortBy || ""}
        onValueChange={(val) =>
          onSortByChange(val === "none" ? undefined : val)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sin ordenar</SelectItem>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortOrder || ""}
        onValueChange={(val) => onSortOrderChange(val === "" ? undefined : val)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Seleccionar orden" />
        </SelectTrigger>
        <SelectContent>
          {SORT_ORDERS.map((order) => (
            <SelectItem key={order.value} value={order.value}>
              {order.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
