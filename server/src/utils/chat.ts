import { Types } from 'mongoose';
import { Message } from '../models/Message.js';
import type { ChatMessageDTO } from '@research/shared';

export const HISTORY_LIMIT = 50;

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
