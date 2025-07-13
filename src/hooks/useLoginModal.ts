import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useLoginModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Abrir modal desde query params
  useEffect(() => {
    const showLogin = searchParams.get('showLogin');
    if (showLogin === 'true') {
      setIsOpen(true);
      // Limpiar el query param después de abrir
      searchParams.delete('showLogin');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

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