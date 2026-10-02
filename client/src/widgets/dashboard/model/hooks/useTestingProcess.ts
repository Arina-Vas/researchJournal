import type { DashboardData, TestingProcessDataItem } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { selectTestingProcessByPhase } from '../../lib/dashbord-data-selectors';

export const useTestingProcess = (): DashboardData<TestingProcessDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: 100 });

  const testingProcessData = useMemo(() => {
    return selectTestingProcessByPhase(data?.data || []);
  }, [data?.data]);

  return { data: testingProcessData, isLoading };
};
