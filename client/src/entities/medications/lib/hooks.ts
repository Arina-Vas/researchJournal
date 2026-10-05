import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMedicationById, fetchMedications } from '../api/medicationApi';
import type { GetMedicationsResponse, MedicationResponse, MedicationsDTO } from '@research/shared';

export const useMedications = (filters: MedicationsDTO) => {
  return useQuery<GetMedicationsResponse>({
    queryKey: ['medications', filters],
    queryFn: () => fetchMedications(filters),
    placeholderData: keepPreviousData,
  });
};

export const useMedicationById = (id: string) => {
  return useQuery<MedicationResponse>({
    queryKey: ['medications', id],
    queryFn: () => fetchMedicationById(id),
  });
};
