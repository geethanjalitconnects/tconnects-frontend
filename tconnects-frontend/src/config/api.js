import axios from "axios";

// ---------------------------------------------------------------------------
// API base URL
// ---------------------------------------------------------------------------
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

// Handle paginated or direct array responses
export const extractList = (data) =>
  Array.isArray(data) ? data : data?.results || [];

// sessionStorage key used by the mentor application form to keep typed
// answers across sign-in. Must match DRAFT_KEY in BecomeMentor.jsx.
const MENTOR_DRAFT_KEY = "tconnects_mentor_draft_v1";

// ---------------------------------------------------------------------------
// Axios instance
//
// IMPORTANT: no default "Content-Type" here. Axios sets application/json by
// itself for plain objects, and the browser must set multipart/form-data
// (with its boundary) for FormData. A forced JSON default is what caused
// "Unsupported media type application/json in request" on file uploads.
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

const isFormData = (data) =>
  typeof FormData !== "undefined" && data instanceof FormData;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    // File uploads: never send a JSON (or any) Content-Type. The browser adds
    // multipart/form-data with the correct boundary. Runs on retries too.
    if (isFormData(config.data) && config.headers) {
      if (typeof config.headers.setContentType === "function") {
        config.headers.setContentType(false); // axios >= 1.x
      } else {
        delete config.headers["Content-Type"]; // axios 0.x
        delete config.headers["content-type"];
      }
    }

    if (import.meta.env.DEV) {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Token refresh handling
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Authentication endpoints that must not trigger refresh
const NO_REFRESH_ENDPOINTS = [
  "/api/auth/check/",
  "/api/auth/me/",
  "/api/auth/refresh/",
  "/api/auth/send-otp/",
  "/api/auth/verify-otp/",
  "/api/auth/register/",
  "/api/auth/logout/",
];

const skipsRefresh = (url = "") =>
  NO_REFRESH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

// Pages where the app should not force a login redirect
const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/register",
  "/mentorship",
  "/admin-dashboard",
];

const isPublicPath = (path) =>
  path === "/" ||
  PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

// Clear stored session data but keep a half-typed mentor application, so a
// failed token refresh does not wipe what the visitor has already written.
const clearSessionData = ({ keepMentorDraft = false } = {}) => {
  let draft = null;
  if (keepMentorDraft) {
    try {
      draft = sessionStorage.getItem(MENTOR_DRAFT_KEY);
    } catch {
      draft = null;
    }
  }

  try {
    localStorage.clear();
    sessionStorage.clear();
    if (draft) sessionStorage.setItem(MENTOR_DRAFT_KEY, draft);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). Ignore.
  }
};

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("API Response:", response.config.url, response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";
    const noRefresh = skipsRefresh(url);

    // Screens that handle 401/403 themselves (e.g. the admin dashboard) can
    // opt out of automatic refresh and login redirects.
    if (originalRequest.skipAuthRedirect) {
      return Promise.reject(error);
    }

    // Expected authentication failures: do not refresh
    if (noRefresh && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Refresh expired sessions for other API requests
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !noRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._retry = true;
            return api(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (import.meta.env.DEV) {
          console.log("Attempting token refresh...");
        }

        await api.post("/api/auth/refresh/");

        isRefreshing = false;
        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.error("Token refresh failed:", refreshError);
        }

        isRefreshing = false;
        processQueue(refreshError, null);

        const currentPath = window.location.pathname;
        const onMentorship = currentPath.startsWith("/mentorship");

        // Keep the mentor application draft when the visitor is on a mentorship page
        clearSessionData({ keepMentorDraft: onMentorship });

        // Do not redirect from public pages or the admin dashboard
        if (!isPublicPath(currentPath)) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    const suppress404 = url.includes("/api/profiles/company/");

    if (
      import.meta.env.DEV &&
      error.response?.status !== 401 &&
      !suppress404
    ) {
      console.error("API Error:", error.response?.status, originalRequest.url);
    }

    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
export const checkAuth = async () => {
  try {
    const response = await api.get("/api/auth/check/");
    return response.data;
  } catch {
    return { authenticated: false };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/me/");
    return response.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error("Get user failed:", error);
    }
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post("/api/auth/logout/");
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Logout request failed:", error);
    }
  } finally {
    // Explicit logout clears everything, including any saved draft
    clearSessionData();
    window.dispatchEvent(new Event("auth:logout"));
  }

  return true;
};

export default api;