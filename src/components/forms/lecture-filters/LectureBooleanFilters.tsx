import { BooleanSelectFilter } from "@/components/forms/common/BooleanSelectFilter";

interface LectureBooleanFiltersProps {
  values: Record<string, boolean | undefined>;
  onChange: (key: string, value: boolean | undefined) => void;
}

export function LectureBooleanFilters({ values, onChange }: LectureBooleanFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Imagen</h4>
        <BooleanSelectFilter
          value={values.hasImg}
          onChange={(value) => onChange("hasImg", value)}
          placeholder="Seleccionar estado de imagen"
          withText="Con imagen"
          withoutText="Sin imagen"
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Audio</h4>
        <BooleanSelectFilter
          value={values.hasUrlAudio}
          onChange={(value) => onChange("hasUrlAudio", value)}
          placeholder="Seleccionar estado de audio"
          withText="Con audio"
          withoutText="Sin audio"
        />
      </div>
    </div>
  );
} 