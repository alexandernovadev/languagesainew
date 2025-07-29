import React from 'react';
import { Input } from '@/components/ui/input';

interface ExamSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export function ExamSearchAndFilters({
  searchTerm,
  onSearchChange,
  onSearch,
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