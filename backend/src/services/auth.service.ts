import bcrypt from "bcrypt";
import { AuthProvider } from "@prisma/client";
import { prisma, firebaseAuth } from "../config";
import { generateToken, AppError } from "../utils";
import { AuthResponse } from "../types";

const SALT_ROUNDS = 12;

/**
 * Verify a Firebase ID token and upsert the user in the database.
 * Returns our own JWT + user data.
 */
export async function loginWithFirebase(
  firebaseToken: string,
): Promise<AuthResponse> {
  if (!firebaseAuth) {
    throw new AppError(
      "Firebase is not configured. Social login is unavailable.",
      503,
    );
  }

  // 1. Verify the Firebase ID token
  let decodedToken;
  try {
    decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);
  } catch {
    throw new AppError("Invalid or expired Firebase token", 401);
  }

  const { uid, email, name, picture } = decodedToken;

  if (!email) {
    throw new AppError("Email not provided by the OAuth provider", 400);
  }

  // 2. Determine the auth provider
  const providerData = decodedToken.firebase?.sign_in_provider;
  let provider: AuthProvider = AuthProvider.email;
  if (providerData === "google.com") provider = AuthProvider.google;

  // 3. Upsert user — create if new, update if existing
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: name ?? undefined,
      avatar: picture ?? undefined,
      providerId: uid,
    },
    create: {
      email,
      name: name ?? null,
      avatar: picture ?? null,
      provider,
      providerId: uid,
    },
  });

  // 4. Generate our own JWT
  const token = generateToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    },
  };
}

/**
 * Register a new user with email and password.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      provider: AuthProvider.email,
    },
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    },
  };
}

/**
 * Login with email and password.
 */
export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    },
  };
}

/**
 * Get user profile by ID.
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      provider: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}
