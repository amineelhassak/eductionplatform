import * as admin from "firebase-admin";
import { config } from "./env";
import path from "path";
import fs from "fs";

/**
 * Initialize Firebase Admin SDK.
 * Supports two modes:
 *   1. Service account JSON file (recommended for local dev)
 *   2. Inline environment variables (recommended for production/CI)
 */
function initializeFirebase(): admin.app.App {
  // Already initialized
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Option 1: Service account file
  if (config.firebaseServiceAccountPath) {
    const absolutePath = path.resolve(config.firebaseServiceAccountPath);
    if (fs.existsSync(absolutePath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  // Option 2: Inline credentials from env vars
  if (
    config.firebaseProjectId &&
    config.firebasePrivateKey &&
    config.firebaseClientEmail
  ) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebaseProjectId,
        privateKey: config.firebasePrivateKey,
        clientEmail: config.firebaseClientEmail,
      }),
    });
  }

  console.warn(
    "⚠️  Firebase Admin SDK credentials not found. " +
      "Social login (Google) will not work. " +
      "Provide FIREBASE_SERVICE_ACCOUNT_PATH or inline FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL.",
  );
  return admin.initializeApp();
}

export const firebaseApp = initializeFirebase();
export const firebaseAuth = admin.apps.length > 0 ? admin.auth() : null;
