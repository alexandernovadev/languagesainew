import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X as XIcon } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row gap-4 mx-2">
      <div className="relative flex-1 mb-3">
        <Input
          placeholder="Buscar exámenes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="pr-8"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("");
              onSearch();
            }}
            className="absolute right-1 top-1 h-6 w-6 p-0"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 