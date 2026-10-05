import { isToken, type JwtPayload, JwtPayloadSchema, type Token } from '@research/shared';

let inMemoryToken: Token | null = null;

export const decodeJwtPayload = (token: Token): JwtPayload | null => {
  try {
    const base64 = (token.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/');
    const result = JwtPayloadSchema.safeParse(JSON.parse(atob(base64)));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: Token): boolean => {
  const payload = decodeJwtPayload(token);
  return !payload || payload.exp * 1000 <= Date.now();
};

export const tokenStorage = {
  get: (): Token | null => {
    if (inMemoryToken) return inMemoryToken;
    const storedToken = localStorage.getItem('auth_token');
    return isToken(storedToken) ? storedToken : null;
  },
  set: (token: Token | null): void => {
    inMemoryToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },
  clear: (): void => {
    inMemoryToken = null;
    localStorage.removeItem('auth_token');
  },
};
