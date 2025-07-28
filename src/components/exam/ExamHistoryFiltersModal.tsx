import React from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, X, Check, Trash2 } from "lucide-react";
import { getAllLanguages } from "@/utils/common/language";
import { getAllExamLevels } from "@/utils/common/examTypes";

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="submitted">Enviado</SelectItem>
                  <SelectItem value="graded">Calificado</SelectItem>
                  <SelectItem value="abandoned">Abandonado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Nivel</Label>
              <Select
                value={filters.level}
                onValueChange={(value) => handleFilterChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {getAllExamLevels().map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={filters.language}
                onValueChange={(value) => handleFilterChange("language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {getAllLanguages().map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Rango de Fecha</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) => handleFilterChange("dateRange", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scoreRange">Rango de Puntuación</Label>
              <Select
                value={filters.scoreRange}
                onValueChange={(value) => handleFilterChange("scoreRange", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="excellent">Excelente (90%+)</SelectItem>
                  <SelectItem value="good">Bueno (80-89%)</SelectItem>
                  <SelectItem value="average">Promedio (70-79%)</SelectItem>
                  <SelectItem value="below">Por debajo (70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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