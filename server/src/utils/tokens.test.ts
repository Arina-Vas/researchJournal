import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Token } from '@research/shared';

// tokens.ts reads the secrets when it is imported, so they are stubbed first and the module is loaded after
vi.stubEnv('JWT_ACCESS_SECRET', 'test-access-secret');
vi.stubEnv('JWT_REFRESH_SECRET', 'test-refresh-secret');

let tokens: typeof import('./tokens.js');

beforeAll(async () => {
  tokens = await import('./tokens.js');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('hashToken', () => {
  it('returns a stable sha256 hex string', () => {
    const token: Token = 'a.b.c';

    expect(tokens.hashToken(token)).toMatch(/^[0-9a-f]{64}$/);
    expect(tokens.hashToken(token)).toBe(tokens.hashToken(token));
  });

  it('gives different hashes for different tokens', () => {
    expect(tokens.hashToken('a.b.c')).not.toBe(tokens.hashToken('a.b.d'));
  });
});

describe('generateToken', () => {
  it('issues tokens that verify with their own secret', () => {
    const { accessToken, refreshToken } = tokens.generateToken({ userId: 'u1' });

    expect(tokens.verifyAccessToken(accessToken).userId).toBe('u1');
    expect(tokens.verifyRefreshToken(refreshToken).userId).toBe('u1');
  });

  it('does not accept an access token as a refresh token', () => {
    const { accessToken } = tokens.generateToken({ userId: 'u1' });

    expect(() => tokens.verifyRefreshToken(accessToken)).toThrow(jwt.JsonWebTokenError);
  });

  it('issues unique tokens even within the same second', () => {
    const first = tokens.generateToken({ userId: 'u1' });
    const second = tokens.generateToken({ userId: 'u1' });

    expect(first.refreshToken).not.toBe(second.refreshToken);
  });

  it('expires the access token after 15 minutes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
    const { accessToken } = tokens.generateToken({ userId: 'u1' });

    vi.setSystemTime(new Date('2026-01-01T12:14:59Z'));
    expect(tokens.verifyAccessToken(accessToken).userId).toBe('u1');

    vi.setSystemTime(new Date('2026-01-01T12:15:01Z'));
    expect(() => tokens.verifyAccessToken(accessToken)).toThrow(jwt.TokenExpiredError);
  });

  it('rejects a token with a payload that does not match the schema', () => {
    const token = jwt.sign({ foo: 'bar' }, 'test-access-secret') as Token;

    expect(() => tokens.verifyAccessToken(token)).toThrow('Invalid token payload');
  });
});
