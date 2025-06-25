import { useState, useEffect } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Info,
} from "lucide-react";

import { useWordFilters } from "@/hooks/useWordFilters";
import { LevelFilter } from "./LevelFilter";
import { LanguageFilter } from "./LanguageFilter";
import { TypeFilter } from "./TypeFilter";
import { BooleanFilters } from "./BooleanFilters";
import { SortFilter } from "./SortFilter";
import { ViewsRangeFilter } from "./ViewsRangeFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { TextFilters } from "./TextFilters";

interface WordFiltersProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export function WordFilters({ onFiltersChange, className }: WordFiltersProps) {
  const {
    filters,
    booleanFilters,
    combinedFilters,
    hasActiveFilters,
    activeFiltersCount,
    getActiveFiltersDescription,
    updateFilter,
    updateBooleanFilter,
    clearFilters,
  } = useWordFilters();

  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Aplicar filtros cuando cambien usando useEffect
  useEffect(() => {
    onFiltersChange(combinedFilters);
  }, [combinedFilters]);

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange({});
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
                Aplica filtros para encontrar las palabras que necesitas.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <FiltersContent
                filters={filters}
                booleanFilters={booleanFilters}
                updateFilter={updateFilter as (key: string, value: any) => void}
                updateBooleanFilter={updateBooleanFilter}
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
                      <Badge variant="secondary">
                        {activeFiltersCount}
                      </Badge>
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
                  updateFilter={updateFilter as (key: string, value: any) => void}
                  updateBooleanFilter={updateBooleanFilter}
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
            <h4 className="text-sm font-medium mb-2">Idioma</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Selecciona uno o varios idiomas
            </p>
            <LanguageFilter
              value={filters.language}
              onChange={(value) => {
                updateFilter("language", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Tipo Gramatical</h4>
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
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Búsqueda de Texto</h4>
            <TextFilters
              definition={filters.definition}
              IPA={filters.IPA}
              spanishWord={filters.spanishWord}
              spanishDefinition={filters.spanishDefinition}
              onDefinitionChange={(value) => {
                updateFilter("definition", value);
              }}
              onIPAChange={(value) => {
                updateFilter("IPA", value);
              }}
              onSpanishWordChange={(value) => {
                updateFilter("spanishWord", value);
              }}
              onSpanishDefinitionChange={(value) => {
                updateFilter("spanishDefinition", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Contenido Disponible</h4>
            <BooleanFilters
              values={booleanFilters}
              onChange={(key, value) => {
                updateBooleanFilter(key, value);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Vistas</h4>
            <ViewsRangeFilter
              seenMin={filters.seenMin}
              seenMax={filters.seenMax}
              onSeenMinChange={(value) => {
                updateFilter("seenMin", value);
              }}
              onSeenMaxChange={(value) => {
                updateFilter("seenMax", value);
              }}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Rango de Fechas</h4>
            <DateRangeFilter
              createdAfter={filters.createdAfter}
              createdBefore={filters.createdBefore}
              updatedAfter={filters.updatedAfter}
              updatedBefore={filters.updatedBefore}
              onCreatedAfterChange={(value) => {
                updateFilter("createdAfter", value);
              }}
              onCreatedBeforeChange={(value) => {
                updateFilter("createdBefore", value);
              }}
              onUpdatedAfterChange={(value) => {
                updateFilter("updatedAfter", value);
              }}
              onUpdatedBeforeChange={(value) => {
                updateFilter("updatedBefore", value);
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
            onSortByChange={(value) => {
              updateFilter("sortBy", value);
            }}
            onSortOrderChange={(value) => {
              updateFilter("sortOrder", value);
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
} 