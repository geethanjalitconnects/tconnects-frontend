import React, { createContext, useState, useEffect } from 'react';
import api, { checkAuth } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children, value }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // If value is provided from App.jsx, use it (for controlled mode)
  const contextValue = value || { user, setUser };

  // ✅ FIXED: Use /api/auth/check/ instead of /api/auth/me/
  // This endpoint allows unauthenticated requests
  useEffect(() => {
    if (!value) {
      const checkAuthentication = async () => {
        try {
          console.log('🔍 AuthContext: Checking authentication...');
          
          // Use checkAuth helper which calls /api/auth/check/
          const authData = await checkAuth();
          
          if (authData.authenticated && authData.user) {
            console.log('✅ AuthContext: User authenticated:', authData.user);
            setUser(authData.user);
          } else {
            console.log('ℹ️ AuthContext: Not authenticated (expected for logged-out users)');
            setUser(null);
          }
        } catch (error) {
          // This should rarely happen now since checkAuth handles errors
          console.log('⚠️ AuthContext: Auth check error (treating as not authenticated)');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      checkAuthentication();
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