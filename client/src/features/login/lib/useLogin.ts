import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/loginApi';
import { useAuth } from '../../../app/providers/auth-provider/use-auth';
import { useNavigate, useRouter } from '@tanstack/react-router';
import type { AuthDTO } from '../../../entities/user/lib/type';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const useSignUpMutation = (onSuccessFn?: () => void) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'signUp'],
    mutationFn: (credentials: AuthDTO) => loginApi.signUp(credentials),
    onSuccess: data => {
      setAuth(data.user, data.accessToken);
      toast.success(data.message, { position: 'top-right' });
      onSuccessFn?.();
      router.invalidate();
      navigate({ to: '/' });
    },
  });
};

export const useSignInMutation = (onSuccessFn?: () => void) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: (credentials: AuthDTO) => loginApi.signIn(credentials),
    onSuccess: data => {
      setAuth(data.user, data.accessToken);
      toast.success(data.message, { position: 'top-right' });
      onSuccessFn?.();
      router.invalidate();
      navigate({ to: '/' });
    },
  });
};

export const useSignOutMutation = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();


  return useMutation({
    mutationKey: ['auth', 'signOut'],
    mutationFn: () => loginApi.logOut(),
    onSuccess: () => {
      logout();
      router.invalidate();
      navigate({ to: '/login' });
    },
    onError: () => {
      logout();
    },
  });
};
