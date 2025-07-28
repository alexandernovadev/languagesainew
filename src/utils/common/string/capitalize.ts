/**
 * Capitalizes the first letter of a string while keeping the rest unchanged.
 * 
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 * 
 * @example
 * ```typescript
 * import { capitalize } from '@/utils/common/string';
 * 
 * capitalize('hello world'); // 'Hello world'
 * capitalize('HELLO WORLD'); // 'HELLO WORLD'
 * capitalize(''); // ''
 * capitalize('h'); // 'H'
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of each word in a string.
 * 
 * @param str - The string to capitalize each word
 * @returns The string with each word's first letter capitalized
 * 
 * @example
 * ```typescript
 * import { capitalizeWords } from '@/utils/common/string';
 * 
 * capitalizeWords('hello world'); // 'Hello World'
 * capitalizeWords('the quick brown fox'); // 'The Quick Brown Fox'
 * capitalizeWords(''); // ''
 * ```
 */
export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str.replace(/\b\w/g, (letter) => letter.toUpperCase());
} 