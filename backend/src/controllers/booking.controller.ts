import { Response, NextFunction } from "express";
import { prisma } from "../config";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils";

/** POST /api/bookings — student books a lesson */
export async function createBooking(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { teacherId, date, startTime, endTime, mode, subject, note } =
      req.body;

    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });
    if (!teacher) throw new AppError("Teacher not found", 404);

    const booking = await prisma.booking.create({
      data: {
        studentId: req.user!.userId,
        teacherId,
        date: new Date(date),
        startTime,
        endTime,
        mode,
        subject,
        note,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

/** GET /api/bookings — list user's bookings */
export async function listBookings(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    let bookings;
    if (user?.role === "teacher") {
      const profile = await prisma.teacherProfile.findUnique({
        where: { userId },
      });
      if (!profile) throw new AppError("Teacher profile not found", 404);
      bookings = await prisma.booking.findMany({
        where: { teacherId: profile.id },
        include: {
          student: { select: { name: true, avatar: true, email: true } },
        },
        orderBy: { date: "desc" },
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          teacher: {
            include: { user: { select: { name: true, avatar: true } } },
          },
        },
        orderBy: { date: "desc" },
      });
    }

    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

/** PATCH /api/bookings/:id/status — update booking status */
export async function updateBookingStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id as string },
      data: { status },
    });
    res.json(booking);
  } catch (error) {
    next(error);
  }
}
