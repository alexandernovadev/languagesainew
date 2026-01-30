import { useState, useEffect, useCallback, useRef } from 'react';
import { wordService } from '@/services/wordService';
import { IWord } from '@/types/models/Word';
import { toast } from 'sonner';

interface UseWordDetailProps {
  wordId: string | null;
  onWordUpdate?: (word: IWord) => void;
}

export function useWordDetail({ wordId, onWordUpdate }: UseWordDetailProps) {
  const [word, setWord] = useState<IWord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Loading states for individual sections
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSynonyms, setLoadingSynonyms] = useState(false);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingCodeSwitching, setLoadingCodeSwitching] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // Use refs to avoid recreating callbacks
  const onWordUpdateRef = useRef(onWordUpdate);
  const wordIdRef = useRef<string | null>(null);

  // Update ref when prop changes
  useEffect(() => {
    onWordUpdateRef.current = onWordUpdate;
  }, [onWordUpdate]);

  // Load word data
  const loadWord = useCallback(async () => {
    if (!wordId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await wordService.getWordById(wordId);
      const wordData = response.data || response;
      setWord(wordData);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(wordData);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error loading word';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [wordId]);

  // Load word when wordId changes (only when it actually changes)
  useEffect(() => {
    if (wordId !== wordIdRef.current) {
      wordIdRef.current = wordId;
      if (wordId) {
        loadWord();
      } else {
        setWord(null);
      }
    }
  }, [wordId, loadWord]);

  // Refresh image
  const refreshImage = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingImage(true);
    try {
      const response = await wordService.generateWordImage(currentWord._id, currentWord.word, currentWord.img || "");
      const updatedWord = response.data || response;
      setWord(updatedWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(updatedWord);
      }
      toast.success('Imagen generada exitosamente');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error generando imagen';
      toast.error(errorMsg);
    } finally {
      setLoadingImage(false);
    }
  }, [word]);

  // Refresh synonyms
  const refreshSynonyms = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingSynonyms(true);
    try {
      const response = await wordService.generateWordSynonyms(
        currentWord._id,
        currentWord.word,
        currentWord.language,
        currentWord.examples || [],
        "openai"
      );
      const updatedWord = response.data || response;
      setWord(updatedWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(updatedWord);
      }
      toast.success('Sinónimos generados exitosamente');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error generando sinónimos';
      toast.error(errorMsg);
    } finally {
      setLoadingSynonyms(false);
    }
  }, [word]);

  // Refresh examples
  const refreshExamples = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingExamples(true);
    try {
      const response = await wordService.generateWordExamples(
        currentWord._id,
        currentWord.word,
        currentWord.language,
        currentWord.examples || [],
        "openai"
      );
      const updatedWord = response.data || response;
      setWord(updatedWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(updatedWord);
      }
      toast.success('Ejemplos generados exitosamente');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error generando ejemplos';
      toast.error(errorMsg);
    } finally {
      setLoadingExamples(false);
    }
  }, [word]);

  // Refresh types
  const refreshTypes = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingTypes(true);
    try {
      const response = await wordService.generateWordTypes(
        currentWord._id,
        currentWord.word,
        currentWord.language,
        currentWord.examples || [],
        "openai"
      );
      const updatedWord = response.data || response;
      setWord(updatedWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(updatedWord);
      }
      toast.success('Tipos generados exitosamente');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error generando tipos';
      toast.error(errorMsg);
    } finally {
      setLoadingTypes(false);
    }
  }, [word]);

  // Refresh code-switching
  const refreshCodeSwitching = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingCodeSwitching(true);
    try {
      const response = await wordService.generateWordCodeSwitching(
        currentWord._id,
        currentWord.word,
        currentWord.language,
        currentWord.examples || [],
        "openai"
      );
      const updatedWord = response.data || response;
      setWord(updatedWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(updatedWord);
      }
      toast.success('Code-switching generado exitosamente');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error generando code-switching';
      toast.error(errorMsg);
    } finally {
      setLoadingCodeSwitching(false);
    }
  }, [word]);

  // Refresh all sections
  const refreshAll = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingAll(true);
    try {
      // Refresh all sections in parallel
      const responses = await Promise.all([
        wordService.generateWordImage(currentWord._id, currentWord.word, currentWord.img || ""),
        wordService.generateWordSynonyms(currentWord._id, currentWord.word, currentWord.language, currentWord.examples || [], "openai"),
        wordService.generateWordExamples(currentWord._id, currentWord.word, currentWord.language, currentWord.examples || [], "openai"),
        wordService.generateWordTypes(currentWord._id, currentWord.word, currentWord.language, currentWord.examples || [], "openai"),
        wordService.generateWordCodeSwitching(currentWord._id, currentWord.word, currentWord.language, currentWord.examples || [], "openai"),
      ]);
      
      // Use the last response to update the word (it will have all the latest data)
      const lastResponse = responses[responses.length - 1];
      const updatedWord = lastResponse.data || lastResponse;
      setWord(updatedWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(updatedWord);
      }
      toast.success('Todas las secciones actualizadas exitosamente');
    } catch (err: any) {
      toast.error('Error actualizando algunas secciones');
    } finally {
      setLoadingAll(false);
    }
  }, [word]);

  // Send chat message
  const sendMessage = useCallback(async (message: string) => {
    const currentWord = word;
    if (!currentWord || !message.trim()) return;
    
    setLoadingChat(true);
    try {
      // Add user message optimistically
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      };
      
      setWord(prev => prev ? {
        ...prev,
        chat: [...(prev.chat || []), userMessage]
      } : null);

      // Stream response
      const stream = await wordService.streamChatMessage(currentWord._id, message);
      if (!stream) {
        throw new Error('No stream received');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      // Add AI message placeholder
      const aiMessageId = (Date.now() + 1).toString();
      setWord(prev => prev ? {
        ...prev,
        chat: [...(prev.chat || []), {
          id: aiMessageId,
          role: 'assistant' as const,
          content: '',
          timestamp: new Date(),
        }]
      } : null);

      // Read stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Update AI message in real-time
        setWord(prev => {
          if (!prev) return prev;
          const updatedChat = prev.chat?.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: aiResponse }
              : msg
          ) || [];
          return { ...prev, chat: updatedChat };
        });
      }

      // Reload word to get updated chat from server
      await loadWord();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error enviando mensaje';
      toast.error(errorMsg);
      // Remove optimistic messages on error
      await loadWord();
    } finally {
      setLoadingChat(false);
    }
  }, [word, loadWord]);

  // Clear chat history
  const clearChat = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingChat(true);
    try {
      await wordService.clearChatHistory(currentWord._id);
      setWord(prev => prev ? { ...prev, chat: [] } : null);
      toast.success('Historial de chat limpiado');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error limpiando chat';
      toast.error(errorMsg);
    } finally {
      setLoadingChat(false);
    }
  }, [word]);

  return {
    word,
    loading,
    error,
    loadingImage,
    loadingSynonyms,
    loadingExamples,
    loadingTypes,
    loadingCodeSwitching,
    loadingAll,
    loadingChat,
    refreshImage,
    refreshSynonyms,
    refreshExamples,
    refreshTypes,
    refreshCodeSwitching,
    refreshAll,
    sendMessage,
    clearChat,
    reloadWord: loadWord,
  };
}
