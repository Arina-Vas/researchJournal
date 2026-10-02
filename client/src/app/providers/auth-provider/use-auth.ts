import { createContext, useContext } from 'react';
import type { User } from '../../../entities/user/lib/type';
import type { Token } from '../../../shared/api/tokenStorage';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: Token) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
