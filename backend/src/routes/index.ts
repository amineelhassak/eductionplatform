import { Router } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import examRoutes from "./exam.routes";
import teacherRoutes from "./teacher.routes";
import bookingRoutes from "./booking.routes";
import messageRoutes from "./message.routes";
import tawjihRoutes from "./tawjih.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/exams", examRoutes);
router.use("/teachers", teacherRoutes);
router.use("/bookings", bookingRoutes);
router.use("/messages", messageRoutes);
router.use("/tawjih", tawjihRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
