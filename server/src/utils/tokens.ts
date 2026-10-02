import type { JWTPayload, VerifiedJWTPayload } from '../types/user.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import  { isToken, type Token } from '@research/shared';

interface Tokens {
  accessToken: Token;
  refreshToken: Token;
}

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
};

const JWT_ACCESS_SECRET = requireEnv('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET');

const signToken = (payload: JWTPayload, secret: string, expiresIn: SignOptions['expiresIn']): Token => {
  const token = jwt.sign(payload, secret, { expiresIn });
  if (!isToken(token)) throw new Error('jwt.sign returned malformed token');
  return token;
};

export const generateToken = (payload: JWTPayload): Tokens => ({
  accessToken: signToken(payload, JWT_ACCESS_SECRET, '15m'),
  refreshToken: signToken(payload, JWT_REFRESH_SECRET, '7d'),
});

export const verifyRefreshToken = (token: Token): JWTPayload => jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;

export const verifyAccessToken = (token: Token): VerifiedJWTPayload =>
  jwt.verify(token, JWT_ACCESS_SECRET) as VerifiedJWTPayload;
