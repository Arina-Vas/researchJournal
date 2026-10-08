import { describe, expect, it } from 'vitest';
import { ChatRoomSchema } from '@research/shared';
import { getRoomId } from './getRoomId';

const A = '6ac6320ca1aeab81d22cd31a';
const B = '6ac6320ca1aeab81d22cd31c';

describe('getRoomId', () => {
  it('joins two ids with an underscore', () => {
    expect(getRoomId(A, B)).toBe(`${A}_${B}`);
  });

  it('returns the same room regardless of argument order', () => {
    expect(getRoomId(B, A)).toBe(getRoomId(A, B));
  });

  it('builds a room that passes the shared room schema', () => {
    expect(ChatRoomSchema.safeParse(getRoomId(B, A)).success).toBe(true);
  });
});
