import { instance } from '../../../shared/api/instance';
import type { GetMedicationsResponse, MedicationDTO, MedicationsDTO } from '@research/shared';

export const fetchMedications = async (params: MedicationsDTO): Promise<GetMedicationsResponse> => {
  return await instance
    .get<GetMedicationsResponse>('/medications', {
      params,
    })
    .then(res => res.data);
};

export const fetchMedicationById = async (id: string): Promise<MedicationDTO> => {
  return await instance.get<MedicationDTO>(`/medications/${id}`).then(res => res.data);
};
