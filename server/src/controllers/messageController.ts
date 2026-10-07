import type { Response } from 'express';
import type { AuthRequest } from '../types/user.js';
import { getRoomHistory, isRoomMember } from '../utils/chat.js';
import type { ChatMessageDTO, MessageResponse } from '@research/shared';

// NOTE: Not used by the client yet. Room history is currently delivered over WebSocket
// (JOIN_ROOM → ROOM_HISTORY, last HISTORY_LIMIT messages).
// Kept as a base for loading older messages, e.g.
// GET /api/messages/:room?before=<ISO date>&limit=<n> for infinite scroll.
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
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};
