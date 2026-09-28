import { instance } from '../../../shared/api/instance';
import { Location } from '../lib/type';

export const fetchLocations = async (): Promise<Location[]> => {
  return await instance.get('/locations').then(res => res.data);
};

export const fetchLocationById = async (id: string): Promise<Location> => {
  return await instance.get(`/locations/${id}`).then(res => res.data);
};
