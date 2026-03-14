import { Router } from "express";
import {
  listTeachers,
  getTeacher,
  upsertTeacherProfile,
  setAvailability,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

// Public
router.get("/", listTeachers);
router.get("/:id", getTeacher);

// Protected — teacher self-management
router.post("/profile", authenticate, upsertTeacherProfile);
router.put("/availability", authenticate, setAvailability);

export default router;
