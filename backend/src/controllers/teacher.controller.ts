import { Request, Response, NextFunction } from "express";
import { prisma } from "../config";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils";

/** GET /api/teachers — search teacher marketplace */
export async function listTeachers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      subject,
      level,
      city,
      search,
      page = "1",
      limit = "12",
    } = req.query;

    const where: Record<string, unknown> = { isVerified: true };
    if (subject) where.subjects = { has: subject as string };
    if (level) where.levels = { has: level as string };
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (search) {
      where.user = {
        name: { contains: search as string, mode: "insensitive" },
      };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [teachers, total] = await Promise.all([
      prisma.teacherProfile.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatar: true, email: true } },
          _count: { select: { courses: true, bookings: true } },
        },
        orderBy: { rating: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.teacherProfile.count({ where }),
    ]);

    res.json({ teachers, total, page: parseInt(page as string) });
  } catch (error) {
    next(error);
  }
}

/** GET /api/teachers/:id — teacher profile detail */
export async function getTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        courses: {
          where: { isPublished: true },
          include: { _count: { select: { enrollments: true } } },
        },
        availability: true,
      },
    });

    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }
    res.json(teacher);
  } catch (error) {
    next(error);
  }
}

/** POST /api/teachers/profile — create/update teacher profile */
export async function upsertTeacherProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { bio, city, phone, cvUrl, pricePerHour, subjects, levels } =
      req.body;

    // Upgrade user role to teacher
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { role: "teacher" },
    });

    const profile = await prisma.teacherProfile.upsert({
      where: { userId: req.user!.userId },
      update: { bio, city, phone, cvUrl, pricePerHour, subjects, levels },
      create: {
        userId: req.user!.userId,
        bio,
        city,
        phone,
        cvUrl,
        pricePerHour,
        subjects,
        levels,
      },
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

/** PUT /api/teachers/availability — set weekly availability */
export async function setAvailability(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!profile) throw new AppError("Teacher profile required", 403);

    const { slots } = req.body; // [{ dayOfWeek, startTime, endTime }]

    // Delete existing and recreate
    await prisma.teacherAvailability.deleteMany({
      where: { profileId: profile.id },
    });
    await prisma.teacherAvailability.createMany({
      data: (
        slots as Array<{
          dayOfWeek: number;
          startTime: string;
          endTime: string;
        }>
      ).map((s) => ({ profileId: profile.id, ...s })),
    });

    res.json({ message: "Availability updated" });
  } catch (error) {
    next(error);
  }
}
