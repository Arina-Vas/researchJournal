import type { DashboardData, StatusDataItem } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { selectStatusByDate } from '../../lib/dashbord-data-selectors';

export const useStatusData = (): DashboardData<StatusDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: 100 });

  const statusData = useMemo(() => selectStatusByDate(data?.data || []), [data?.data]);

  return {
    data: statusData,
    isLoading,
  };
};
