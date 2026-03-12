import axios from "axios";
import type { AuthResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Pre-configured Axios instance.
 * Automatically attaches the JWT token from localStorage to every request.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies with requests
});

// Request interceptor: attach JWT to Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's the /me check (handled by AuthContext)
      const requestUrl = error.config?.url || "";
      if (!requestUrl.includes("/auth/me")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// ----- Auth API Functions -----

/** Send Firebase token to backend for social login */
export async function firebaseLogin(
  firebaseToken: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/firebase", {
    firebaseToken,
  });
  return data;
}

/** Register with email/password */
export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    email,
    password,
    name,
  });
  return data;
}

/** Login with email/password */
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

/** Logout — clear cookie on backend */
export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

/** Get current user profile */
export async function getMe(): Promise<{ user: AuthResponse["user"] }> {
  const { data } = await api.get("/auth/me");
  return data;
}

export default api;
