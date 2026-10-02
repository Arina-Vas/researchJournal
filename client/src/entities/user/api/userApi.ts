import { instance } from '../../../shared/api/instance';
import type { User } from '../lib/type';

export const fetchUsers = async (): Promise<User[]> => {
  return await instance.get<User[]>('/users').then(res => res.data);
};

export const fetchUserById = async (userId: string): Promise<User> => {
  return await instance.get<User>(`/users/${userId}`).then(res => res.data);
};
