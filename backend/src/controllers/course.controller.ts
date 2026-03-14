import { Request, Response, NextFunction } from "express";
import { prisma } from "../config";
import { AuthenticatedRequest } from "../types";
import { AppError } from "../utils";

/** GET /api/courses — list courses with filters */
export async function listCourses(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      level,
      subject,
      featured,
      search,
      page = "1",
      limit = "12",
    } = req.query;

    const where: Record<string, unknown> = { isPublished: true };
    if (level) where.level = level;
    if (subject) where.subject = subject;
    if (featured === "true") where.isFeatured = true;
    if (search)
      where.title = { contains: search as string, mode: "insensitive" };

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          teacher: {
            include: { user: { select: { name: true, avatar: true } } },
          },
          _count: {
            select: { enrollments: true, reviews: true, lessons: true },
          },
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.course.count({ where }),
    ]);

    const coursesWithRating = courses.map((c) => {
      const avg =
        c.reviews.length > 0
          ? c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length
          : 0;
      const { reviews: _reviews, ...rest } = c;
      return { ...rest, avgRating: Math.round(avg * 10) / 10 };
    });

    res.json({
      courses: coursesWithRating,
      total,
      page: parseInt(page as string),
    });
  } catch (error) {
    next(error);
  }
}

/** GET /api/courses/:id — single course with lessons */
export async function getCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const courseId = req.params.id as string;
    const course = await prisma.course.findUnique({
      where: { id: courseId, isPublished: true },
      include: {
        teacher: {
          include: { user: { select: { name: true, avatar: true } } },
        },
        lessons: { orderBy: { sortOrder: "asc" } },
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { enrollments: true, reviews: true } },
      },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const reviews = course.reviews as Array<{ rating: number }>;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce(
            (s: number, r: { rating: number }) => s + r.rating,
            0,
          ) / reviews.length
        : 0;

    res.json({ ...course, avgRating: Math.round(avgRating * 10) / 10 });
  } catch (error) {
    next(error);
  }
}

/** POST /api/courses — teacher creates course */
export async function createCourse(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!profile) throw new AppError("Teacher profile required", 403);

    const { title, description, level, subject, thumbnail } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        level,
        subject,
        thumbnail,
        teacherId: profile.id,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
}

/** POST /api/courses/:id/enroll — student enrolls */
export async function enrollCourse(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId: req.user!.userId, courseId: req.params.id as string },
    });
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
}

/** POST /api/courses/:id/lessons — teacher adds lesson */
export async function addLesson(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id as string },
      include: { teacher: true },
    });
    if (!course) throw new AppError("Course not found", 404);

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!profile || profile.id !== course.teacherId)
      throw new AppError("Not authorized", 403);

    const { title, description, type, fileUrl, duration, sortOrder } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title,
        description,
        type,
        fileUrl,
        duration,
        sortOrder,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    next(error);
  }
}

/** POST /api/courses/:id/reviews — student adds review */
export async function addReview(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        userId: req.user!.userId,
        courseId: req.params.id as string,
        rating,
        comment,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}
