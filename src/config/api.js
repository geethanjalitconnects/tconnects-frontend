import axios from 'axios';

// Use environment variable or fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                            'https://tconnects-backend-staging.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL for Safari cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Timeout for requests
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status}`, error.response.data);
      
      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        console.log('🔒 Unauthorized - redirecting to login');
        // Clear any stale user data
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;