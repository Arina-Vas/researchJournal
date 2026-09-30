import type { WebSocket } from 'ws';

export interface ChatUserDTO {
  id: string;
  email: string;
}

export interface ChatMessageDTO {
  id: string;
  room: string;
  text: string;
  sender: ChatUserDTO;
  createdAt: string;
}

export interface RoomPayload {
  room: string;
}

export interface SendMessagePayload extends RoomPayload {
  text: string;
}

export type ClientEvent =
  | { type: 'JOIN_ROOM'; payload: RoomPayload }
  | { type: 'LEAVE_ROOM'; payload: RoomPayload }
  | { type: 'SEND_MESSAGE'; payload: SendMessagePayload };

export type ServerEvent =
  | { type: 'ROOM_HISTORY'; payload: { room: string; messages: ChatMessageDTO[] } }
  | { type: 'NEW_MESSAGE'; payload: ChatMessageDTO }
  | { type: 'ERROR'; payload: { message: string } };

export interface AuthedSocket extends WebSocket {
  userId: string;
  rooms: Set<string>;
  isAlive: boolean;
}
