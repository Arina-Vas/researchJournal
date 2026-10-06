import { instance } from '../../../shared/api/instance';
import {
  type AuthResponse,
  AuthResponseSchema,
  type LoginDTO,
  type MeResponse,
  MeResponseSchema,
  type MessageResponse,
  MessageResponseSchema,
  type RegisterDTO,
} from '@research/shared';
import { parseResponse } from '../../../shared/api/parseResponse';

export const loginApi = {
  signUp: async (credentials: RegisterDTO): Promise<AuthResponse> => {
    return await instance
      .post('/auth/register', credentials)
      .then(res => parseResponse(AuthResponseSchema, res.data));
  },
  signIn: async (credentials: LoginDTO): Promise<AuthResponse> => {
    return await instance
      .post('/auth/login', credentials)
      .then(res => parseResponse(AuthResponseSchema, res.data));
  },
  logOut: async (): Promise<MessageResponse> => {
    return await instance
      .post('/auth/logout')
      .then(res => parseResponse(MessageResponseSchema, res.data));
  },
  me: async (): Promise<MeResponse> => {
    return await instance.get('/auth/me').then(res => parseResponse(MeResponseSchema, res.data));
  },
};
