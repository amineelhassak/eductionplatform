import { Request, Response, NextFunction } from "express";
import { prisma } from "../config";

/** GET /api/tawjih — list articles */
export async function listArticles(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { category } = req.query;
    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;

    const articles = await prisma.tawjihArticle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(articles);
  } catch (error) {
    next(error);
  }
}

/** GET /api/tawjih/:slug — single article */
export async function getArticle(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const article = await prisma.tawjihArticle.findUnique({
      where: { slug: req.params.slug as string, isPublished: true },
    });
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    res.json(article);
  } catch (error) {
    next(error);
  }
}
