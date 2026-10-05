import { selectApprovalRateByMonth } from '../../lib/dashbord-data-selectors';
import type { ApprovalRateDataItem, DashboardData } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';
import { MAX_PAGE_SIZE } from '@research/shared';

export const useApprovalRateData = (): DashboardData<ApprovalRateDataItem> => {
  const { data, isLoading } = useMedications({ pageSize: MAX_PAGE_SIZE });

  const approvalRateData = useMemo(() => selectApprovalRateByMonth(data?.data || []), [data?.data]);

  return { data: approvalRateData, isLoading };
};
