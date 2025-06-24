/**
 * Calculates the estimated reading time in minutes for a given text content
 * 
 * This function estimates how long it would take an average reader to read
 * the provided content. It uses a standard reading speed of 200 words per minute
 * and ensures a minimum reading time of 1 minute.
 * 
 * @param content - The text content to calculate reading time for
 * @returns The estimated reading time in minutes (minimum 1 minute)
 * 
 * @example
 * ```typescript
 * const content = "This is a short text with a few words.";
 * calculateReadingTime(content);
 * // Returns: 1 (minimum reading time)
 * ```
 * 
 * @example
 * ```typescript
 * const content = "This is a longer text with many more words. ".repeat(100);
 * calculateReadingTime(content);
 * // Returns: approximately 1 minute for 200 words
 * ```
 * 
 * @example
 * ```typescript
 * calculateReadingTime(""); // Empty content
 * // Returns: 0
 * ```
 * 
 * @example
 * ```typescript
 * calculateReadingTime("   "); // Only whitespace
 * // Returns: 0
 * ```
 */
export const calculateReadingTime = (content: string): number => {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  // Count words (separated by whitespace)
  const words = content.trim().split(/\s+/).length;

  // Average words per minute when reading
  const wordsPerMinute = 200;

  // Calculate time in minutes
  const readingTime = Math.ceil(words / wordsPerMinute);

  // Minimum 1 minute
  return Math.max(1, readingTime);
}; 