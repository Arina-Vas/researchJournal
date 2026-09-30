import type { RawData } from 'ws';
import { Types } from 'mongoose';
import { Message } from '../models/Message.js';
import type { ChatMessageDTO, ClientEvent } from '../types/chat.js';

export const MAX_MESSAGE_LENGTH = 1000;
export const HISTORY_LIMIT = 50;

export const getRoomId = (a: string, b: string): string => [a, b].sort().join('_');

export const isRoomMember = (room: string, userId: string): boolean => {
  const ids = room.split('_');
  return ids.length === 2 && ids.every(id => Types.ObjectId.isValid(id)) && ids.includes(userId);
};

interface PopulatedMessage {
  _id: Types.ObjectId;
  room: string;
  text: string;
  createdAt: Date;
  sender: { _id: Types.ObjectId; email: string };
}

export const toMessageDTO = (msg: PopulatedMessage): ChatMessageDTO => ({
  id: msg._id.toString(),
  room: msg.room,
  text: msg.text,
  createdAt: msg.createdAt.toISOString(),
  sender: { id: msg.sender._id.toString(), email: msg.sender.email },
});

export const getRoomHistory = async (room: string): Promise<ChatMessageDTO[]> => {
  const messages = await Message.find({ room })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .populate<{ sender: PopulatedMessage['sender'] }>('sender', 'email')
    .lean<PopulatedMessage[]>();

  return messages.reverse().map(toMessageDTO);
};

export const createMessage = async (room: string, senderId: string, text: string): Promise<ChatMessageDTO> => {
  const created = await Message.create({ room, sender: senderId, text });
  const populated = await created.populate<{ sender: PopulatedMessage['sender'] }>('sender', 'email');

  return toMessageDTO({
    _id: populated._id,
    room: populated.room,
    text: populated.text,
    createdAt: populated.createdAt,
    sender: populated.sender,
  });
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export const parseClientEvent = (raw: RawData): ClientEvent | null => {
  let data: unknown;
  try {
    data = JSON.parse(raw.toString());
  } catch {
    return null;
  }

  if (!isObject(data) || !isObject(data.payload) || typeof data.payload.room !== 'string') {
    return null;
  }

  const room = data.payload.room;

  switch (data.type) {
    case 'JOIN_ROOM':
    case 'LEAVE_ROOM':
      return { type: data.type, payload: { room } };
    case 'SEND_MESSAGE': {
      if (typeof data.payload.text !== 'string') return null;
      const text = data.payload.text.trim();
      if (!text || text.length > MAX_MESSAGE_LENGTH) return null;
      return { type: 'SEND_MESSAGE', payload: { room, text } };
    }
    default:
      return null;
  }
};
