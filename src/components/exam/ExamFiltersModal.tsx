import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, X } from 'lucide-react';
import { getAllLanguages } from '@/utils/common/language';
import { getAllExamLevels, getAllExamTypes } from '@/utils/common/examTypes';

interface ExamFilters {
  level: string;
  language: string;
  topic: string;
  source: string;
  adaptive: string;
  createdBy: string;
  sortBy: string;
  sortOrder: string;
  createdAfter: string;
  createdBefore: string;
}

interface ExamFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ExamFilters;
  onFiltersChange: (filters: ExamFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function ExamFiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: ExamFiltersModalProps) {
  const handleFilterChange = (key: keyof ExamFilters, value: string) => {
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

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== 'all' && value !== 'createdAt' && value !== 'desc'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80dvh] flex flex-col p-0 border border-gray-600 shadow-2xl">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Exámenes
          </DialogTitle>
          <DialogDescription>
            Configura los filtros para encontrar los exámenes que necesitas
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 px-3">
            {/* Filtros Básicos */}
            <div>
              <h3 className="text-sm font-medium mb-3">Filtros Básicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los niveles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
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
                  <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los idiomas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los idiomas</SelectItem>
                      {getAllLanguages().map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Tema</Label>
                  <Select value={filters.topic} onValueChange={(value) => handleFilterChange('topic', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los temas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los temas</SelectItem>
                      <SelectItem value="grammar">Gramática</SelectItem>
                      <SelectItem value="vocabulary">Vocabulario</SelectItem>
                      <SelectItem value="reading">Comprensión Lectora</SelectItem>
                      <SelectItem value="listening">Comprensión Auditiva</SelectItem>
                      <SelectItem value="speaking">Expresión Oral</SelectItem>
                      <SelectItem value="writing">Expresión Escrita</SelectItem>
                      <SelectItem value="pronunciation">Pronunciación</SelectItem>
                      <SelectItem value="culture">Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Origen</Label>
                  <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los orígenes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los orígenes</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="ai">Generado por IA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adaptive">Tipo de Examen</Label>
                  <Select value={filters.adaptive} onValueChange={(value) => handleFilterChange('adaptive', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="true">Adaptativo</SelectItem>
                      <SelectItem value="false">No Adaptativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="createdBy">Creado por</Label>
                  <Input
                    id="createdBy"
                    placeholder="ID del creador"
                    value={filters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Filtros de Fecha */}
            <div>
              <h3 className="text-sm font-medium mb-3">Filtros de Fecha</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="createdAfter">Creado después de</Label>
                  <Input
                    id="createdAfter"
                    type="date"
                    value={filters.createdAfter}
                    onChange={(e) => handleFilterChange('createdAfter', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="createdBefore">Creado antes de</Label>
                  <Input
                    id="createdBefore"
                    type="date"
                    value={filters.createdBefore}
                    onChange={(e) => handleFilterChange('createdBefore', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Ordenamiento */}
            <div>
              <h3 className="text-sm font-medium mb-3">Ordenamiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortBy">Ordenar por</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Fecha de creación</SelectItem>
                      <SelectItem value="updatedAt">Fecha de actualización</SelectItem>
                      <SelectItem value="title">Título</SelectItem>
                      <SelectItem value="level">Nivel</SelectItem>
                      <SelectItem value="language">Idioma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Orden</Label>
                  <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descendente</SelectItem>
                      <SelectItem value="asc">Ascendente</SelectItem>
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
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t bg-background">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar Filtros
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleApply}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 