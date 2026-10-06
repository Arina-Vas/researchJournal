import { instance } from '../../../shared/api/instance';
import {
  type GetMedicationsResponse,
  GetMedicationsResponseSchema,
  type MedicationDTO,
  MedicationSchema,
  type MedicationsDTO,
} from '@research/shared';
import { parseResponse } from '../../../shared/api/parseResponse';

export const fetchMedications = async (params: MedicationsDTO): Promise<GetMedicationsResponse> => {
  return await instance
    .get('/medications', {
      params,
    })
    .then(res => parseResponse(GetMedicationsResponseSchema, res.data));
};

export const fetchMedicationById = async (id: string): Promise<MedicationDTO> => {
  return await instance
    .get(`/medications/${id}`)
    .then(res => parseResponse(MedicationSchema, res.data));
};
