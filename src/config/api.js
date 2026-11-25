// config/api.js - Safari-optimized API configuration

import axios from 'axios';

// API Base URL - use environment variable or fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.v-connects.com';

// ✅ Helper: Handle paginated { results: [] } or direct [] responses
export const extractList = (data) =>
  Array.isArray(data) ? data : (data?.results || []);

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

    // ✅ FIXED: Don't try to refresh for auth check endpoints
    // These are expected to fail when user is not logged in
    const isAuthCheckEndpoint = 
      originalRequest.url?.includes('/api/auth/check/') ||
      originalRequest.url?.includes('/api/auth/me/');

    // If 401 and haven't retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthCheckEndpoint) {
      
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

    // ✅ FIXED: For auth check endpoints, just reject without logging errors
    // This is expected behavior when not logged in
    if (isAuthCheckEndpoint && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Log other errors in development
    // Fixed (404 suppress pannunga for specific endpoints)
    const suppress404 = originalRequest.url?.includes('/api/profiles/company/');

    if (import.meta.env.DEV && error.response?.status !== 401 && !suppress404) {
        console.error('❌ API Error:', error.response?.status, error.config?.url);
      }
    return Promise.reject(error);
  }
);

// ✅ FIXED: Better authentication check using /api/auth/check/
export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check/');
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};

// ✅ FIXED: Get current user (requires authentication)
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me/');
    return response.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error('Get user failed:', error);
    }
    return null;
  }
};

// Helper function for logout
export const logout = async () => {
  try {
    await api.post('/api/auth/logout/');
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('auth:logout'));
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('auth:logout'));
    return false;
  }
};

export default api;