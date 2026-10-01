import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMedicationById, fetchMedications } from '../api/medicationApi';
import { AllMedications, Medication, MedicationParams } from './type';

export const useMedications = (filters: MedicationParams) => {
  return useQuery<AllMedications>({
    queryKey: ['medications', filters],
    queryFn: () => fetchMedications(filters),
    placeholderData: keepPreviousData,
  });
};

export const useMedicationById = (id: string) => {
  return useQuery<Medication>({
    queryKey: ['medications', id],
    queryFn: () => fetchMedicationById(id),
  });
};
