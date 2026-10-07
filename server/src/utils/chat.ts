import { Types } from 'mongoose';
import { Message } from '../models/Message.js';
import { type ChatMessageDTO } from '@research/shared';
import { User } from '../models/User.js';

export const HISTORY_LIMIT = 50;

interface PopulatedSender {
  _id: Types.ObjectId;
  email: string;
}
interface PopulatedMessage {
  _id: Types.ObjectId;
  room: string;
  text: string;
  createdAt: Date;
  sender: PopulatedSender | null;
}

type PopulatedMessageWithSender = PopulatedMessage & { sender: PopulatedSender };
const hasSender = (msg: PopulatedMessage): msg is PopulatedMessageWithSender => msg.sender !== null;

export const toMessageDTO = (msg: PopulatedMessageWithSender): ChatMessageDTO => ({
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

  return messages.reverse().filter(hasSender).map(toMessageDTO);
};

export const createMessage = async (
  room: string,
  senderId: string,
  text: string,
): Promise<ChatMessageDTO | null> => {
  const isUser = await User.exists({ _id: senderId });

  if (!isUser) {
    return null;
  }

  const created = await Message.create({ room, sender: senderId, text });
  const populated = await created.populate<{ sender: PopulatedSender | null }>('sender', 'email');

  if (!populated.sender) return null;

  return toMessageDTO({
    _id: populated._id,
    room: populated.room,
    text: populated.text,
    createdAt: populated.createdAt,
    sender: populated.sender,
  });
};

export const deleteUserRooms = async (userId: string): Promise<void> => {
  await Message.deleteMany({ room: { $regex: `(^|_)${userId}($|_)` } });
};
