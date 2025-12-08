// src/config/api.js
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://tconnects-backend-staging.onrender.com";

// 🔥 GLOBAL settings — REQUIRED for cookie authentication
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // <-- Most important line
axios.defaults.headers.common["Content-Type"] = "application/json";

// IMPORTANT: let axios automatically read the csrftoken cookie and send it
axios.defaults.xsrfCookieName = "csrftoken";      // cookie name that Django sets
axios.defaults.xsrfHeaderName = "X-CSRFToken";    // header name axios will send

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

export default api;
