import { Response, NextFunction } from "express";
import { verifyToken } from "../utils";
import { AuthenticatedRequest } from "../types";

/**
 * JWT Authentication Middleware.
 *
 * Extracts the JWT from:
 *   1. Authorization header ("Bearer <token>")
 *   2. Cookie ("token")
 *
 * Attaches decoded user data to `req.user`.
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    // Extract token from header or cookie
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Verify and decode
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
