// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { loginApi } from '@/features/login/api/loginApi.ts';
// import { useNavigate } from 'react-router';
// import { getReadableErrorMessage } from '@/shared/utils/getReadableErrorMessage.ts';
// import { toast } from 'react-toastify';
//
// export const useSignUpMutation = (onSuccessFn: () => void) => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationKey: [],
//     mutationFn: ({ email, password }: { email: string; password: string }) => loginApi.signUp(email, password),
//     onSuccess: () => {
//       onSuccessFn();
//       queryClient.invalidateQueries({ queryKey: ['currentUser'] });
//       navigate('/');
//     },
//     onError: error => {
//       const readableError = getReadableErrorMessage(error);
//       toast(readableError, {
//         position: 'top-right',
//       });
//     },
//   });
// };
//
// export const useSignInMutation = (onSuccessFn: () => void) => {
//   const navigate = useNavigate();
//   return useMutation({
//     mutationKey: [],
//     mutationFn: ({ email, password }: { email: string; password: string }) => loginApi.signIn(email, password),
//     onSuccess: () => {
//       onSuccessFn();
//       navigate('/');
//     },
//     onError: error => {
//       const readableError = getReadableErrorMessage(error);
//       toast(readableError, {
//         position: 'top-right',
//       });
//     },
//   });
// };
//
// export const useSignOutMutation = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationKey: [],
//     mutationFn: loginApi.logOut,
//     onSuccess: () => {
//       queryClient.clear();
//       navigate('/login');
//     },
//     onError: error => {
//       console.error('Ошибка авторизации:', error.message);
//     },
//   });
// };
