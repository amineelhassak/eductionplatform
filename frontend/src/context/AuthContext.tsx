import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import * as apiService from "../services/api";
import type { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  /**
   * On mount, check if we have a saved token and validate it.
   */
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          // Verify token is still valid by calling /me
          const { user: freshUser } = await apiService.getMe();
          setToken(savedToken);
          setUser(freshUser);
        } catch {
          // Token expired or invalid — clean up
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Save auth state to localStorage and React state.
   */
  const saveAuth = useCallback((authToken: string, authUser: User) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  }, []);

  /**
   * Clear all auth state.
   */
  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Login with Google via Firebase popup → send token to backend.
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      const response = await apiService.firebaseLogin(firebaseToken);
      saveAuth(response.token, response.user);
    } finally {
      setIsLoading(false);
    }
  }, [saveAuth]);

  /**
   * Login with email and password.
   */
  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await apiService.loginUser(email, password);
        saveAuth(response.token, response.user);
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuth],
  );

  /**
   * Register with email and password.
   */
  const registerWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      try {
        const response = await apiService.registerUser(email, password, name);
        saveAuth(response.token, response.user);
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuth],
  );

  /**
   * Logout: clear backend cookie, Firebase, and local state.
   */
  const logout = useCallback(async () => {
    try {
      await apiService.logoutUser();
      await auth.signOut();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context. Must be used within <AuthProvider>.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
