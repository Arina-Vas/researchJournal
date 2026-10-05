import type { DashboardData, StatusDataItem } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { selectStatusByDate } from '../../lib/dashbord-data-selectors';
import { MAX_PAGE_SIZE } from '@research/shared';

export const useStatusData = (): DashboardData<StatusDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: MAX_PAGE_SIZE });

  const statusData = useMemo(() => selectStatusByDate(data?.data || []), [data?.data]);

  return {
    data: statusData,
    isLoading,
  };
};
