import { instance } from '../../../shared/api/instance';
import { type LocationDTO, LocationSchema } from '@research/shared';
import { parseResponse } from '../../../shared/api/parseResponse';
import { z } from 'zod';

export const fetchLocations = async (): Promise<LocationDTO[]> => {
  return await instance
    .get('/locations')
    .then(res => parseResponse(z.array(LocationSchema), res.data));
};

export const fetchLocationById = async (id: string): Promise<LocationDTO> => {
  return await instance
    .get(`/locations/${id}`)
    .then(res => parseResponse(LocationSchema, res.data));
};
