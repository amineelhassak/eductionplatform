import { Router } from "express";
import {
  createBooking,
  listBookings,
  updateBookingStatus,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.post("/", authenticate, createBooking);
router.get("/", authenticate, listBookings);
router.patch("/:id/status", authenticate, updateBookingStatus);

export default router;
