import { instance } from '../../../shared/api/instance';
import type { AllMedications, Medication, MedicationParams } from '../lib/type';

export const fetchMedications = async (params: MedicationParams): Promise<AllMedications> => {
  return await instance
    .get<AllMedications>('/medications', {
      params,
    })
    .then(res => res.data);
};

export const fetchMedicationById = async (id: string): Promise<Medication> => {
  return await instance.get<Medication>(`/medications/${id}`).then(res => res.data);
};
