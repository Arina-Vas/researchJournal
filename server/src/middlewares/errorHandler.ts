import type { NextFunction, Request, Response } from 'express';
import type { MessageResponse } from '@research/shared';

const getStatus = (err: unknown): number =>
  typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
    ? err.status
    : 500;

export const notFoundHandler = (_req: Request, res: Response<MessageResponse>) => {
  res.status(404).json({ message: 'Not found' });
};

// Express recognises error middleware by its 4 arguments, so _next must stay
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<MessageResponse>,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON' });
    return;
  }

  const status = getStatus(err);

  if (status === 413) {
    res.status(413).json({ message: 'Request body is too large' });
    return;
  }

  if (status >= 500) {
    console.error(`${req.method} ${req.originalUrl}`, err);
    res.status(500).json({ message: 'Server error' });
    return;
  }

  res.status(status).json({ message: 'Bad request' });
};
