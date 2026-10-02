import { type ReactNode, useCallback, useEffect, useState } from 'react';
import type { User } from '../../../entities/user/lib/type';
import { AuthContext } from './use-auth';
import { isTokenExpired, Token, tokenStorage } from '../../../shared/api/tokenStorage';
import { loginApi } from '../../../features/login/api/loginApi';
import { refreshAccessToken } from '../../../shared/api/instance';
import { queryClient } from '../query-provider/QueryProvider';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((user: User, token: Token) => {
    tokenStorage.set(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    queryClient.clear();
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

        if (existingToken && !isTokenExpired(existingToken)) {
          const { user } = await loginApi.me();
          setUser(user);
        } else {
          await refreshAccessToken();
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
