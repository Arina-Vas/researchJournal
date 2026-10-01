let inMemoryToken: string | null = null;

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1] ?? '')) as { exp?: number };
    return !exp || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const tokenStorage = {
  get: (): string | null => inMemoryToken ?? localStorage.getItem('auth_token'),
  set: (token: string | null): void => {
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
