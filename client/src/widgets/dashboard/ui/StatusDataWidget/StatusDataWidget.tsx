import s from '@/widgets/dashboard/ui/Dashboard.module.css';
import { useStatusData } from '../../model/hooks/useStatusData';
import { Spinner } from '../../../../shared/ui/spinner/Spinner';
import { DashboardBarChart } from '../../../../shared/ui/dashboard-bar-chart/DashboardBarChart';

export const StatusDataWidget = () => {
  const { data, isLoading } = useStatusData();

  if (isLoading)
    return (
      <div className={s.chart}>
        <Spinner />
      </div>
    );

  return <DashboardBarChart data={data} dataKeyX={'date'} />;
};
