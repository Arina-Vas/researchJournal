import type { JWTPayload, VerifiedJWTPayload } from '../types/user.js';
import jwt from 'jsonwebtoken';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
};

const JWT_ACCESS_SECRET = requireEnv('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET');

export const generateToken = (payload: JWTPayload): Tokens => ({
  accessToken: jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' }),
});

export const verifyRefreshToken = (token: string): JWTPayload => jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;

export const verifyAccessToken = (token: string): VerifiedJWTPayload =>
  jwt.verify(token, JWT_ACCESS_SECRET) as VerifiedJWTPayload;
