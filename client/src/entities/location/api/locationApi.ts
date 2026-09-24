import { instance } from '../../../shared/api/instance';

export const fetchLocations = async (): Promise<Location[]> => {
  return await instance.get('/locations');
};

export const fetchLocationById = async (id: string): Promise<Location> => {
  return await instance.get(`/locations/${id}`);
};
