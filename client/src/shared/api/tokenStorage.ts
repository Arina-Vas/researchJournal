let inMemoryToken: string | null = null;

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
