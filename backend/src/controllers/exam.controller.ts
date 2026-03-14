import { Request, Response, NextFunction } from "express";
import { prisma } from "../config";

/** GET /api/exams — list exams with filters */
export async function listExams(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { year, subject, level, type, page = "1", limit = "20" } = req.query;

    const where: Record<string, unknown> = {};
    if (year) where.year = parseInt(year as string);
    if (subject) where.subject = subject;
    if (level) where.level = level;
    if (type) where.type = type;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        orderBy: { year: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.exam.count({ where }),
    ]);

    res.json({ exams, total, page: parseInt(page as string) });
  } catch (error) {
    next(error);
  }
}

/** GET /api/exams/:id */
export async function getExam(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id as string },
    });
    if (!exam) {
      res.status(404).json({ message: "Exam not found" });
      return;
    }
    res.json(exam);
  } catch (error) {
    next(error);
  }
}
