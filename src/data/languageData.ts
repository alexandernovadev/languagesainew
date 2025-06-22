export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languageData: Language[] = [
  { code: "en", name: "Inglés", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Francés", flag: "🇫🇷" },
  { code: "de", name: "Alemán", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portugués", flag: "🇵🇹" },
  { code: "jp", name: "Japonés", flag: "🇯🇵" },
  { code: "cn", name: "Chino", flag: "🇨🇳" },
  { code: "ru", name: "Ruso", flag: "🇷🇺" },
];
