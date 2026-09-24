import { instance } from '../../../shared/api/instance';
import { Medication } from '../lib/type';

export const fetchMedications = async (): Promise<{ data: Medication[] }> => {
  return await instance.get('/medications');
};

export const fetchMedicationById = async (id: string): Promise<{ data: Medication }> => {
  return await instance.get(`/medications/${id}`);
};
