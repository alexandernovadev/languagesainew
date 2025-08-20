import { Badge } from "@/components/ui/badge";
import { LECTURE_SORT_OPTIONS, LECTURE_SORT_ORDERS } from "./constants";

interface SortFilterProps {
  sortBy?: string;
  sortOrder?: string;
  onSortByChange: (value: string | undefined) => void;
  onSortOrderChange: (value: string | undefined) => void;
}

export function SortFilter({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortFilterProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Ordenar por</h4>
        <div className="flex flex-wrap gap-2">
          {LECTURE_SORT_OPTIONS.map((option) => {
            const isSelected = sortBy === option.value;
            return (
              <Badge
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => onSortByChange(isSelected ? undefined : option.value)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Orden</h4>
        <div className="flex flex-wrap gap-2">
          {LECTURE_SORT_ORDERS.map((order) => {
            const isSelected = sortOrder === order.value;
            return (
              <Badge
                key={order.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => onSortOrderChange(isSelected ? undefined : order.value)}
              >
                {order.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
