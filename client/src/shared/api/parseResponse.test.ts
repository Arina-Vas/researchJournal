import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { parseResponse } from './parseResponse';

const UserSchema = z.object({ id: z.string(), email: z.email() });

describe('parseResponse', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed data for a valid response', () => {
    const data = { id: '1', email: 'a@test.dev' };

    expect(parseResponse(UserSchema, data)).toEqual(data);
  });

  it('strips fields that are not in the schema', () => {
    expect(parseResponse(UserSchema, { id: '1', email: 'a@test.dev', extra: true })).toEqual({
      id: '1',
      email: 'a@test.dev',
    });
  });

  it('throws a generic error and logs details for an invalid response', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => parseResponse(UserSchema, { id: 1 })).toThrow('Unexpected server response');
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
