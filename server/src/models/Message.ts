import { model, Schema, Types } from 'mongoose';
import { WebSocket } from 'ws';

export interface MessageItem {
  sender: Types.ObjectId;
  text: string;
  room: string;
  createdAt?: Date;
}

const MessageSchema = new Schema<MessageItem>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    room: { type: String, required: true },
  },
  { timestamps: true },
);

export const Message = model<MessageItem>('Message', MessageSchema);

export interface CustomWebSocket extends WebSocket {
  room?: string;
  senderId?: string;
}

export const WsEventType = {
  JOIN_ROOM: 'JOIN_ROOM',
  SEND_MESSAGE: 'SEND_MESSAGE',

  ROOM_HISTORY: 'ROOM_HISTORY',
  NEW_MESSAGE: 'NEW_MESSAGE',
} as const;

export type WsEventType = (typeof WsEventType)[keyof typeof WsEventType];

export interface MessagePayload {
  room: string;
  senderId: string;
}

export interface SendMessagePayload extends MessagePayload {
  text: string;
}

export type IncomingWsMessage =
  { type: 'JOIN_ROOM'; payload: MessagePayload } | { type: 'SEND_MESSAGE'; payload: SendMessagePayload };

export type OutgoingWsMessage =
  { type: 'ROOM_HISTORY'; payload: MessageItem[] } | { type: 'NEW_MESSAGE'; payload: MessageItem };
