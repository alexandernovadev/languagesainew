import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/user-store';

export const useAuth = () => {
  const { user, token, isAuthenticated } = useUserStore();

  // Log del estado actual
  useEffect(() => {
    console.log("🔍 Auth state check:", {
      user: user?._id,
      token: token ? 'present' : 'missing',
      isAuthenticated: isAuthenticated()
    });
  }, [user, token, isAuthenticated]);

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
  };
}; 