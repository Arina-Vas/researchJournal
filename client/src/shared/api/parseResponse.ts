import { z } from 'zod';

export const parseResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(z.prettifyError(result.error));
    throw new Error('Unexpected server response');
  }
  return result.data;
};
