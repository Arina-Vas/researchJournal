import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { JwtPayload } from '@research/shared';

export interface AuthRequest<P = ParamsDictionary, ResB = unknown, ReqB = unknown, Q = ParsedQs> extends Request<
  P,
  ResB,
  ReqB,
  Q
> {
  user?: JwtPayload;
}
