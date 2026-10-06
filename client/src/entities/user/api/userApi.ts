import { instance } from '../../../shared/api/instance';
import { type UserDTO, UserDTOSchema } from '@research/shared';
import { z } from 'zod';
import { parseResponse } from '../../../shared/api/parseResponse';

export const fetchUsers = async (): Promise<UserDTO[]> => {
  return await instance.get('/users').then(res => parseResponse(z.array(UserDTOSchema), res.data));
};

export const fetchUserById = async (userId: string): Promise<UserDTO> => {
  return await instance.get(`/users/${userId}`).then(res => parseResponse(UserDTOSchema, res.data));
};
