/**
 * Utility functions for Badge component variants
 */

type BadgeVariant = "default" | "secondary" | "yellow" | "destructive" | "blue" | "outline";

/**
 * Returns the appropriate Badge variant for a difficulty level
 * Supports both simple difficulty (easy/medium/hard) and CEFR levels (A1-C2)
 * 
 * @param difficulty - The difficulty level (easy, medium, hard, A1, A2, B1, B2, C1, C2)
 * @returns Badge variant name
 */
export function getDifficultyVariant(difficulty?: string): BadgeVariant {
  if (!difficulty) return "outline";

  const normalizedDifficulty = difficulty.toLowerCase().trim();

  switch (normalizedDifficulty) {
    // Simple difficulty levels
    case "easy":
      return "default";
    case "medium":
      return "yellow";
    case "hard":
      return "destructive";
    
    // CEFR levels (for expressions)
    case "a1":
      return "default";
    case "a2":
      return "secondary";
    case "b1":
      return "yellow";
    case "b2":
      return "blue";
    case "c1":
    case "c2":
      return "destructive";
    
    default:
      return "outline";
  }
}
