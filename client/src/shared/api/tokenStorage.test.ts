import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Token } from '@research/shared';
import { decodeJwtPayload, isTokenExpired, tokenStorage } from './tokenStorage';

// Builds an unsigned JWT-shaped token: the client only decodes the payload, it never verifies
const makeToken = (payload: object): Token => {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${encode({ alg: 'HS256' })}.${encode(payload)}.signature`;
};

const NOW = new Date('2026-01-01T12:00:00Z');
const nowSec = NOW.getTime() / 1000;

describe('decodeJwtPayload', () => {
  it('reads userId and exp', () => {
    const token = makeToken({ userId: 'u1', iat: nowSec, exp: nowSec + 60 });

    expect(decodeJwtPayload(token)).toMatchObject({ userId: 'u1', exp: nowSec + 60 });
  });

  it('returns null for a broken payload', () => {
    expect(decodeJwtPayload('a.!!!.c')).toBeNull();
  });

  it('returns null for a payload without required fields', () => {
    expect(decodeJwtPayload(makeToken({ userId: 'u1' }))).toBeNull();
  });
});

describe('isTokenExpired', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is false before exp and true after it', () => {
    expect(isTokenExpired(makeToken({ userId: 'u1', iat: nowSec, exp: nowSec + 60 }))).toBe(false);
    expect(isTokenExpired(makeToken({ userId: 'u1', iat: nowSec - 120, exp: nowSec - 60 }))).toBe(
      true,
    );
  });

  it('treats an unreadable token as expired', () => {
    expect(isTokenExpired('a.!!!.c')).toBe(true);
  });
});

describe('tokenStorage', () => {
  afterEach(() => {
    tokenStorage.clear();
  });

  it('saves the token to localStorage and clears it', () => {
    const token = makeToken({ userId: 'u1', iat: nowSec, exp: nowSec + 60 });

    tokenStorage.set(token);
    expect(tokenStorage.get()).toBe(token);
    expect(localStorage.getItem('auth_token')).toBe(token);

    tokenStorage.clear();
    expect(tokenStorage.get()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('removes the token when set to null', () => {
    tokenStorage.set(makeToken({ userId: 'u1', iat: nowSec, exp: nowSec + 60 }));
    tokenStorage.set(null);

    expect(tokenStorage.get()).toBeNull();
  });

  it('ignores a value in localStorage that is not a token', () => {
    localStorage.setItem('auth_token', 'garbage');

    expect(tokenStorage.get()).toBeNull();
  });
});
