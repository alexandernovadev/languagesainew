import { useState, useEffect } from "react";
import { ModalNova } from "../ui/modal-nova";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DatePicker } from "../ui/date-picker";
import { certificationLevelsJson, languagesJson, readingTypesJson } from "@/data/bussiness/shared";
import { LectureFilters } from "@/shared/hooks/useLectures";
import { Filter, Eraser, SlidersHorizontal, Image, Calendar } from "lucide-react";

interface LectureFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: LectureFilters;
  onApplyFilters: (filters: LectureFilters) => void;
  onClearFilters: () => void;
}

export function LectureFiltersModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: LectureFiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<LectureFilters>(filters);

  // Sync local filters with props when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    onOpenChange(false);
  };

  const updateFilter = (key: keyof LectureFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === "all" ? undefined : value,
    }));
  };

  // Handle multiple selection for level, language, typeWrite
  const toggleMultiSelect = (key: "level" | "language" | "typeWrite", value: string) => {
    setLocalFilters((prev) => {
      const current = prev[key];
      const currentArray = Array.isArray(current) ? current : current ? [current] : [];
      
      if (currentArray.includes(value)) {
        // Remove if already selected
        const newArray = currentArray.filter((v) => v !== value);
        return {
          ...prev,
          [key]: newArray.length > 0 ? newArray : undefined,
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [key]: [...currentArray, value],
        };
      }
    });
  };

  // Check if a value is selected in multi-select
  const isSelected = (key: "level" | "language" | "typeWrite", value: string): boolean => {
    const current = localFilters[key];
    if (!current) return false;
    const currentArray = Array.isArray(current) ? current : [current];
    return currentArray.includes(value);
  };

  // Count active filters (excluding page and limit)
  const activeFiltersCount = Object.entries(localFilters).filter(([key, value]) => {
    if (key === "page" || key === "limit") return false;
    if (value === undefined || value === "") return false;
    // For arrays, check if they have at least one item
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }).length;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span>Filtros Avanzados</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
      }
      description="Refina tu búsqueda de lecturas con múltiples filtros"
      size="3xl"
      height="h-[80dvh]"
      footer={
        <div className="flex gap-2 justify-between w-full">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={activeFiltersCount === 0}
            title="Limpiar filtros"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleApply}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      }
    >
      <div className="px-6 py-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Características
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Avanzado
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar en contenido</Label>
                <Input
                  id="search"
                  placeholder="Buscar en contenido de lectura..."
                  value={localFilters.search || ""}
                  onChange={(e) => updateFilter("search", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Dificultad</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {certificationLevelsJson.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level.value}`}
                        checked={isSelected("level", level.value)}
                        onCheckedChange={() => toggleMultiSelect("level", level.value)}
                      />
                      <Label
                        htmlFor={`level-${level.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {languagesJson.map((lang) => (
                    <div key={lang.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${lang.value}`}
                        checked={isSelected("language", lang.value)}
                        onCheckedChange={() => toggleMultiSelect("language", lang.value)}
                      />
                      <Label
                        htmlFor={`language-${lang.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {lang.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Lectura</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {readingTypesJson.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`typeWrite-${type.value}`}
                        checked={isSelected("typeWrite", type.value)}
                        onCheckedChange={() => toggleMultiSelect("typeWrite", type.value)}
                      />
                      <Label
                        htmlFor={`typeWrite-${type.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeMin">Tiempo Mínimo (min)</Label>
                <Input
                  id="timeMin"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={localFilters.timeMin || ""}
                  onChange={(e) => updateFilter("timeMin", e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeMax">Tiempo Máximo (min)</Label>
                <Input
                  id="timeMax"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={localFilters.timeMax || ""}
                  onChange={(e) => updateFilter("timeMax", e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hasImg">Tiene Imagen</Label>
                <Select
                  value={localFilters.hasImg || "all"}
                  onValueChange={(value) => updateFilter("hasImg", value)}
                >
                  <SelectTrigger id="hasImg">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="true">Con imagen</SelectItem>
                    <SelectItem value="false">Sin imagen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasUrlAudio">Tiene Audio</Label>
                <Select
                  value={localFilters.hasUrlAudio || "all"}
                  onValueChange={(value) => updateFilter("hasUrlAudio", value)}
                >
                  <SelectTrigger id="hasUrlAudio">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="true">Con audio</SelectItem>
                    <SelectItem value="false">Sin audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Created Date Range */}
              <div className="space-y-2">
                <Label>Fecha de Creación</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="createdAfter" className="text-xs text-muted-foreground">
                      Desde
                    </Label>
                    <DatePicker
                      value={localFilters.createdAfter ? new Date(localFilters.createdAfter) : undefined}
                      onChange={(date) => updateFilter("createdAfter", date?.toISOString())}
                      placeholder="Desde..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdBefore" className="text-xs text-muted-foreground">
                      Hasta
                    </Label>
                    <DatePicker
                      value={localFilters.createdBefore ? new Date(localFilters.createdBefore) : undefined}
                      onChange={(date) => updateFilter("createdBefore", date?.toISOString())}
                      placeholder="Hasta..."
                    />
                  </div>
                </div>
              </div>

              {/* Updated Date Range */}
              <div className="space-y-2">
                <Label>Fecha de Actualización</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="updatedAfter" className="text-xs text-muted-foreground">
                      Desde
                    </Label>
                    <DatePicker
                      value={localFilters.updatedAfter ? new Date(localFilters.updatedAfter) : undefined}
                      onChange={(date) => updateFilter("updatedAfter", date?.toISOString())}
                      placeholder="Desde..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updatedBefore" className="text-xs text-muted-foreground">
                      Hasta
                    </Label>
                    <DatePicker
                      value={localFilters.updatedBefore ? new Date(localFilters.updatedBefore) : undefined}
                      onChange={(date) => updateFilter("updatedBefore", date?.toISOString())}
                      placeholder="Hasta..."
                    />
                  </div>
                </div>
              </div>

              {/* Sorting */}
              <div className="space-y-2">
                <Label>Ordenar Por</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sortBy" className="text-xs text-muted-foreground">
                      Campo
                    </Label>
                    <Select
                      value={localFilters.sortBy || "createdAt"}
                      onValueChange={(value) => updateFilter("sortBy", value)}
                    >
                      <SelectTrigger id="sortBy">
                        <SelectValue placeholder="Campo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Fecha Creación</SelectItem>
                        <SelectItem value="time">Tiempo de Lectura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-xs text-muted-foreground">
                      Orden
                    </Label>
                    <Select
                      value={localFilters.sortOrder || "desc"}
                      onValueChange={(value) => updateFilter("sortOrder", value)}
                    >
                      <SelectTrigger id="sortOrder">
                        <SelectValue placeholder="Orden" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascendente</SelectItem>
                        <SelectItem value="desc">Descendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ModalNova>
  );
}
