import { DashboardData, TotalTestsDataItem } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { selectTotalTestsByMonth } from '../../lib/dashbord-data-selectors';

export const useTotalTests = (): DashboardData<TotalTestsDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: 100 });

  const totalTestsData = useMemo(() => {
    return selectTotalTestsByMonth(data?.data || []);
  }, [data?.data]);

  return { data: totalTestsData, isLoading };
};
