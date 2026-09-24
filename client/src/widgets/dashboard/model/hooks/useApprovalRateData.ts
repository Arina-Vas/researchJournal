import { selectApprovalRateByMonth } from '../../lib/dashbord-data-selectors';
import { ApprovalRateDataItem, DashboardData } from '../types';
import { useMedications } from '../../../../entities/medications/lib/hooks';
import { useMemo } from 'react';

export const useApprovalRateData = (): DashboardData<ApprovalRateDataItem> => {
  const { data, isLoading } = useMedications();

  const approvalRateData = useMemo(() => selectApprovalRateByMonth(data?.data || []), [data?.data]);

  return { data: approvalRateData, isLoading };
};
