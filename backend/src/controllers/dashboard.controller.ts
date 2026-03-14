import { Response, NextFunction } from "express";
import { prisma } from "../config";
import { AuthenticatedRequest } from "../types";

/** GET /api/dashboard/student — student dashboard data */
export async function studentDashboard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;

    const [enrollments, savedLessons, bookings] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              teacher: { include: { user: { select: { name: true } } } },
              _count: { select: { lessons: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.savedLesson.findMany({
        where: { userId },
        include: {
          lesson: { include: { course: { select: { title: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          teacher: {
            include: { user: { select: { name: true, avatar: true } } },
          },
        },
        orderBy: { date: "desc" },
        take: 10,
      }),
    ]);

    res.json({ enrollments, savedLessons, bookings });
  } catch (error) {
    next(error);
  }
}

/** GET /api/dashboard/teacher — teacher dashboard data */
export async function teacherDashboard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      res.json({
        courses: [],
        bookings: [],
        totalStudents: 0,
        totalEarnings: 0,
      });
      return;
    }

    const [courses, bookings, messageCount] = await Promise.all([
      prisma.course.findMany({
        where: { teacherId: profile.id },
        include: {
          _count: {
            select: { enrollments: true, lessons: true, reviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.findMany({
        where: { teacherId: profile.id },
        include: {
          student: { select: { name: true, avatar: true, email: true } },
        },
        orderBy: { date: "desc" },
        take: 20,
      }),
      prisma.message.count({ where: { receiverId: userId, isRead: false } }),
    ]);

    const totalStudents = courses.reduce(
      (sum, c) => sum + c._count.enrollments,
      0,
    );
    const completedBookings = await prisma.booking.count({
      where: { teacherId: profile.id, status: "completed" },
    });
    const totalEarnings = completedBookings * (profile.pricePerHour ?? 0);

    res.json({
      courses,
      bookings,
      totalStudents,
      totalEarnings,
      unreadMessages: messageCount,
    });
  } catch (error) {
    next(error);
  }
}
