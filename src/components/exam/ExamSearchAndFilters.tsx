import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

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
      </div>
    </div>
  );
} 