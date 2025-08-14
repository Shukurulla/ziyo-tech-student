import axios from "axios";

// Production uchun to'g'ri URL
const API_BASE_URL = "/api";

// Axios instance yaratish
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes
  withCredentials: false, // Vercel uchun false qilish
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ziyo-jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CORS headers
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] =
      config.data instanceof FormData
        ? "multipart/form-data"
        : "application/json";

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK") {
      console.error("Network Error - possible CORS or server issue");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("ziyo-jwt");
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Backward compatibility
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("ziyo-jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
