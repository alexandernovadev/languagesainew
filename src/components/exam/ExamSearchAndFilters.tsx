import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface ExamSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onFiltersClick: () => void;
  onRefresh: () => void;
  hasActiveFilters: boolean;
  loading: boolean;
}

export function ExamSearchAndFilters({
  searchTerm,
  onSearchChange,
  onSearch,
  onFiltersClick,
  onRefresh,
  hasActiveFilters,
  loading,
}: ExamSearchAndFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex gap-2 flex-1">
        <Input
          placeholder="Buscar exámenes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button onClick={onSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onFiltersClick}
          className={`h-10 w-10 p-0 ${hasActiveFilters ? "border-blue-500 text-blue-600" : ""}`}
          title="Filtros"
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters && (
                                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0">
              !
            </Badge>
          )}
        </Button>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 