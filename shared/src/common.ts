import { z } from 'zod';

export interface MessageResponse {
  message: string;
}

export const ObjectIdSchema = z.string().regex(/^[0-9a-f]{24}$/i, { error: 'Invalid id' });
