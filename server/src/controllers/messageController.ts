import type { Response } from 'express';
import type { AuthRequest } from '../types/user.js';
import { getRoomHistory, isRoomMember } from '../utils/chat.js';
import type { ChatMessageDTO, MessageResponse } from '@research/shared';

export const getMessagesHistory = async (
  req: AuthRequest<{ room: string }>,
  res: Response<ChatMessageDTO[] | MessageResponse>,
) => {
  try {
    const { room } = req.params;
    const userId = req.user?.userId;

    if (!userId || !isRoomMember(room, userId)) {
      res.status(403).json({ message: 'Access to this room is denied' });
      return;
    }

    res.json(await getRoomHistory(room));
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера при получении данных' });
  }
};
