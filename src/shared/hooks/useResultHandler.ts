import { toast } from 'sonner';

export function useResultHandler() {
  const handleApiResult = (error: any, context?: string) => {
    const contextName = context || 'Operación';
    const errorMessage = error?.response?.data?.message || error?.message || `Error en ${contextName}`;
    
    console.error(`Error en ${contextName}:`, error);
    toast.error(errorMessage);
  };

  const withResultHandler = <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        const result = await fn(...args);
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
  };
} 