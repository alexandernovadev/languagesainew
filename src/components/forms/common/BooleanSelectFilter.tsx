import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BooleanSelectFilterProps {
  value?: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function BooleanSelectFilter({ 
  value, 
  onChange, 
  placeholder = "Seleccionar...",
  className = ""
}: BooleanSelectFilterProps) {
  const getValue = () => {
    if (value === undefined) return "all";
    if (value === true) return "true";
    return "false";
  };

  const handleChange = (newValue: string) => {
    if (newValue === "all") {
      onChange(undefined);
    } else if (newValue === "true") {
      onChange(true);
    } else {
      onChange(false);
    }
  };

  return (
    <Select value={getValue()} onValueChange={handleChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas</SelectItem>
        <SelectItem value="true">Con</SelectItem>
        <SelectItem value="false">Sin</SelectItem>
      </SelectContent>
    </Select>
  );
}
