import { Request } from "express";

/** The shape of data embedded in our JWT */
export interface JwtPayload {
  userId: string;
  email: string;
}

/** Extend Express Request to carry authenticated user data */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/** Response returned after successful authentication */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    provider: string;
  };
}

/** Body for Firebase social login */
export interface FirebaseLoginBody {
  firebaseToken: string;
}

/** Body for email/password registration */
export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

/** Body for email/password login */
export interface EmailLoginBody {
  email: string;
  password: string;
}
