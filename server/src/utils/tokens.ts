import type { JWTPayload, VerifiedJWTPayload } from '../types/user.js';
import jwt from 'jsonwebtoken';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_123';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'refresh_secret_456';

export const generateToken = (payload: JWTPayload): Tokens => ({
  accessToken: jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' }),
});

export const verifyRefreshToken = (token: string): JWTPayload => jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;

export const verifyAccessToken = (token: string): VerifiedJWTPayload =>
  jwt.verify(token, JWT_ACCESS_SECRET) as VerifiedJWTPayload;
