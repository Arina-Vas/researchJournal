import s from '@/widgets/dashboard/ui/Dashboard.module.css';
import { useTestedPeople } from '../../model/hooks/useTestedPeople';
import { Spinner } from '../../../../shared/ui/spinner/Spinner';
import { DashboardPieChart } from '../../../../shared/ui/dashboard-pie-chart/DashboardPieChart';

export const TestedPeopleWidget = () => {
  const { data, isLoading } = useTestedPeople();

  if (isLoading)
    return (
      <div className={s.chart}>
        <Spinner />
      </div>
    );

  return (
    <DashboardPieChart
      title="Number of people tested"
      className={s.chart}
      data={data}
      startAngle={180}
      endAngle={0}
      cy="100%"
    />
  );
};
