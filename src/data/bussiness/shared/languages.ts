import { Language } from "@/types/business";

interface LanguageOption {
  value: Language;
  label: string;
}

const languagesJson: LanguageOption[] = [
  { value: "es", label: "Español" },
    { value: "pt", label: "Portugués" },
  { value: "it", label: "Italiano" },
  { value: "fr", label: "Francés" },
];

const languagesList: Language[] = languagesJson.map((language) => language.value);

export { languagesJson, languagesList };
