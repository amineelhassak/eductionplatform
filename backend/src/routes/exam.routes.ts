import { Router } from "express";
import { listExams, getExam } from "../controllers";

const router = Router();

router.get("/", listExams);
router.get("/:id", getExam);

export default router;
