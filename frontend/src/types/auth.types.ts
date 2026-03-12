/** Shape of the user object returned by the API */
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: "google" | "email";
  createdAt?: string;
}

/** Response from auth endpoints */
export interface AuthResponse {
  token: string;
  user: User;
}

/** Auth context value */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}
