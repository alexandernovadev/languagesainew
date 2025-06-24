/**
 * Extracts the first markdown title (H1) from a markdown content string
 * 
 * This function searches for the first line that starts with "# " and
 * returns the title text without the markdown syntax.
 * 
 * @param content - The markdown content to search for a title
 * @returns The title text without markdown syntax, or null if no title is found
 * 
 * @example
 * ```typescript
 * const content = "# My Title\n\nSome content here";
 * getMarkdownTitle(content);
 * // Returns: "My Title"
 * ```
 * 
 * @example
 * ```typescript
 * const content = "No title here\nJust content";
 * getMarkdownTitle(content);
 * // Returns: null
 * ```
 */
export const getMarkdownTitle = (content: string): string | null => {
  if (!content) return null;

  const lines = content.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("# ")) {
      return line.trim().substring(2);
    }
  }

  return null;
};

/**
 * Converts markdown text to HTML with Tailwind CSS classes
 * 
 * This function transforms common markdown syntax into HTML elements
 * with appropriate Tailwind CSS classes for styling. It handles:
 * - Headers (H1, H2, H3)
 * - Bold and italic text
 * - Unordered lists
 * - Paragraphs
 * 
 * @param text - The markdown text to convert
 * @returns HTML string with Tailwind CSS classes
 * 
 * @example
 * ```typescript
 * const markdown = "# Hello World\n\nThis is **bold** and *italic* text.";
 * const html = convertMarkdownToHtml(markdown);
 * // Returns: "<h1 class="text-2xl font-bold mt-8 mb-4">Hello World</h1>
 * //          <p class="mb-4">This is <strong class="font-bold">bold</strong> 
 * //          and <em class="italic">italic</em> text.</p>"
 * ```
 * 
 * @example
 * ```typescript
 * const markdown = "## Subtitle\n\n* Item 1\n* Item 2";
 * const html = convertMarkdownToHtml(markdown);
 * // Returns: "<h2 class="text-xl font-semibold mt-6 mb-3">Subtitle</h2>
 * //          <li class="ml-4">Item 1</li>
 * //          <li class="ml-4">Item 2</li>"
 * ```
 */
export function convertMarkdownToHtml(text: string): string {
  return (
    text
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>'
      )
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Unordered lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|li])(.*$)/gim, '<p class="mb-4">$1</p>')
      // Clean empty paragraphs
      .replace(/<p class="mb-4"><\/p>/g, "")
      .replace(/<p class="mb-4"><\/p>/g, "")
  );
}

/**
 * Escapes special markdown characters in a text string
 * 
 * This function escapes all special markdown characters so that they
 * are treated as literal text rather than markdown syntax. This is
 * useful when you want to display markdown syntax as plain text.
 * 
 * @param text - The text to escape markdown characters in
 * @returns The text with all markdown characters escaped
 * 
 * @example
 * ```typescript
 * const text = "This is **bold** and *italic* text";
 * escapeMarkdown(text);
 * // Returns: "This is \*\*bold\*\* and \*italic\* text"
 * ```
 * 
 * @example
 * ```typescript
 * const text = "# Header with [link](url)";
 * escapeMarkdown(text);
 * // Returns: "\# Header with \[link\]\(url\)"
 * ```
 * 
 * @example
 * ```typescript
 * escapeMarkdown(""); // Empty string
 * // Returns: ""
 * ```
 */
export const escapeMarkdown = (text: string): string => {
  if (!text) return text;

  return (
    text
      // Escape special markdown characters
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/`/g, "\\`")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/#/g, "\\#")
      .replace(/\+/g, "\\+")
      .replace(/-/g, "\\-")
      .replace(/=/g, "\\=")
      .replace(/\|/g, "\\|")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\./g, "\\.")
      .replace(/!/g, "\\!")
  );
}; 