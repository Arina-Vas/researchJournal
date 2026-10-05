import jwt, { type SignOptions } from 'jsonwebtoken';
import { isToken, type JwtPayload, JwtPayloadSchema, type Token } from '@research/shared';

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

const signToken = (payload: Pick<JwtPayload, 'userId'>, secret: string, expiresIn: SignOptions['expiresIn']): Token => {
  const token = jwt.sign(payload, secret, { expiresIn });
  if (!isToken(token)) throw new Error('jwt.sign returned malformed token');
  return token;
};

export const generateToken = (payload: Pick<JwtPayload, 'userId'>): Tokens => ({
  accessToken: signToken(payload, JWT_ACCESS_SECRET, '15m'),
  refreshToken: signToken(payload, JWT_REFRESH_SECRET, '7d'),
});

const verifyToken = (token: Token, secret: string): JwtPayload => {
  const result = JwtPayloadSchema.safeParse(jwt.verify(token, secret));
  if (!result.success) throw new jwt.JsonWebTokenError('Invalid token payload');
  return result.data;
};

export const verifyAccessToken = (token: Token) => verifyToken(token, JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token: Token) => verifyToken(token, JWT_REFRESH_SECRET);
