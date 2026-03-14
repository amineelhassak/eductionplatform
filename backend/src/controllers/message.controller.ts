import { Response, NextFunction } from "express";
import { prisma } from "../config";
import { AuthenticatedRequest } from "../types";

/** POST /api/messages — send message */
export async function sendMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { receiverId, content } = req.body;
    const message = await prisma.message.create({
      data: { senderId: req.user!.userId, receiverId, content },
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

/** GET /api/messages/conversations — list conversations */
export async function getConversations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;

    // Get distinct conversation partners
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Group by conversation partner
    const seen = new Set<string>();
    const conversations = messages
      .map((m) => {
        const partner = m.senderId === userId ? m.receiver : m.sender;
        if (seen.has(partner.id)) return null;
        seen.add(partner.id);
        return {
          partner,
          lastMessage: m.content,
          lastMessageAt: m.createdAt,
          isRead: m.isRead,
        };
      })
      .filter(Boolean);

    res.json(conversations);
  } catch (error) {
    next(error);
  }
}

/** GET /api/messages/:userId — get messages with a user */
export async function getMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const partnerId = req.params.userId as string;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: userId, isRead: false },
      data: { isRead: true },
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
}
