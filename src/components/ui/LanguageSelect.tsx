import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AllowedLanguageCode, getAllowedLanguages } from "@/constants/identity";

interface LanguageSelectProps {
  value: AllowedLanguageCode;
  onChange: (value: AllowedLanguageCode) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function LanguageSelect({ value, onChange, disabled, placeholder = "Seleccionar idioma" }: LanguageSelectProps) {
  const langs = getAllowedLanguages();

  return (
    <Select value={value} onValueChange={(v) => onChange(v as AllowedLanguageCode)}>
      <SelectTrigger disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {langs.map((lang) => (
          <SelectItem key={lang.code} value={lang.code as AllowedLanguageCode}>
            {lang.flag} {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


