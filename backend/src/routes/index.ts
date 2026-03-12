import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

// Add more route groups here as the platform grows:
// router.use("/courses", courseRoutes);
// router.use("/users", userRoutes);

export default router;
