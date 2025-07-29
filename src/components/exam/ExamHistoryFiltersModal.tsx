import React from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, Check, Trash2 } from "lucide-react";
import { ExamLevelFilter } from "./filters/ExamLevelFilter";
import { ExamLanguageFilter } from "./filters/ExamLanguageFilter";
import { StatusFilter } from "./history-filters/StatusFilter";
import { DateRangeFilterBadge } from "./history-filters/DateRangeFilterBadge";
import { ScoreRangeFilterBadge } from "./history-filters/ScoreRangeFilterBadge";

interface ExamHistoryFilters {
  status: string;
  level: string;
  language: string;
  dateRange: string;
  scoreRange: string;
}

interface ExamHistoryFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ExamHistoryFilters;
  searchTerm: string;
  onFiltersChange: (filters: ExamHistoryFilters) => void;
  onSearchChange: (searchTerm: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function ExamHistoryFiltersModal({
  isOpen,
  onClose,
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
}: ExamHistoryFiltersModalProps) {
  const handleFilterChange = (key: keyof ExamHistoryFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
    onClose();
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all"
  ) || searchTerm;

  return (
    <ModalNova
      open={isOpen}
      onOpenChange={onClose}
      title="Filtros de Historial"
      description="Configura los filtros para encontrar los intentos de examen que necesitas"
      size="2xl"
      height="h-[80dvh]"
      footer={
        <div className="flex justify-between items-center w-full">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar
          </Button>

          <Button onClick={handleApply}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6 px-3">
        {/* Búsqueda */}
        <div>
          <h3 className="text-sm font-medium mb-3">Búsqueda</h3>
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por título o tema</Label>
            <Input
              id="search"
              placeholder="Buscar por título o tema..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Filtros Básicos */}
        <div>
          <h3 className="text-sm font-medium mb-3">Filtros Básicos</h3>
          <div className="space-y-6">
            <StatusFilter
              value={filters.status}
              onChange={(val) => handleFilterChange("status", val || "all")}
            />

            <ExamLevelFilter
              value={filters.level}
              onChange={(val) => handleFilterChange("level", val || "all")}
            />

            <ExamLanguageFilter
              value={filters.language}
              onChange={(val) => handleFilterChange("language", val || "all")}
            />

            <DateRangeFilterBadge
              value={filters.dateRange}
              onChange={(val) => handleFilterChange("dateRange", val || "all")}
            />

            <ScoreRangeFilterBadge
              value={filters.scoreRange}
              onChange={(val) => handleFilterChange("scoreRange", val || "all")}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <Filter className="w-4 h-4 inline mr-1" />
              Hay filtros activos. Los resultados se mostrarán según los criterios seleccionados.
            </p>
          </div>
        )}
      </div>
    </ModalNova>
  );
} 