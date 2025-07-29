import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ExamLanguageFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const examLanguages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "Inglés", flag: "🇺🇸" },
  { code: "pt", name: "Portugués", flag: "🇵🇹" },
  { code: "fr", name: "Francés", flag: "🇫🇷" },
];

export function ExamLanguageFilter({ value, onChange }: ExamLanguageFilterProps) {
  const selectedLanguages = value && value !== "all" ? value.split(",") : [];

  const handleLanguageClick = (languageCode: string) => {
    if (selectedLanguages.includes(languageCode)) {
      // Remover idioma
      const newLanguages = selectedLanguages.filter((l) => l !== languageCode);
      onChange(newLanguages.length > 0 ? newLanguages.join(",") : "all");
    } else {
      // Agregar idioma
      const newLanguages = [...selectedLanguages, languageCode];
      onChange(newLanguages.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Idioma</Label>
      <div className="flex flex-wrap gap-2">
        {examLanguages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.code);
          return (
            <Badge
              key={lang.code}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleLanguageClick(lang.code)}
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 