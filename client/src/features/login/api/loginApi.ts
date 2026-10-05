import { instance } from '../../../shared/api/instance';
import type { AuthResponse, LoginDTO, MeResponse, MessageResponse, RegisterDTO } from '@research/shared';

export const loginApi = {
  signUp: async (credentials: RegisterDTO): Promise<AuthResponse> => {
    return await instance.post<AuthResponse>('/auth/register', credentials).then(res => res.data);
  },
  signIn: async (credentials: LoginDTO): Promise<AuthResponse> => {
    return await instance.post<AuthResponse>('/auth/login', credentials).then(res => res.data);
  },
  logOut: async (): Promise<MessageResponse> => {
    return await instance.post<MessageResponse>('/auth/logout').then(res => res.data);
  },
  me: async (): Promise<MeResponse> => {
    return await instance.get<MeResponse>('/auth/me').then(res => res.data);
  },
};
