import { z } from 'zod';

export const MessageResponseSchema = z.object({
  message: z.string(),
});
export type MessageResponse = z.infer<typeof MessageResponseSchema>;

export const ObjectIdSchema = z.string().regex(/^[0-9a-f]{24}$/i, { error: 'Invalid id' });

export const getIssueMessage = (error: z.ZodError): string =>
  error.issues[0]?.message ?? 'Invalid data';
