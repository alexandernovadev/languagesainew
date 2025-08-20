import { Badge } from "@/components/ui/badge";
import { EXPRESSION_LANGUAGES } from "./constants";

interface LanguageFilterProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export function LanguageFilter({ value = [], onChange }: LanguageFilterProps) {
  const handleToggle = (language: string) => {
    const newValue = value.includes(language)
      ? value.filter((v) => v !== language)
      : [...value, language];
    onChange(newValue);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {EXPRESSION_LANGUAGES.map((language) => (
        <Badge
          key={language.value}
          variant={value.includes(language.value) ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleToggle(language.value)}
        >
          <span className="mr-1">{language.icon}</span>
          {language.label}
        </Badge>
      ))}
    </div>
  );
}
