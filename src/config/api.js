// config/api.js - Production ready

import axios from 'axios';

// ✅ PRODUCTION: fallback to production backend if env var not set
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.tconnects.in';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token refresh
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthCheckEndpoint =
      originalRequest.url?.includes('/api/auth/check/') ||
      originalRequest.url?.includes('/api/auth/me/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthCheckEndpoint) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => api(originalRequest))
        .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/api/auth/refresh/');
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        localStorage.clear();
        sessionStorage.clear();
        window.dispatchEvent(new Event('auth:logout'));

        const currentPath = window.location.pathname;
        if (!['/login', '/register', '/'].includes(currentPath)) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check/');
    return response.data;
  } catch {
    return { authenticated: false };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me/');
    return response.data;
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout/');
  } catch {
    // continue even if API fails
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('auth:logout'));
  }
  return true;
};

export default api;