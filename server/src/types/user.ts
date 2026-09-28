import type { Request } from 'express';

export interface JWTPayload {
  userId: string;
}

export interface AuthRequest extends Request {
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
  accessToken: string;
  user: UserDTO;
}

export interface MeResponse {
  user: UserDTO;
}

