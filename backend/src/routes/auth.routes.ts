import { Router } from "express";
import {
  firebaseLogin,
  register,
  emailLogin,
  getProfile,
  logout,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

// Public routes — no authentication required
router.post("/firebase", firebaseLogin); // Google via Firebase
router.post("/register", register); // Email/password registration
router.post("/login", emailLogin); // Email/password login
router.post("/logout", logout); // Clear cookie

// Protected routes — JWT required
router.get("/me", authenticate, getProfile); // Get current user profile

export default router;
