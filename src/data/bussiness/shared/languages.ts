import { Language } from "@/types/business";

interface LanguageOption {
  value: Language;
  label: string;
}

const languagesJson: LanguageOption[] = [
  { value: "en", label: "Inglés" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Portugués" },
  { value: "it", label: "Italiano" },
  { value: "fr", label: "Francés" },
];

const languagesList: Language[] = languagesJson.map((language) => language.value);

/** Idioma de estudio (User.language): sin español */
const contentLanguagesJson: LanguageOption[] = languagesJson.filter(
  (l) => l.value !== "es"
);

export { languagesJson, languagesList, contentLanguagesJson };
