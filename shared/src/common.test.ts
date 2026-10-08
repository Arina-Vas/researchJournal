import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getIssueMessage, ObjectIdSchema } from './common.js';

describe('ObjectIdSchema', () => {
  it('accepts a 24-character hex id', () => {
    expect(ObjectIdSchema.safeParse('6ac6320ca1aeab81d22cd31a').success).toBe(true);
  });

  it.each(['abc', '6ac6320ca1aeab81d22cd31', '6ac6320ca1aeab81d22cd31z'])('rejects %s', id => {
    expect(ObjectIdSchema.safeParse(id).success).toBe(false);
  });
});

describe('getIssueMessage', () => {
  it('returns the first issue message', () => {
    const result = z.object({ id: ObjectIdSchema }).safeParse({ id: 'abc' });

    expect(getIssueMessage(result.error!)).toBe('Invalid id');
  });

  it('falls back to a default message when there are no issues', () => {
    expect(getIssueMessage(new z.ZodError([]))).toBe('Invalid data');
  });
});
