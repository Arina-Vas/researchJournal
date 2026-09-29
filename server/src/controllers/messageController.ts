import type { Request, Response } from 'express';
import { Message, type MessageItem } from '../models/Message.js';

export const getMessagesHistory = async (req: Request<{ room: string }>, res: Response) => {
  try {
    const { room } = req.params;
    const messages = await Message.find<MessageItem>({ room })
      .populate('sender', 'email')
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера при получении данных' });
  }
};
