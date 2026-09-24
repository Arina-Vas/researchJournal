import { useQuery } from '@tanstack/react-query';
import { fetchLocationById, fetchLocations } from '../api/locationApi';

export const useFetchLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
    // placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
};

export const useFetchLocationById = (locationId: string) => {
  return useQuery({
    queryKey: ['locations', locationId],
    queryFn: () => fetchLocationById(locationId),
    enabled: Boolean(locationId && typeof locationId === 'string' && locationId.trim() !== ''),
    // placeholderData: keepPreviousData,
  });
};
