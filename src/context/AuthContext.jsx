import React, { createContext, useState, useEffect } from 'react';
import api from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children, value }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // If value is provided from App.jsx, use it (for controlled mode)
  const contextValue = value || { user, setUser };

  // Auto-check authentication on mount (only if not in controlled mode)
  useEffect(() => {
    if (!value) {
      const checkAuth = async () => {
        try {
          console.log('🔍 AuthContext: Checking authentication...');
          const response = await api.get('/api/auth/me/');
          
          if (response.data) {
            console.log('✅ AuthContext: User authenticated:', response.data);
            setUser(response.data);
          }
        } catch (error) {
          console.log('❌ AuthContext: Not authenticated');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    } else {
      // If controlled from App, skip loading
      setLoading(false);
    }
  }, [value]);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      console.log('👋 AuthContext: Logout event received');
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Show loading only if not controlled and still loading
  if (!value && loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;