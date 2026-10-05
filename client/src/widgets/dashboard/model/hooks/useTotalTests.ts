import type { DashboardData, TotalTestsDataItem } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { selectTotalTestsByMonth } from '../../lib/dashbord-data-selectors';
import { MAX_PAGE_SIZE } from '@research/shared';

export const useTotalTests = (): DashboardData<TotalTestsDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: MAX_PAGE_SIZE });

  const totalTestsData = useMemo(() => {
    return selectTotalTestsByMonth(data?.data || []);
  }, [data?.data]);

  return { data: totalTestsData, isLoading };
};
