import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMedicationById, fetchMedications } from '../api/medicationApi';

export const useMedications = () => {
  return useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
    placeholderData: keepPreviousData,
  });
};

export const useMedicationById = (id: string) => {
  return useQuery({
    queryKey: ['medications', id],
    queryFn: () => fetchMedicationById(id),
    // placeholderData: keepPreviousData,
  });
};
