import { useState, useEffect, useMemo } from 'react';
import { getFunnyProgressMessages, getExamGradingMessages } from '@/components/exam/helpers/examUtils';

export function useAnimatedMessages(isGenerating: boolean) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = useMemo(() => getFunnyProgressMessages(), []);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentMessageIndex(0);
      setCurrentMessage('');
      return;
    }

    // Mostrar el primer mensaje inmediatamente
    setCurrentMessage(messages[0]);

    // Cambiar mensaje cada 3 segundos
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = (prev + 1) % messages.length;
        setCurrentMessage(messages[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isGenerating, messages]);

  return {
    currentMessage,
    currentMessageIndex,
    totalMessages: messages.length
  };
}

export function useGradingMessages(isGrading: boolean) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = useMemo(() => getExamGradingMessages(), []);

  useEffect(() => {
    if (!isGrading) {
      setCurrentMessageIndex(0);
      setCurrentMessage('');
      return;
    }

    // Mostrar el primer mensaje inmediatamente
    setCurrentMessage(messages[0]);

    // Cambiar mensaje cada 2.5 segundos
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = (prev + 1) % messages.length;
        setCurrentMessage(messages[nextIndex]);
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isGrading, messages]);

  return {
    currentMessage,
    currentMessageIndex,
    totalMessages: messages.length
  };
} 