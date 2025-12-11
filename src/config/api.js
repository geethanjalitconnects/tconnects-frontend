// config/api.js - Safari-optimized API configuration

import axios from 'axios';

// API Base URL - use environment variable or fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.tconnects.in';

// Create axios instance with Safari-compatible settings
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL for Safari cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - Safari compatibility
api.interceptors.request.use(
  (config) => {
    // Safari requires explicit origin header
    config.headers['Origin'] = window.location.origin;
    
    // For Safari, ensure credentials are always included
    config.withCredentials = true;
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('🌐 API Request:', config.method.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh for Safari
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.url, response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => {
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Attempting token refresh...');
        
        // Attempt token refresh
        await api.post('/api/auth/refresh/');
        
        console.log('✅ Token refresh successful');
        
        isRefreshing = false;
        processQueue(null);
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Clear any stored data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login only if not already on login/register page
        const currentPath = window.location.pathname;
        if (!['/login', '/register', '/'].includes(currentPath)) {
          console.log('🔄 Redirecting to login...');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.response?.status, error.config?.url);
    }

    return Promise.reject(error);
  }
);

// Helper function to check authentication status
export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check/');
    return response.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me/');
    return response.data;
  } catch (error) {
    console.error('Get user failed:', error);
    return null;
  }
};

// Helper function for logout
export const logout = async () => {
  try {
    await api.post('/api/auth/logout/');
    localStorage.clear();
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    // Clear local data even if API fails
    localStorage.clear();
    sessionStorage.clear();
    return false;
  }
};

export default api;