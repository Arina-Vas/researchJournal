import { describe, expect, it } from 'vitest';
import {
  ChatRoomSchema,
  getPeerId,
  isRoomMember,
  parseClientEvent,
  parseServerEvent,
} from './chat.js';

const A = '6ac6320ca1aeab81d22cd31a';
const B = '6ac6320ca1aeab81d22cd31c';
const C = '6ac6320ca1aeab81d22cd31e';

describe('ChatRoomSchema', () => {
  it('accepts two sorted distinct ids', () => {
    expect(ChatRoomSchema.safeParse(`${A}_${B}`).success).toBe(true);
  });

  it.each([
    ['reversed order', `${B}_${A}`],
    ['same user twice', `${A}_${A}`],
    ['not an id', 'abc'],
    ['three ids', `${A}_${B}_${C}`],
  ])('rejects %s', (_, room) => {
    expect(ChatRoomSchema.safeParse(room).success).toBe(false);
  });
});

describe('isRoomMember', () => {
  it('is true for a participant', () => {
    expect(isRoomMember(`${A}_${B}`, A)).toBe(true);
  });

  it('is false for someone else', () => {
    expect(isRoomMember(`${B}_${C}`, A)).toBe(false);
  });

  it('is false for a non-canonical room even if the user is in it', () => {
    expect(isRoomMember(`${B}_${A}`, A)).toBe(false);
  });
});

describe('getPeerId', () => {
  it('returns the other participant', () => {
    expect(getPeerId(`${A}_${B}`, A)).toBe(B);
    expect(getPeerId(`${A}_${B}`, B)).toBe(A);
  });
});

describe('parseClientEvent', () => {
  it('parses a valid event and trims the message text', () => {
    const raw = JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: { room: `${A}_${B}`, text: '  hi  ' },
    });

    expect(parseClientEvent(raw)).toEqual({
      type: 'SEND_MESSAGE',
      payload: { room: `${A}_${B}`, text: 'hi' },
    });
  });

  it.each([
    ['not a string', { type: 'JOIN_ROOM' }],
    ['broken JSON', '{bad'],
    ['unknown type', JSON.stringify({ type: 'DELETE_ROOM', payload: { room: 'x' } })],
    [
      'empty message',
      JSON.stringify({ type: 'SEND_MESSAGE', payload: { room: 'x', text: '   ' } }),
    ],
  ])('returns null for %s', (_, raw) => {
    expect(parseClientEvent(raw)).toBeNull();
  });
});

describe('parseServerEvent', () => {
  it('parses an error event', () => {
    const raw = JSON.stringify({ type: 'ERROR', payload: { message: 'Access denied' } });

    expect(parseServerEvent(raw)).toEqual({ type: 'ERROR', payload: { message: 'Access denied' } });
  });

  it('returns null for a message with an invalid date', () => {
    const raw = JSON.stringify({
      type: 'NEW_MESSAGE',
      payload: {
        id: '1',
        room: 'r',
        text: 'hi',
        sender: { id: A, email: 'a@test.dev' },
        createdAt: 'yesterday',
      },
    });

    expect(parseServerEvent(raw)).toBeNull();
  });
});
