import { type ReactNode, useCallback, useEffect, useState } from 'react';
import type { User } from '../../../entities/user/lib/type';
import { AuthContext } from './use-auth';
import { tokenStorage } from '../../../shared/api/tokenStorage';
import { loginApi } from '../../../features/login/api/loginApi';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((user: User, token: string) => {
    tokenStorage.set(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const existingToken = tokenStorage.get();

        if (existingToken) {
          const { user } = await loginApi.me();
          setUser(user);
        } else {
          const { accessToken } = await loginApi.refresh();
          tokenStorage.set(accessToken);
          const { user } = await loginApi.me();
          setUser(user);
        }
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
