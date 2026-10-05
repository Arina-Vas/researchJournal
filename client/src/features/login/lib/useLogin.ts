import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/loginApi';
import { useAuth } from '../../../app/providers/auth-provider/use-auth';
import { toast } from 'react-toastify';
import type { LoginDTO, RegisterDTO } from '@research/shared';

export const useSignUpMutation = (onSuccessFn?: () => void) => {
  const { setAuth } = useAuth();

  return useMutation({
    mutationKey: ['auth', 'signUp'],
    mutationFn: (credentials: RegisterDTO) => loginApi.signUp(credentials),
    onSuccess: data => {
      setAuth(data.user, data.accessToken);
      toast.success(data.message, { position: 'top-right' });
      onSuccessFn?.();
    },
  });
};

export const useSignInMutation = (onSuccessFn?: () => void) => {
  const { setAuth } = useAuth();

  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: (credentials: LoginDTO) => loginApi.signIn(credentials),
    onSuccess: data => {
      setAuth(data.user, data.accessToken);
      toast.success(data.message, { position: 'top-right' });
      onSuccessFn?.();
    },
  });
};

export const useSignOutMutation = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationKey: ['auth', 'signOut'],
    mutationFn: () => loginApi.logOut(),
    onSuccess: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });
};
