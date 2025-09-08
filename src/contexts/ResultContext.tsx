import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

interface ResultContextType {
  showResult: (result: any, title?: string) => void;
  hideResult: () => void;
  clearResult: () => void;
  result: any | null;
  title: string | null;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState<any | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const showResult = useCallback((res: any, resTitle?: string) => {
    setResult(res);
    setTitle(resTitle || null);
  }, []);

  const hideResult = useCallback(() => {
    setResult(null);
    setTitle(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setTitle(null);
  }, []);

  return (
    <ResultContext.Provider value={{ showResult, hideResult, clearResult, result, title }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResultContext must be used within a ResultProvider');
  }
  return context;
};



