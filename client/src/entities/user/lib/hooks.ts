import { useQuery } from '@tanstack/react-query';
import { fetchUserById, fetchUsers } from '../api/userApi';

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    staleTime: 1000 * 60 * 5,
  });
};
