export function getLanguageFlag(lang: string) {
  switch (lang) {
    case "spanish":
      return "🇪🇸";
    case "english":
      return "🇺🇸";
    case "portuguese":
      return "🇵🇹";
    default:
      return "🌐";
  }
}
