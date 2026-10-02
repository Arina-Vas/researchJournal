import { instance } from '../../../shared/api/instance';
import type { AuthDTO, AuthResponse, MeResponse } from '../../../entities/user/lib/type';

export const loginApi = {
  signUp: async (credentials: AuthDTO): Promise<AuthResponse> => {
    return await instance.post<AuthResponse>('/auth/register', credentials).then(res => res.data);
  },
  signIn: async (credentials: AuthDTO): Promise<AuthResponse> => {
    return await instance.post<AuthResponse>('/auth/login', credentials).then(res => res.data);
  },
  logOut: async (): Promise<{ message: string }> => {
    return await instance.post<{ message: string }>('/auth/logout').then(res => res.data);
  },
  me: async (): Promise<MeResponse> => {
    return await instance.get<MeResponse>('/auth/me').then(res => res.data);
  },
};
