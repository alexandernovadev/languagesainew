import { useMemo } from 'react';

export function useEnvironment() {
  const isDevelopment = useMemo(() => {
    return import.meta.env.DEV || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }, []);

  return { isDevelopment };
}
