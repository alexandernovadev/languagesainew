import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Info,
} from "lucide-react";

import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import { LevelFilter } from "./LevelFilter";
import { TypeFilter } from "./TypeFilter";
import { DifficultyFilter } from "./DifficultyFilter";
import { BooleanFilters } from "./BooleanFilters";
import { SortFilter } from "./SortFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { TextFilters } from "./TextFilters";
import { QuestionFiltersProps } from "./types";

export function QuestionFilters({
  onFiltersChange,
  className,
}: QuestionFiltersProps) {
  const {
    filters,
    booleanFilters,
    hasActiveFilters,
    activeFiltersCount,
    getActiveFiltersDescription,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  } = useQuestionFilters();

  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange({});
  };

  // Wrapper para updateFilter que también llama a onFiltersChange
  const handleFilterChange = (key: string, value: any) => {
    updateFilter(key as any, value);
    // Crear un nuevo objeto con el filtro actualizado
    const newFilters = { ...filters, [key]: value };
    const newCombined = { ...newFilters };
    if (booleanFilters.hasMedia) {
      newCombined.hasMedia = "true";
    }
    onFiltersChange(newCombined);
  };

  // Wrapper para updateBooleanFilter que también llama a onFiltersChange
  const handleBooleanFilterChange = (key: string, value: boolean) => {
    updateBooleanFilter(key as any, value);
    // Crear un nuevo objeto con el filtro booleano actualizado
    const newCombined = { ...filters };
    if (key === "hasMedia" && value) {
      newCombined.hasMedia = "true";
    } else if (key === "hasMedia" && !value) {
      delete newCombined.hasMedia;
    }
    onFiltersChange(newCombined);
  };

  return (
    <div className={className}>
      {/* Filtros móviles - Sheet */}
      <div className="block md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Filtros Avanzados</SheetTitle>
              <SheetDescription>
                Aplica filtros para encontrar las preguntas que necesitas.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <FiltersContent
                filters={filters}
                booleanFilters={booleanFilters}
                updateFilter={handleFilterChange}
                updateBooleanFilter={handleBooleanFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filtros desktop - Collapsible */}
      <div className="hidden md:block">
        <Card>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros Avanzados
                    {hasActiveFilters && (
                      <Badge variant="secondary">{activeFiltersCount}</Badge>
                    )}
                  </CardTitle>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <FiltersContent
                  filters={filters}
                  booleanFilters={booleanFilters}
                  updateFilter={handleFilterChange}
                  updateBooleanFilter={handleBooleanFilterChange}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>

      {/* Información de filtros activos */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Filtros activos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getActiveFiltersDescription.map((description, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {description}
              </Badge>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
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
      {/* Contenedor con scroll horizontal en móvil */}
      <div className="max-sm:overflow-x-auto max-sm:pb-2">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 max-sm:flex max-sm:w-max max-sm:min-w-full">
          <TabsTrigger value="basic" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <span className="max-sm:hidden sm:inline">Básicos</span>
            <span className="sm:hidden">Básicos</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <span className="max-sm:hidden sm:inline">Contenido</span>
            <span className="sm:hidden">Contenido</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <span className="max-sm:hidden sm:inline">Avanzados</span>
            <span className="sm:hidden">Avanzados</span>
          </TabsTrigger>
          <TabsTrigger value="sort" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
            <span className="max-sm:hidden sm:inline">Ordenar</span>
            <span className="sm:hidden">Ordenar</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="basic" className="space-y-6">
        <LevelFilter
          value={filters.level}
          onChange={(value) => updateFilter("level", value)}
        />
        <Separator />
        <TypeFilter
          value={filters.type}
          onChange={(value) => updateFilter("type", value)}
        />
        <Separator />
        <DifficultyFilter
          value={filters.difficulty}
          onChange={(value) => updateFilter("difficulty", value)}
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <TextFilters
          topic={filters.topic}
          tags={filters.tags}
          onTopicChange={(value) => updateFilter("topic", value)}
          onTagsChange={(value) => updateFilter("tags", value)}
        />
        <Separator />
        <BooleanFilters
          hasMedia={booleanFilters.hasMedia}
          onHasMediaChange={(value) => updateBooleanFilter("hasMedia", value)}
        />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <DateRangeFilter
          createdAfter={filters.createdAfter}
          createdBefore={filters.createdBefore}
          onCreatedAfterChange={(value) => updateFilter("createdAfter", value)}
          onCreatedBeforeChange={(value) =>
            updateFilter("createdBefore", value)
          }
        />
      </TabsContent>

      <TabsContent value="sort" className="space-y-6">
        <SortFilter
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortByChange={(value) => updateFilter("sortBy", value)}
          onSortOrderChange={(value) => updateFilter("sortOrder", value)}
        />
      </TabsContent>
    </Tabs>
  );
}
