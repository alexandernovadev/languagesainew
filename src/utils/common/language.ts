export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
}

export const languages: Record<string, LanguageInfo> = {
  'es': { code: 'es', name: 'Español', flag: '🇪🇸' },
  'en': { code: 'en', name: 'Inglés', flag: '🇬🇧' },
  'fr': { code: 'fr', name: 'Francés', flag: '🇫🇷' },
  'de': { code: 'de', name: 'Alemán', flag: '🇩🇪' },
  'it': { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  'pt': { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
  'jp': { code: 'jp', name: 'Japonés', flag: '🇯🇵' },
  'cn': { code: 'cn', name: 'Chino', flag: '🇨🇳' },
  'ru': { code: 'ru', name: 'Ruso', flag: '🇷🇺' },
  'ar': { code: 'ar', name: 'Árabe', flag: '🇸🇦' },
  'ko': { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  'hi': { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  'tr': { code: 'tr', name: 'Turco', flag: '🇹🇷' },
  'nl': { code: 'nl', name: 'Holandés', flag: '🇳🇱' },
  'pl': { code: 'pl', name: 'Polaco', flag: '🇵🇱' },
  'sv': { code: 'sv', name: 'Sueco', flag: '🇸🇪' },
  'da': { code: 'da', name: 'Danés', flag: '🇩🇰' },
  'no': { code: 'no', name: 'Noruego', flag: '🇳🇴' },
  'fi': { code: 'fi', name: 'Finlandés', flag: '🇫🇮' },
  'cs': { code: 'cs', name: 'Checo', flag: '🇨🇿' },
  'hu': { code: 'hu', name: 'Húngaro', flag: '🇭🇺' },
  'ro': { code: 'ro', name: 'Rumano', flag: '🇷🇴' },
  'bg': { code: 'bg', name: 'Búlgaro', flag: '🇧🇬' },
  'hr': { code: 'hr', name: 'Croata', flag: '🇭🇷' },
  'sk': { code: 'sk', name: 'Eslovaco', flag: '🇸🇰' },
  'sl': { code: 'sl', name: 'Esloveno', flag: '🇸🇮' },
  'et': { code: 'et', name: 'Estonio', flag: '🇪🇪' },
  'lv': { code: 'lv', name: 'Letón', flag: '🇱🇻' },
  'lt': { code: 'lt', name: 'Lituano', flag: '🇱🇹' },
  'mt': { code: 'mt', name: 'Maltés', flag: '🇲🇹' },
  'el': { code: 'el', name: 'Griego', flag: '🇬🇷' },
  'he': { code: 'he', name: 'Hebreo', flag: '🇮🇱' },
  'th': { code: 'th', name: 'Tailandés', flag: '🇹🇭' },
  'vi': { code: 'vi', name: 'Vietnamita', flag: '🇻🇳' },
  'id': { code: 'id', name: 'Indonesio', flag: '🇮🇩' },
  'ms': { code: 'ms', name: 'Malayo', flag: '🇲🇾' },
  'fa': { code: 'fa', name: 'Persa', flag: '🇮🇷' },
  'ur': { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  'bn': { code: 'bn', name: 'Bengalí', flag: '🇧🇩' },
  'ta': { code: 'ta', name: 'Tamil', flag: '🇱🇰' },
  'te': { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  'mr': { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  'gu': { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  'kn': { code: 'kn', name: 'Canarés', flag: '🇮🇳' },
  'ml': { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  'pa': { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  'si': { code: 'si', name: 'Cingalés', flag: '🇱🇰' },
  'my': { code: 'my', name: 'Birmano', flag: '🇲🇲' },
  'km': { code: 'km', name: 'Jemer', flag: '🇰🇭' },
  'lo': { code: 'lo', name: 'Lao', flag: '🇱🇦' },
  'ne': { code: 'ne', name: 'Nepalí', flag: '🇳🇵' },
  'ka': { code: 'ka', name: 'Georgiano', flag: '🇬🇪' },
  'am': { code: 'am', name: 'Amárico', flag: '🇪🇹' },
  'sw': { code: 'sw', name: 'Suajili', flag: '🇹🇿' },
  'yo': { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  'ig': { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  'ha': { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  'zu': { code: 'zu', name: 'Zulú', flag: '🇿🇦' },
  'af': { code: 'af', name: 'Afrikáans', flag: '🇿🇦' },
  'xh': { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
  'st': { code: 'st', name: 'Sesoto', flag: '🇱🇸' },
  'tn': { code: 'tn', name: 'Setswana', flag: '🇧🇼' },
  'ss': { code: 'ss', name: 'Siswati', flag: '🇸🇿' },
  've': { code: 've', name: 'Venda', flag: '🇿🇦' },
  'ts': { code: 'ts', name: 'Tsonga', flag: '🇿🇦' },
  'nr': { code: 'nr', name: 'Ndebele del Sur', flag: '🇿🇦' },
  'nd': { code: 'nd', name: 'Ndebele del Norte', flag: '🇿🇼' },
  'sn': { code: 'sn', name: 'Shona', flag: '🇿🇼' },
  'rw': { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  'lg': { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
  'ak': { code: 'ak', name: 'Akan', flag: '🇬🇭' },
  'tw': { code: 'tw', name: 'Twi', flag: '🇬🇭' },
  'ee': { code: 'ee', name: 'Ewe', flag: '🇹🇬' },
  'fon': { code: 'fon', name: 'Fon', flag: '🇧🇯' },
  'dyo': { code: 'dyo', name: 'Jola-Fonyi', flag: '🇸🇳' },
  'ff': { code: 'ff', name: 'Fula', flag: '🇸🇳' },
  'wo': { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
  'bm': { code: 'bm', name: 'Bambara', flag: '🇲🇱' },
  'dy': { code: 'dy', name: 'Diola', flag: '🇸🇳' },
  'sg': { code: 'sg', name: 'Sango', flag: '🇨🇫' },
  'ln': { code: 'ln', name: 'Lingala', flag: '🇨🇬' }
};

/**
 * Get language information by code
 * @param code - Language code (e.g., 'es', 'en', 'fr')
 * @returns LanguageInfo object with code, name, and flag, or fallback to code
 */
export const getLanguageInfo = (code: string): LanguageInfo => {
  return languages[code] || { code, name: code, flag: '🌐' };
};

/**
 * Get language name by code
 * @param code - Language code (e.g., 'es', 'en', 'fr')
 * @returns Language name in Spanish, or code if not found
 */
export const getLanguageName = (code: string): string => {
  return languages[code]?.name || code;
};

/**
 * Get language flag by code
 * @param code - Language code (e.g., 'es', 'en', 'fr')
 * @returns Language flag emoji, or globe if not found
 */
export const getLanguageFlag = (code: string): string => {
  return languages[code]?.flag || '🌐';
};

/**
 * Get all available languages
 * @returns Array of all LanguageInfo objects
 */
export const getAllLanguages = (): LanguageInfo[] => {
  return Object.values(languages);
};

// Allowed languages aligned with backend enum (User model)
export const allowedLanguageCodes = ["en", "es", "pt", "it", "fr"] as const;
export type AllowedLanguageCode = typeof allowedLanguageCodes[number];

export const getAllowedLanguages = (): LanguageInfo[] => {
  return allowedLanguageCodes.map(code => languages[code]).filter(Boolean);
};

/**
 * Get languages by region
 * @param region - Region name (e.g., 'europe', 'asia', 'africa')
 * @returns Array of LanguageInfo objects for the region
 */
export const getLanguagesByRegion = (region: string): LanguageInfo[] => {
  const regionMap: Record<string, string[]> = {
    'europe': ['es', 'en', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'mt', 'el'],
    'asia': ['jp', 'cn', 'ko', 'hi', 'th', 'vi', 'id', 'ms', 'fa', 'ur', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'si', 'my', 'km', 'lo', 'ne', 'ka'],
    'africa': ['ar', 'am', 'sw', 'yo', 'ig', 'ha', 'zu', 'af', 'xh', 'st', 'tn', 'ss', 've', 'ts', 'nr', 'nd', 'sn', 'rw', 'lg', 'ak', 'tw', 'ee', 'fon', 'dyo', 'ff', 'wo', 'bm', 'dy', 'sg', 'ln'],
    'americas': ['es', 'en', 'fr', 'pt'],
    'oceania': ['en']
  };
  
  const codes = regionMap[region] || [];
  return codes.map(code => languages[code]).filter(Boolean);
}; 