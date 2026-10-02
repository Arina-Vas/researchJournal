import type { ChatMessageDTO, ChatUserDTO, ServerEvent } from '../../../../entities/message/lib/type';

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isChatUser = (value: unknown): value is ChatUserDTO =>
  isObject(value) && typeof value.id === 'string' && typeof value.email === 'string';

const isChatMessage = (value: unknown): value is ChatMessageDTO =>
  isObject(value) &&
  typeof value.id === 'string' &&
  typeof value.room === 'string' &&
  typeof value.text === 'string' &&
  typeof value.createdAt === 'string' &&
  isChatUser(value.sender);

// Keep in sync with server/src/types/chat.ts (ServerEvent)
export const parseServerEvent = (raw: unknown): ServerEvent | null => {
  if (typeof raw !== 'string') return null;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isObject(data) || !isObject(data.payload)) return null;
  const { payload } = data;

  switch (data.type) {
    case 'ROOM_HISTORY':
      if (typeof payload.room !== 'string' || !Array.isArray(payload.messages)) return null;
      if (!payload.messages.every(isChatMessage)) return null;
      return { type: 'ROOM_HISTORY', payload: { room: payload.room, messages: payload.messages } };

    case 'NEW_MESSAGE':
      return isChatMessage(payload) ? { type: 'NEW_MESSAGE', payload } : null;

    case 'ERROR':
      return typeof payload.message === 'string' ? { type: 'ERROR', payload: { message: payload.message } } : null;

    default:
      return null;
  }
};
