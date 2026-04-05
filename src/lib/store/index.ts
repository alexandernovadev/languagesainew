/**
 * Stores - Central export for all Zustand stores
 * 
 * Usage:
 *   import { useUserStore, useWordsUIStore, useExpressionsUIStore } from '@/lib/store';
 */

export { useUserStore } from './user-store';
export { useAIConfigStore } from './aiConfig-store';
export {
  useWordsUIStore,
  useWordsDialogs,
  useWordsSelection,
  useWordsFilters,
  useWordsLoading,
} from './words-store';
export {
  useExpressionsUIStore,
  useExpressionsDialogs,
  useExpressionsSelection,
  useExpressionsFilters,
  useExpressionsLoading,
} from './expressions-store';
