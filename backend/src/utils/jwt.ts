import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { config } from "../config";
import { JwtPayload } from "../types";

/**
 * Generate a signed JWT for the given user.
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as StringValue,
  });
}

/**
 * Verify and decode a JWT. Returns the payload or throws on invalid/expired tokens.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
