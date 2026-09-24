import s from '@/widgets/dashboard/ui/Dashboard.module.css';
import { useTotalTests } from '../../model/hooks/useTotalTests';
import { Spinner } from '../../../../shared/ui/spinner/Spinner';
import { DashboardLineChart } from '../../../../shared/ui/dashboard-line-chart/DashboardLineChart';

export const TotalDataWidget = () => {
  const { data, isLoading } = useTotalTests();

  if (isLoading)
    return (
      <div className={s.totalData}>
        <Spinner overlay={false} />
      </div>
    );

  return (
    <DashboardLineChart
      className={s.totalData}
      title="Total tested data"
      description={'Testing results received in all areas'}
      data={data}
      dataKeyX={'monthName'}
      dataKeyFirstLine={'current'}
      dataKeySecondLine={'previous'}
      grid
      dashed
    />
  );
};
