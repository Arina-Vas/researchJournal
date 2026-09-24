import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ChartData } from 'recharts/types/state/chartDataSlice';
import s from '@/widgets/dashboard/ui/Dashboard.module.css';
import { memo } from 'react';

type Props = {
  data: ChartData;
  dataKeyX: string;
  className?: string;
};

const BAR_BACKGROUND = { fill: '#c7d2fe', radius: 4 } as const;
const CHART_MARGIN = { top: 25, right: 0, left: 0, bottom: 5 } as const;
const RADIUS: [number, number, number, number] = [4, 4, 4, 4];

export const DashboardBarChart = memo(({ data, dataKeyX }: Props) => {
  return (
    <div className={s.chart}>
      <h3>Total tested drugs</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="2%" margin={CHART_MARGIN}>
          <XAxis dataKey={dataKeyX} hide={true} interval={0} />
          <YAxis hide={true} />
          <Bar
            isAnimationActive={false}
            dataKey="completed"
            fill="#2563eb"
            barSize={12}
            radius={RADIUS}
            background={BAR_BACKGROUND}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
