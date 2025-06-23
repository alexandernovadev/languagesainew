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

export function convertMarkdownToHtml(text: string): string {
  return (
    text
      // Títulos
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
      // Negritas
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // Cursivas
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Listas
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      // Párrafos
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|li])(.*$)/gim, '<p class="mb-4">$1</p>')
      // Limpiar párrafos vacíos
      .replace(/<p class="mb-4"><\/p>/g, "")
      .replace(/<p class="mb-4"><\/p>/g, "")
  );
}

export const escapeMarkdown = (text: string): string => {
  if (!text) return text;

  return (
    text
      // Escapar caracteres especiales de markdown
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