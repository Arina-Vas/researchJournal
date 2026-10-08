import { type AuthRequest } from '../types/user.js';
import type { NextFunction, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';
import { isToken, type JwtPayload } from '@research/shared';
import { User } from '../models/User.js';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header is missing' });
    return;
  }

  const token = authHeader.split(' ')[1] || '';

  if (!isToken(token)) {
    res.status(401).json({ message: 'Access token is invalid or expired' });
    return;
  }

  let payload: JwtPayload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) {
      console.error(error);
    }
    res.status(401).json({ message: 'Access token is invalid or expired' });
    return;
  }

  const user = await User.exists({ _id: payload.userId });
  if (!user) {
    res.status(401).json({ message: 'User does not exist' });
    return;
  }

  req.user = payload;
  next();
};
