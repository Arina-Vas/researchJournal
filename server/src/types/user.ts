import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

// Keep in sync with client/src/shared/api/tokenStorage.ts
export type Token = `${string}.${string}.${string}`;

const TOKEN_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/; // base64url header.payload.signature

export const isToken = (value: unknown): value is Token => typeof value === 'string' && TOKEN_REGEX.test(value);

export interface JWTPayload {
  userId: string;
}

export interface VerifiedJWTPayload extends JWTPayload {
  iat: number;
  exp: number;
}

export interface AuthRequest<P = ParamsDictionary, ResB = unknown, ReqB = unknown, Q = ParsedQs> extends Request<
  P,
  ResB,
  ReqB,
  Q
> {
  user?: JWTPayload;
}

export interface AuthDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  accessToken: Token;
  user: UserDTO;
}

export interface RefreshResponse {
  accessToken: Token;
}

export interface MeResponse {
  user: UserDTO;
}
