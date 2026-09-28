import type { AuthRequest } from '../types/user.js';
import type { NextFunction, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens.js';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header is missing' });
    return;
  }

  const token = authHeader.split(' ')[1] || '';

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Access token is invalid or expired' });
  }
};
