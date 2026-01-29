import { useState, useEffect } from "react";
import { ModalNova } from "../ui/modal-nova";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { DatePicker } from "../ui/date-picker";
import { difficultyJson, languagesJson, wordTypesJson } from "@/data/bussiness/shared";
import { WordFilters } from "@/shared/hooks/useWords";
import { Filter, X, Eraser } from "lucide-react";

interface WordFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: WordFilters;
  onApplyFilters: (filters: WordFilters) => void;
  onClearFilters: () => void;
}

export function WordFiltersModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters,
}: WordFiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<WordFilters>(filters);

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

  const updateFilter = (key: keyof WordFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === "all" ? undefined : value,
    }));
  };

  // Count active filters (excluding page and limit)
  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => key !== "page" && key !== "limit" && value !== undefined && value !== ""
  ).length;

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
      description="Refina tu búsqueda con múltiples filtros"
      size="3xl"
      height="h-[80vh]"
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="spanish">Español</TabsTrigger>
            <TabsTrigger value="content">Características</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wordUser">Palabra</Label>
                <Input
                  id="wordUser"
                  placeholder="Buscar por palabra..."
                  value={localFilters.wordUser || ""}
                  onChange={(e) => updateFilter("wordUser", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="definition">Definición</Label>
                <Input
                  id="definition"
                  placeholder="Buscar en definición..."
                  value={localFilters.definition || ""}
                  onChange={(e) => updateFilter("definition", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select
                  value={localFilters.difficulty || "all"}
                  onValueChange={(value) => updateFilter("difficulty", value)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Todas las dificultades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {difficultyJson.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={localFilters.language || "all"}
                  onValueChange={(value) => updateFilter("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Todos los idiomas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {languagesJson.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={localFilters.type || "all"}
                  onValueChange={(value) => updateFilter("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {wordTypesJson.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="IPA">Fonética (IPA)</Label>
                <Input
                  id="IPA"
                  placeholder="ej: /həˈloʊ/"
                  value={localFilters.IPA || ""}
                  onChange={(e) => updateFilter("IPA", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Spanish Tab */}
          <TabsContent value="spanish" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spanishWord">Palabra en Español</Label>
                <Input
                  id="spanishWord"
                  placeholder="Buscar traducción..."
                  value={localFilters.spanishWord || ""}
                  onChange={(e) => updateFilter("spanishWord", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spanishDefinition">Definición en Español</Label>
                <Input
                  id="spanishDefinition"
                  placeholder="Buscar en definición en español..."
                  value={localFilters.spanishDefinition || ""}
                  onChange={(e) => updateFilter("spanishDefinition", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Content/Features Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="hasExamples">Tiene Ejemplos</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar solo palabras con ejemplos
                  </p>
                </div>
                <Switch
                  id="hasExamples"
                  checked={localFilters.hasExamples || false}
                  onCheckedChange={(checked) => updateFilter("hasExamples", checked || undefined)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="hasSynonyms">Tiene Sinónimos</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar solo palabras con sinónimos
                  </p>
                </div>
                <Switch
                  id="hasSynonyms"
                  checked={localFilters.hasSynonyms || false}
                  onCheckedChange={(checked) => updateFilter("hasSynonyms", checked || undefined)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="hasCodeSwitching">Tiene Code-Switching</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar solo palabras con code-switching
                  </p>
                </div>
                <Switch
                  id="hasCodeSwitching"
                  checked={localFilters.hasCodeSwitching || false}
                  onCheckedChange={(checked) => updateFilter("hasCodeSwitching", checked || undefined)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasImage">Tiene Imagen</Label>
                <Select
                  value={localFilters.hasImage || "all"}
                  onValueChange={(value) => updateFilter("hasImage", value)}
                >
                  <SelectTrigger id="hasImage">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="true">Con imagen</SelectItem>
                    <SelectItem value="false">Sin imagen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Seen Count Range */}
              <div className="space-y-2">
                <Label>Veces Visto</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seenMin" className="text-xs text-muted-foreground">
                      Mínimo
                    </Label>
                    <Input
                      id="seenMin"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={localFilters.seenMin || ""}
                      onChange={(e) => updateFilter("seenMin", e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seenMax" className="text-xs text-muted-foreground">
                      Máximo
                    </Label>
                    <Input
                      id="seenMax"
                      type="number"
                      min="0"
                      placeholder="100"
                      value={localFilters.seenMax || ""}
                      onChange={(e) => updateFilter("seenMax", e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>

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
                        <SelectItem value="word">Palabra</SelectItem>
                        <SelectItem value="difficulty">Dificultad</SelectItem>
                        <SelectItem value="seen">Veces Visto</SelectItem>
                        <SelectItem value="createdAt">Fecha Creación</SelectItem>
                        <SelectItem value="updatedAt">Fecha Actualización</SelectItem>
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
