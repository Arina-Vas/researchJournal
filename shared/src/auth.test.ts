import { describe, expect, it } from 'vitest';
import { isToken, LoginSchema, PASSWORD_MAX_LENGTH, RegisterSchema } from './auth.js';

describe('isToken', () => {
  it('accepts a header.payload.signature string', () => {
    expect(isToken('eyJhbGci.eyJ1c2Vy.c2lnbmF0dXJl')).toBe(true);
  });

  it.each([
    ['two parts', 'a.b'],
    ['empty part', 'a..c'],
    ['spaces', 'a.b c.d'],
    ['not a string', 123],
    ['null', null],
  ])('rejects %s', (_, value) => {
    expect(isToken(value)).toBe(false);
  });
});

describe('RegisterSchema', () => {
  it('normalizes the email', () => {
    const result = RegisterSchema.parse({ email: '  User@Test.DEV ', password: 'Passw0rd!' });

    expect(result.email).toBe('user@test.dev');
  });

  it('checks password length', () => {
    expect(RegisterSchema.safeParse({ email: 'a@test.dev', password: '1234567' }).success).toBe(
      false,
    );
    expect(
      RegisterSchema.safeParse({
        email: 'a@test.dev',
        password: 'a'.repeat(PASSWORD_MAX_LENGTH + 1),
      }).success,
    ).toBe(false);
  });

  it('gives a readable message for a missing email', () => {
    const result = RegisterSchema.safeParse({ password: 'Passw0rd!' });

    expect(result.error?.issues[0]?.message).toBe('Email is required');
  });
});

describe('LoginSchema', () => {
  it('does not apply the registration length rule', () => {
    expect(LoginSchema.safeParse({ email: 'a@test.dev', password: 'short' }).success).toBe(true);
  });

  it('requires a password', () => {
    expect(LoginSchema.safeParse({ email: 'a@test.dev', password: '' }).success).toBe(false);
  });
});
