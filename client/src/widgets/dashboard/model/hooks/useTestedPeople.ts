import type { DashboardData, TestedPeopleDataItem } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { selectTestedPeopleLastYear } from '../../lib/dashbord-data-selectors';
import { MAX_PAGE_SIZE } from '@research/shared';

export const useTestedPeople = (): DashboardData<TestedPeopleDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: MAX_PAGE_SIZE });

  const testedPeopleData = useMemo(() => selectTestedPeopleLastYear(data?.data || []), [data?.data]);

  return { data: testedPeopleData, isLoading };
};
