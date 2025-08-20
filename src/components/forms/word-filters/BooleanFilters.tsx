import { BooleanSelectFilter } from "@/components/forms/common/BooleanSelectFilter";

interface BooleanFiltersProps {
  values: Record<string, boolean | undefined>;
  onChange: (key: string, value: boolean | undefined) => void;
}

export function BooleanFilters({ values, onChange }: BooleanFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Ejemplos</h4>
        <BooleanSelectFilter
          value={values.hasExamples}
          onChange={(value) => onChange("hasExamples", value)}
          placeholder="Seleccionar estado de ejemplos"
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Sinónimos</h4>
        <BooleanSelectFilter
          value={values.hasSynonyms}
          onChange={(value) => onChange("hasSynonyms", value)}
          placeholder="Seleccionar estado de sinónimos"
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Code-Switching</h4>
        <BooleanSelectFilter
          value={values.hasCodeSwitching}
          onChange={(value) => onChange("hasCodeSwitching", value)}
          placeholder="Seleccionar estado de code-switching"
        />
      </div>
    </div>
  );
}
