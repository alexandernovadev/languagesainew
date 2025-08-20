import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LECTURE_SORT_OPTIONS, LECTURE_SORT_ORDERS } from "./constants";

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
        value={sortBy || "none"}
        onValueChange={(val) =>
          onSortByChange(val === "none" ? undefined : val)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sin ordenar</SelectItem>
          {LECTURE_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortOrder || "asc"}
        onValueChange={(val) => onSortOrderChange(val === "asc" ? undefined : val)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Seleccionar orden" />
        </SelectTrigger>
        <SelectContent>
          {LECTURE_SORT_ORDERS.map((order) => (
            <SelectItem key={order.value} value={order.value}>
              {order.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
