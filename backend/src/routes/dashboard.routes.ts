import { Router } from "express";
import { studentDashboard, teacherDashboard } from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.get("/student", authenticate, studentDashboard);
router.get("/teacher", authenticate, teacherDashboard);

export default router;
