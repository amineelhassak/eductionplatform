import { Router } from "express";
import { listArticles, getArticle } from "../controllers";

const router = Router();

router.get("/", listArticles);
router.get("/:slug", getArticle);

export default router;
