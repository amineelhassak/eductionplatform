import { Router } from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  enrollCourse,
  addLesson,
  addReview,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

// Public
router.get("/", listCourses);
router.get("/:id", getCourse);

// Protected
router.post("/", authenticate, createCourse);
router.post("/:id/enroll", authenticate, enrollCourse);
router.post("/:id/lessons", authenticate, addLesson);
router.post("/:id/reviews", authenticate, addReview);

export default router;
