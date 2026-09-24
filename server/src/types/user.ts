import type { Request } from 'express';

export interface JWTPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

interface AuthDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}
