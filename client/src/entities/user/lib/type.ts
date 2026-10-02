import type { Token } from '../../../shared/api/tokenStorage';

export interface User {
  id: string;
  email: string;
}

export interface AuthDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: Token;
  user: User;
}

export interface RefreshResponse {
  accessToken: Token;
}

export interface MeResponse {
  user: User;
}
