import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

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
