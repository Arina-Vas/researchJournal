import { z } from 'zod';
import { UserDTOSchema } from './auth.js';

export const WS_CLOSE_TOKEN_EXPIRED = 4001;
export const MAX_MESSAGE_LENGTH = 1000;

export const ChatMessageSchema = z.object({
  id: z.string(),
  room: z.string(),
  text: z.string(),
  sender: UserDTOSchema,
  createdAt: z.iso.datetime(),
});
export type ChatMessageDTO = z.infer<typeof ChatMessageSchema>;

export const RoomPayloadSchema = z.object({
  room: z.string().min(1),
});
export type RoomPayload = z.infer<typeof RoomPayloadSchema>;

export const SendMessagePayloadSchema = RoomPayloadSchema.extend({
  text: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});
export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;

// Client → server
export const ClientEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('JOIN_ROOM'), payload: RoomPayloadSchema }),
  z.object({ type: z.literal('LEAVE_ROOM'), payload: RoomPayloadSchema }),
  z.object({ type: z.literal('SEND_MESSAGE'), payload: SendMessagePayloadSchema }),
]);
export type ClientEvent = z.infer<typeof ClientEventSchema>;

// Server → client
export const ServerEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('ROOM_HISTORY'),
    payload: z.object({ room: z.string(), messages: z.array(ChatMessageSchema) }),
  }),
  z.object({ type: z.literal('NEW_MESSAGE'), payload: ChatMessageSchema }),
  z.object({ type: z.literal('ERROR'), payload: z.object({ message: z.string() }) }),
]);
export type ServerEvent = z.infer<typeof ServerEventSchema>;

// Parses a raw WS frame (JSON string) against a schema; null for anything invalid
const parseEvent = <T>(schema: z.ZodType<T>, raw: unknown): T | null => {
  if (typeof raw !== 'string') return null;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  const result = schema.safeParse(data);
  return result.success ? result.data : null;
};

export const parseClientEvent = (raw: unknown): ClientEvent | null => parseEvent(ClientEventSchema, raw);

export const parseServerEvent = (raw: unknown): ServerEvent | null => parseEvent(ServerEventSchema, raw);
