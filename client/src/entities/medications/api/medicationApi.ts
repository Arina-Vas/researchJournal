import { instance } from '../../../shared/api/instance';
import { AllMedications, Medication, MedicationFilters } from '../lib/type';

export const fetchMedications = async (filters: MedicationFilters): Promise<AllMedications> => {
  console.log('filters');
  return await instance
    .get('/medications', {
      params: filters,
    })
    .then(res => res.data);
};

export const fetchMedicationById = async (id: string): Promise<Medication> => {
  return await instance.get(`/medications/${id}`).then(res => res.data);
};
