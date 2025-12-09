import { useEffect, useState } from 'react';
import api from '../config/api';

export const useAuthCheck = (onAuthChange) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        const response = await api.get('/api/auth/me/');

        if (response.data) {
          console.log('✅ User authenticated:', response.data);
          setUser(response.data);
          onAuthChange?.(response.data);
        }
      } catch (error) {
        console.log('❌ Not authenticated or session expired');
        setUser(null);
        onAuthChange?.(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const handleLogout = () => {
      console.log('👋 Logout event received');
      setUser(null);
      onAuthChange?.(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);

  }, []); // <-- FIXED (do NOT depend on onAuthChange)

  return { user, isChecking };
};

export default useAuthCheck;
