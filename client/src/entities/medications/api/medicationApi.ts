import { instance } from '../../../shared/api/instance';
import type { GetMedicationsResponse, MedicationResponse, MedicationsDTO } from '@research/shared';

export const fetchMedications = async (params: MedicationsDTO): Promise<GetMedicationsResponse> => {
  return await instance
    .get<GetMedicationsResponse>('/medications', {
      params,
    })
    .then(res => res.data);
};

export const fetchMedicationById = async (id: string): Promise<MedicationResponse> => {
  return await instance.get<MedicationResponse>(`/medications/${id}`).then(res => res.data);
};
