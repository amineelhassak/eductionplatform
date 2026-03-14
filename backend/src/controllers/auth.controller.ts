import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import {
  AuthenticatedRequest,
  FirebaseLoginBody,
  RegisterBody,
  EmailLoginBody,
} from "../types";
import { config } from "../config";

/** Cookie options for the JWT token */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite:
    config.nodeEnv === "production" ? ("strict" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * POST /api/auth/firebase
 * Login or register via Firebase (Google).
 */
export async function firebaseLogin(
  req: Request<{}, {}, FirebaseLoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      res.status(400).json({ message: "Firebase token is required" });
      return;
    }

    const result = await authService.loginWithFirebase(firebaseToken);

    // Set HTTP-only cookie
    res.cookie("token", result.token, COOKIE_OPTIONS);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/register
 * Register with email and password.
 */
export async function register(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res
        .status(400)
        .json({ message: "Email, password, and name are required" });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
      return;
    }

    const result = await authService.registerWithEmail(email, password, name);

    res.cookie("token", result.token, COOKIE_OPTIONS);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Login with email and password.
 */
export async function emailLogin(
  req: Request<{}, {}, EmailLoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await authService.loginWithEmail(email, password);

    res.cookie("token", result.token, COOKIE_OPTIONS);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Get the currently authenticated user's profile.
 */
export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await authService.getUserById(req.user.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Clear the authentication cookie.
 */
export function logout(_req: Request, res: Response): void {
  const { maxAge: _maxAge, ...clearOptions } = COOKIE_OPTIONS;
  res.clearCookie("token", clearOptions);
  res.status(200).json({ message: "Logged out successfully" });
}
