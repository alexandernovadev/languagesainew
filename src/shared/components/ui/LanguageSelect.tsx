import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { AllowedLanguageCode, getAllowedLanguages } from "@/constants/identity";

type LanguageValue = AllowedLanguageCode | "auto";

interface LanguageSelectProps {
  value: LanguageValue;
  onChange: (value: LanguageValue) => void;
  disabled?: boolean;
  placeholder?: string;
  includeAuto?: boolean;
  autoLabel?: string;
  triggerClassName?: string;
}

export function LanguageSelect({ value, onChange, disabled, placeholder = "Seleccionar idioma", includeAuto = false, autoLabel = "Auto", triggerClassName }: LanguageSelectProps) {
  const langs = getAllowedLanguages();

  return (
    <Select value={value} onValueChange={(v) => onChange(v as LanguageValue)}>
      <SelectTrigger disabled={disabled} className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAuto && (
          <SelectItem key="auto" value={"auto" as LanguageValue}>
            {autoLabel}
          </SelectItem>
        )}
        {langs.map((lang) => (
          <SelectItem key={lang.code} value={lang.code as LanguageValue}>
            {lang.flag} {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


