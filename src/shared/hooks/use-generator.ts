import { useState } from "react";

interface GeneratorFilters {
  topic: string;
  level: string;
  difficulty: string;
  [key: string]: string;
}

export function useGenerator() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<GeneratorFilters>({
    topic: "",
    level: "",
    difficulty: "",
    objectives: "",
  });

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFilterOpen(false);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      topic: "",
      level: "",
      difficulty: "",
      objectives: "",
    });
  };

  return {
    isFilterOpen,
    setIsFilterOpen,
    filters,
    updateFilter,
    handleFilterSubmit,
    resetFilters,
  };
}
