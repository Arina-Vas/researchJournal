import s from '@/widgets/dashboard/ui/Dashboard.module.css';
import { useTestingProcess } from '../../model/hooks/useTestingProcess';
import { Spinner } from '../../../../shared/ui/spinner/Spinner';
import { DashboardPieChart } from '../../../../shared/ui/dashboard-pie-chart/DashboardPieChart';

export const TestingProcessWidget = () => {
  const { data, isLoading } = useTestingProcess();

  if (isLoading)
    return (
      <div className={s.chart}>
        <Spinner />
      </div>
    );

  return <DashboardPieChart title="Testing process" className={s.chart} data={data} />;
};
