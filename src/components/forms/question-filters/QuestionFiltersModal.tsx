import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, X, Info, Check } from "lucide-react";

import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import { LevelFilter } from "./LevelFilter";
import { TypeFilter } from "./TypeFilter";
import { DifficultyFilter } from "./DifficultyFilter";
import { BooleanFilters } from "./BooleanFilters";
import { SortFilter } from "./SortFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { TextFilters } from "./TextFilters";

interface QuestionFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: any) => void;
}

export function QuestionFiltersModal({
  open,
  onOpenChange,
  onFiltersChange,
}: QuestionFiltersModalProps) {
  const {
    filters,
    booleanFilters,
    combinedFilters,
    hasActiveFilters,
    activeFiltersCount,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  } = useQuestionFilters();

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    // No aplicar filtros inmediatamente, solo limpiar internamente
  };

  // Aplicar filtros y cerrar modal
  const handleApplyFilters = () => {
    onFiltersChange(combinedFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90dvh] flex flex-col border border-gray-600 shadow-2xl">
        {/* Header Sticky */}
        <DialogHeader className="px-6 pt-4 pb-3 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <DialogTitle>Filtros Avanzados</DialogTitle>
              {hasActiveFilters && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // No aplicar filtros al cerrar
                onOpenChange(false);
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Aplica filtros para encontrar las preguntas que necesitas.
          </DialogDescription>
        </DialogHeader>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <FiltersContent
            filters={filters}
            booleanFilters={booleanFilters}
            updateFilter={updateFilter as (key: string, value: any) => void}
            updateBooleanFilter={updateBooleanFilter}
          />
        </div>

        {/* Footer Sticky */}
        <div className="px-6 pt-2 border-t bg-background sticky z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {hasActiveFilters && (
                <>
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground ml-2">
                    {activeFiltersCount} filtro
                    {activeFiltersCount !== 1 ? "s" : ""} activo
                    {activeFiltersCount !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  // No aplicar filtros al cancelar
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleApplyFilters} className="min-w-[100px]">
                <Check className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FiltersContentProps {
  filters: any;
  booleanFilters: Record<string, boolean>;
  updateFilter: (key: string, value: any) => void;
  updateBooleanFilter: (key: string, value: boolean) => void;
}

function FiltersContent({
  filters,
  booleanFilters,
  updateFilter,
  updateBooleanFilter,
}: FiltersContentProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Básicos</TabsTrigger>
        <TabsTrigger value="content">Contenido</TabsTrigger>
        <TabsTrigger value="advanced">Avanzados</TabsTrigger>
        <TabsTrigger value="sort">Ordenar</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Nivel de Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios niveles
            </p>
            <LevelFilter
              value={filters.level}
              onChange={(value) => {
                updateFilter("level", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tipo de Pregunta</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios tipos
            </p>
            <TypeFilter
              value={filters.type}
              onChange={(value) => {
                updateFilter("type", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Dificultad</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios niveles de dificultad
            </p>
            <DifficultyFilter
              value={filters.difficulty}
              onChange={(value) => {
                updateFilter("difficulty", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Búsqueda de Texto</h4>
            <TextFilters
              topic={filters.topic}
              tags={filters.tags}
              onTopicChange={(value: string) => {
                updateFilter("topic", value);
              }}
              onTagsChange={(value: string) => {
                updateFilter("tags", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Contenido Disponible</h4>
            <BooleanFilters
              hasMedia={booleanFilters.hasMedia}
              onHasMediaChange={(value: boolean) => {
                updateBooleanFilter("hasMedia", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Fechas</h4>
            <DateRangeFilter
              createdAfter={filters.createdAfter}
              createdBefore={filters.createdBefore}
              onCreatedAfterChange={(value: string) => {
                updateFilter("createdAfter", value);
              }}
              onCreatedBeforeChange={(value: string) => {
                updateFilter("createdBefore", value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sort" className="space-y-4 mt-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Ordenamiento</h4>
          <SortFilter
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={(value: string) => {
              updateFilter("sortBy", value);
            }}
            onSortOrderChange={(value: string) => {
              updateFilter("sortOrder", value);
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
