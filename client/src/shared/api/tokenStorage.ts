import { isToken, type Token } from '@research/shared';

let inMemoryToken: Token | null = null;

export const isTokenExpired = (token: Token): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''));

    if (typeof payload !== 'object' || payload === null || !('exp' in payload) || typeof payload.exp !== 'number') {
      return true;
    }

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
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
