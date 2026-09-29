import { instance } from '../../../shared/api/instance';
import { AllMedications, Medication, MedicationParams } from '../lib/type';

export const fetchMedications = async (params: MedicationParams): Promise<AllMedications> => {
  return await instance
    .get('/medications', {
      params,
    })
    .then(res => res.data);
};

export const fetchMedicationById = async (id: string): Promise<Medication> => {
  return await instance.get(`/medications/${id}`).then(res => res.data);
};
