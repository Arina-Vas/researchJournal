export type Token = `${string}.${string}.${string}`;

const TOKEN_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/; // base64url header.payload.signature

export const isToken = (value: unknown): value is Token => typeof value === 'string' && TOKEN_REGEX.test(value);

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