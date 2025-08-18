// Tipos gramaticales que coinciden exactamente con el enum del backend
// Backend: Word.ts enum type field
export const WORD_TYPES = [
  { key: 'noun', label: 'Sustantivo', icon: '📚' },
  { key: 'verb', label: 'Verbo', icon: '🏃' },
  { key: 'adjective', label: 'Adjetivo', icon: '🎨' },
  { key: 'adverb', label: 'Adverbio', icon: '⚡' },
  { key: 'personal pronoun', label: 'Pronombre Personal', icon: '👤' },
  { key: 'possessive pronoun', label: 'Pronombre Posesivo', icon: '👤' },
  { key: 'preposition', label: 'Preposición', icon: '📍' },
  { key: 'conjunction', label: 'Conjunción', icon: '🔗' },
  { key: 'determiner', label: 'Determinante', icon: '📋' },
  { key: 'article', label: 'Artículo', icon: '📝' },
  { key: 'quantifier', label: 'Cuantificador', icon: '🔢' },
  { key: 'interjection', label: 'Interjección', icon: '💬' },
  { key: 'auxiliary verb', label: 'Verbo Auxiliar', icon: '🔧' },
  { key: 'modal verb', label: 'Verbo Modal', icon: '🔧' },
  { key: 'infinitive', label: 'Infinitivo', icon: '♾️' },
  { key: 'participle', label: 'Participio', icon: '📝' },
  { key: 'gerund', label: 'Gerundio', icon: '🔄' },
  { key: 'other', label: 'Otro', icon: '📦' },
  { key: 'phrasal verb', label: 'Verbo Frasal', icon: '🔗' },
];

// Función helper para obtener tipos por clave
export const getWordTypeByKey = (key: string) => {
  return WORD_TYPES.find(type => type.key === key);
};

// Función helper para obtener todos los tipos como array de strings
export const getWordTypeKeys = () => {
  return WORD_TYPES.map(type => type.key);
};

// Función helper para validar si un tipo es válido
export const isValidWordType = (type: string) => {
  return WORD_TYPES.some(t => t.key === type);
}; 