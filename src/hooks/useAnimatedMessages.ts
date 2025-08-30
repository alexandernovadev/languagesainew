import { useState, useEffect, useMemo } from 'react';

export function useAnimatedMessages(isGenerating: boolean) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = useMemo(() => [], []); // No messages after removing exam features

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