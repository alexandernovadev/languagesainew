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
    if (value === null || value === undefined || value === '') {
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
    }, 1000); // 1 second delay
  };

  const handleAnswerChange = (value: any) => {
    setAnswer(value);
    
    // Immediate save for single choice, true/false, and fill_blank with options
    if (questionType === 'single_choice' || questionType === 'true_false' || 
        (questionType === 'fill_blank' && value && typeof value === 'string' && value.length > 0)) {
      autoSave(value);
    } else if (questionType === 'multiple_choice') {
      // For multiple choice, save immediately if it's a valid array
      if (Array.isArray(value) && value.length > 0) {
        autoSave(value);
      }
    } else {
      // Debounced save for text inputs
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