import { instance } from '../../../shared/api/instance';
import type { LocationDTO } from '@research/shared';

export const fetchLocations = async (): Promise<LocationDTO[]> => {
  return await instance.get<LocationDTO[]>('/locations').then(res => res.data);
};

export const fetchLocationById = async (id: string): Promise<LocationDTO> => {
  return await instance.get<LocationDTO>(`/locations/${id}`).then(res => res.data);
};
