import { useState, useEffect, useCallback } from "react";

interface UseLazyRouteOptions {
  preload?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: Error) => void;
}

export const useLazyRoute = (
  lazyComponent: () => Promise<any>,
  options: UseLazyRouteOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [component, setComponent] = useState<any>(null);

  const loadComponent = useCallback(async () => {
    if (component) return component;

    setIsLoading(true);
    setError(null);
    options.onLoadStart?.();

    try {
      const loadedComponent = await lazyComponent();
      setComponent(loadedComponent);
      options.onLoadComplete?.();
      return loadedComponent;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [lazyComponent, component, options]);

  // Preload si está habilitado
  useEffect(() => {
    if (options.preload && !component && !isLoading) {
      loadComponent().catch(() => {
        // Error ya manejado en loadComponent
      });
    }
  }, [options.preload, component, isLoading, loadComponent]);

  return {
    isLoading,
    error,
    component,
    loadComponent,
  };
};

export default useLazyRoute; 