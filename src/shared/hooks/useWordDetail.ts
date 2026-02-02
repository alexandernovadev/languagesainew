import { useState, useEffect, useCallback, useRef } from 'react';
import { wordService } from '@/services/wordService';
import { IWord } from '@/types/models/Word';
import { toast } from 'sonner';

interface UseWordDetailProps {
  wordId: string | null;
  initialWord?: IWord | null; // Palabra inicial para evitar llamada API innecesaria
  onWordUpdate?: (word: IWord) => void;
}

export function useWordDetail({ wordId, initialWord, onWordUpdate }: UseWordDetailProps) {
  const [word, setWord] = useState<IWord | null>(initialWord || null);
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
  // Si hay initialWord y coincide con el wordId, no hacer llamada API
  useEffect(() => {
    if (wordId !== wordIdRef.current) {
      wordIdRef.current = wordId;
      if (wordId) {
        // Si hay initialWord y coincide con el wordId actual, usarlo directamente
        if (initialWord && initialWord._id === wordId) {
          setWord(initialWord);
          if (onWordUpdateRef.current) {
            onWordUpdateRef.current(initialWord);
          }
        } else {
          // Solo hacer llamada API si no hay initialWord o no coincide
          loadWord();
        }
      } else {
        setWord(null);
      }
    } else if (wordId && initialWord && initialWord._id === wordId) {
      // Si el wordId no cambió pero initialWord sí, actualizar si coincide
      setWord(initialWord);
      if (onWordUpdateRef.current) {
        onWordUpdateRef.current(initialWord);
      }
    }
  }, [wordId, initialWord, loadWord]);

  // Refresh image
  const refreshImage = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    setLoadingImage(true);
    try {
      const response = await wordService.generateWordImage(currentWord._id, currentWord.word, currentWord.img || "");
      const updatedData = response.data || response;
      // Actualizar solo el campo img, manteniendo todo lo demás
      setWord(prev => prev ? { ...prev, img: updatedData.img || updatedData.data?.img } : null);
      if (onWordUpdateRef.current && word) {
        onWordUpdateRef.current({ ...word, img: updatedData.img || updatedData.data?.img });
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
      const updatedData = response.data || response;
      // Actualizar solo el campo sinonyms, manteniendo todo lo demás
      setWord(prev => prev ? { ...prev, sinonyms: updatedData.sinonyms || updatedData.data?.sinonyms } : null);
      if (onWordUpdateRef.current && word) {
        onWordUpdateRef.current({ ...word, sinonyms: updatedData.sinonyms || updatedData.data?.sinonyms });
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
      const updatedData = response.data || response;
      // Actualizar solo el campo examples, manteniendo todo lo demás
      setWord(prev => prev ? { ...prev, examples: updatedData.examples || updatedData.data?.examples } : null);
      if (onWordUpdateRef.current && word) {
        onWordUpdateRef.current({ ...word, examples: updatedData.examples || updatedData.data?.examples });
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
      const updatedData = response.data || response;
      // Actualizar solo el campo type, manteniendo todo lo demás
      setWord(prev => prev ? { ...prev, type: updatedData.type || updatedData.data?.type } : null);
      if (onWordUpdateRef.current && word) {
        onWordUpdateRef.current({ ...word, type: updatedData.type || updatedData.data?.type });
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
      const updatedData = response.data || response;
      // Actualizar solo el campo codeSwitching, manteniendo todo lo demás
      setWord(prev => prev ? { ...prev, codeSwitching: updatedData.codeSwitching || updatedData.data?.codeSwitching } : null);
      if (onWordUpdateRef.current && word) {
        onWordUpdateRef.current({ ...word, codeSwitching: updatedData.codeSwitching || updatedData.data?.codeSwitching });
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
      
      // Actualizar todos los campos en paralelo, manteniendo todo lo demás
      const [imgResponse, synonymsResponse, examplesResponse, typesResponse, codeSwitchingResponse] = responses;
      const imgData = imgResponse.data || imgResponse;
      const synonymsData = synonymsResponse.data || synonymsResponse;
      const examplesData = examplesResponse.data || examplesResponse;
      const typesData = typesResponse.data || typesResponse;
      const codeSwitchingData = codeSwitchingResponse.data || codeSwitchingResponse;
      
      setWord(prev => prev ? {
        ...prev,
        img: imgData.img || imgData.data?.img || prev.img,
        sinonyms: synonymsData.sinonyms || synonymsData.data?.sinonyms || prev.sinonyms,
        examples: examplesData.examples || examplesData.data?.examples || prev.examples,
        type: typesData.type || typesData.data?.type || prev.type,
        codeSwitching: codeSwitchingData.codeSwitching || codeSwitchingData.data?.codeSwitching || prev.codeSwitching,
      } : null);
      
      if (onWordUpdateRef.current && word) {
        onWordUpdateRef.current({
          ...word,
          img: imgData.img || imgData.data?.img || word.img,
          sinonyms: synonymsData.sinonyms || synonymsData.data?.sinonyms || word.sinonyms,
          examples: examplesData.examples || examplesData.data?.examples || word.examples,
          type: typesData.type || typesData.data?.type || word.type,
          codeSwitching: codeSwitchingData.codeSwitching || codeSwitchingData.data?.codeSwitching || word.codeSwitching,
        });
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
      // Add user message immediately to show it right away
      const userMessageId = Date.now().toString();
      setWord(prev => prev ? {
        ...prev,
        chat: [...(prev.chat || []), {
          id: userMessageId,
          role: 'user' as const,
          content: message.trim(),
          timestamp: new Date(),
        }]
      } : null);

      // Stream response (backend will add user message automatically)
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

      // Reload word to get updated chat from server (includes user message + assistant message)
      await loadWord();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error enviando mensaje';
      toast.error(errorMsg);
      // Reload to sync state with server
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

  // Increment seen count
  const incrementSeen = useCallback(async () => {
    const currentWord = word;
    if (!currentWord) return;
    
    try {
      await wordService.incrementWordSeen(currentWord._id);
      await loadWord(); // Recargar para actualizar seen
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error incrementando contador';
      toast.error(errorMsg);
    }
  }, [word, loadWord]);

  // Update difficulty
  const updateDifficulty = useCallback(async (difficulty: string) => {
    const currentWord = word;
    if (!currentWord) return;
    
    try {
      await wordService.updateWordDifficulty(currentWord._id, difficulty);
      await loadWord(); // Recargar para actualizar difficulty
      toast.success(`Dificultad actualizada a ${difficulty}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error actualizando dificultad';
      toast.error(errorMsg);
    }
  }, [word, loadWord]);

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
    incrementSeen,
    updateDifficulty,
    reloadWord: loadWord,
  };
}
