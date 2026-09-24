import s from './Dashboard.module.css';
import { TotalDataWidget } from './TotalDataWidget/TotalDataWidget';
import { StatusDataWidget } from './StatusDataWidget/StatusDataWidget';
import { TestedPeopleWidget } from './TestedPeopleWidget/TestedPeopleWidget';
import { TestingProcessWidget } from './TestingProcessWidget/TestingProcessWidget';
import { DrugApprovalRateWidget } from './DrugApprovalRateWidget/DrugApprovalRateWidget';

export const Dashboard = () => {
  return (
    <div className={s.dashboardWrapper}>
      <h2 className={s.title}>Testing dashboard</h2>
      <div className={s.chartsWrapper}>
        <TotalDataWidget />

        <div className={s.charts}>
          <StatusDataWidget />
          <TestedPeopleWidget />
          <TestingProcessWidget />
          <DrugApprovalRateWidget />
        </div>
      </div>
    </div>
  );
};
