import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserStore } from '@/lib/store/user-store';

export const useLoginModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useUserStore();

  // Abrir modal desde query params
  useEffect(() => {
    const showLogin = searchParams.get('showLogin');
    if (showLogin === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  // Limpiar el query param y refrescar la página cuando el login es exitoso
  useEffect(() => {
    if (token && isOpen) {
      // Remover el parámetro showLogin de la URL cuando el login es exitoso
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('showLogin');
      setSearchParams(newSearchParams);
      
      // Refrescar la página después de un breve delay para asegurar que el token se haya guardado
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [token, isOpen, searchParams, setSearchParams]);

  // Escuchar evento personalizado para abrir modal
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setIsOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    
    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
    };
  }, []);

  const openLoginModal = () => {
    setIsOpen(true);
  };

  const closeLoginModal = () => {
    setIsOpen(false);
    // También limpiar el parámetro cuando se cierra manualmente
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('showLogin');
    setSearchParams(newSearchParams);
  };

  const openLoginModalWithQuery = () => {
    // Agregar query param para abrir el modal
    searchParams.set('showLogin', 'true');
    setSearchParams(searchParams);
  };

  return {
    isOpen,
    openLoginModal,
    closeLoginModal,
    openLoginModalWithQuery,
  };
}; 