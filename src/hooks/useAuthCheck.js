import { useEffect, useState } from 'react';
import api from '../config/api';

/**
 * Custom hook to automatically check authentication status on app load
 * Fixes the Safari header issue by verifying cookies on mount
 * 
 * @param {Function} onAuthChange - Callback when auth state changes
 * @returns {Object} { user, isChecking }
 */
export const useAuthCheck = (onAuthChange) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        
        // Call /me endpoint to verify authentication
        const response = await api.get('/api/auth/me/');
        
        if (response.data) {
          console.log('✅ User authenticated:', response.data);
          setUser(response.data);
          
          // Notify parent component
          if (onAuthChange) {
            onAuthChange(response.data);
          }
        }
      } catch (error) {
        console.log('❌ Not authenticated or session expired');
        setUser(null);
        
        // Notify parent that user is logged out
        if (onAuthChange) {
          onAuthChange(null);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    // Listen for logout events
    const handleLogout = () => {
      console.log('👋 Logout event received');
      setUser(null);
      if (onAuthChange) {
        onAuthChange(null);
      }
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [onAuthChange]);

  return { user, isChecking };
};

export default useAuthCheck;