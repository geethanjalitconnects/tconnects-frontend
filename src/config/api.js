// config/api.js - Global API Configuration (Cookie-Based Auth)
import axios from 'axios';

// Backend API URL (from environment variable)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  "https://tconnects-backend.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for sending cookies
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});


export default api;
