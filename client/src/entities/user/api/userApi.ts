import { instance } from '../../../shared/api/instance';
import type { UserDTO } from '@research/shared';

export const fetchUsers = async (): Promise<UserDTO[]> => {
  return await instance.get<UserDTO[]>('/users').then(res => res.data);
};

export const fetchUserById = async (userId: string): Promise<UserDTO> => {
  return await instance.get<UserDTO>(`/users/${userId}`).then(res => res.data);
};
