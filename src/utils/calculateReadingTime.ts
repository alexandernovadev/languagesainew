/**
 * Calcula el tiempo estimado de lectura en minutos
 * Basado en un promedio de 200 palabras por minuto
 */
export const calculateReadingTime = (content: string): number => {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  // Contar palabras (separadas por espacios)
  const words = content.trim().split(/\s+/).length;
  
  // Promedio de palabras por minuto al leer
  const wordsPerMinute = 200;
  
  // Calcular tiempo en minutos
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  // Mínimo 1 minuto
  return Math.max(1, readingTime);
}; 