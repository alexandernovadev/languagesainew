import { useResultHandler as useResultContext } from '@/contexts/ResultContext';

export function useResultHandler() {
  const { showResult, hideResult, clearResult } = useResultContext();

  const handleApiResult = (result: any, context?: string) => {
    console.log(`Resultado en ${context || 'API'}:`, result);
    showResult(result, context);
  };

  const withResultHandler = <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        const result = await fn(...args);
        handleApiResult(result, context);
        return result;
      } catch (error) {
        handleApiResult(error, context);
        return undefined;
      }
    };
  };

  return {
    handleApiResult,
    withResultHandler,
    hideResult,
    clearResult,
  };
} 