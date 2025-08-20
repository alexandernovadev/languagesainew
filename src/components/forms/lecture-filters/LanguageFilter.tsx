import { Badge } from "@/components/ui/badge";
import { LECTURE_LANGUAGES } from "./constants";

interface LanguageFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function LanguageFilter({ value, onChange }: LanguageFilterProps) {
  const selectedLanguages = value ? value.split(",") : [];

  const handleLanguageClick = (languageValue: string) => {
    if (selectedLanguages.includes(languageValue)) {
      // Remover idioma
      const newLanguages = selectedLanguages.filter((l) => l !== languageValue);
      onChange(newLanguages.length > 0 ? newLanguages.join(",") : undefined);
    } else {
      // Agregar idioma
      const newLanguages = [...selectedLanguages, languageValue];
      onChange(newLanguages.join(","));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {LECTURE_LANGUAGES.map((language) => {
        const isSelected = selectedLanguages.includes(language.value);
        return (
          <Badge
            key={language.value}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected
                ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                : "hover:bg-primary/10"
            }`}
            onClick={() => handleLanguageClick(language.value)}
          >
            {language.label}
          </Badge>
        );
      })}
    </div>
  );
}
