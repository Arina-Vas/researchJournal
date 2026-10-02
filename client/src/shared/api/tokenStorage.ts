// Keep in sync with server/src/types/user.ts
export type Token = `${string}.${string}.${string}`;

const TOKEN_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/; // base64url header.payload.signature

export const isToken = (value: unknown): value is Token => typeof value === 'string' && TOKEN_REGEX.test(value);

let inMemoryToken: Token | null = null;

export const isTokenExpired = (token: Token): boolean => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1] ?? '')) as { exp?: number };
    return !exp || exp * 1000 <= Date.now();
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
