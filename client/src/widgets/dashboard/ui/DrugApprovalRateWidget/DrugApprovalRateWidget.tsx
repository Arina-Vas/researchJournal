import s from '@/widgets/dashboard/ui/Dashboard.module.css';
import { useApprovalRateData } from '../../model/hooks/useApprovalRateData';
import { Spinner } from '../../../../shared/ui/spinner/Spinner';
import { DashboardLineChart } from '../../../../shared/ui/dashboard-line-chart/DashboardLineChart';

const DOMAIN = [0, 100];

export const DrugApprovalRateWidget = () => {
  const { data, isLoading } = useApprovalRateData();

  if (isLoading)
    return (
      <div className={s.chart}>
        <Spinner overlay={false} />
      </div>
    );

  return (
    <DashboardLineChart
      className={s.chart}
      title="Drug approval rates"
      data={data}
      dataKeyX={'date'}
      dataKeyFirstLine={'current'}
      dataKeySecondLine={'previous'}
      intervalXLine={10}
      unitY="%"
      domain={DOMAIN}
    />
  );
};
