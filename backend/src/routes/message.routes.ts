import { Router } from "express";
import { sendMessage, getConversations, getMessages } from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.post("/", authenticate, sendMessage);
router.get("/conversations", authenticate, getConversations);
router.get("/:userId", authenticate, getMessages);

export default router;
