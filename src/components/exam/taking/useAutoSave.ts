import { useState, useEffect, useRef } from 'react';

interface UseAutoSaveProps {
  currentAnswer: any;
  onAnswerSubmit: (answer: any) => void;
  questionType: string;
}

export function useAutoSave({ currentAnswer, onAnswerSubmit, questionType }: UseAutoSaveProps) {
  const [answer, setAnswer] = useState<any>(currentAnswer || '');
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update local answer when currentAnswer prop changes
  useEffect(() => {
    setAnswer(currentAnswer || '');
  }, [currentAnswer]);

  // Auto-save function
  const autoSave = async (value: any) => {
    if (value === null || value === undefined) {
      return;
    }

    setIsSaving(true);
    try {
      await onAnswerSubmit(value);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save for text inputs
  const debouncedAutoSave = (value: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      autoSave(value);
    }, 800); // 800ms delay
  };

  const handleAnswerChange = (value: any) => {
    setAnswer(value);
    
    // Immediate save ONLY for single choice and true/false
    if (questionType === 'single_choice' || questionType === 'true_false') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      autoSave(value);
    } else {
      // Debounced save for everything else (text inputs, multiple choice, etc.)
      debouncedAutoSave(value);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    answer,
    isSaving,
    handleAnswerChange
  };
} 