import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ChartData } from 'recharts/types/state/chartDataSlice';
import type { AxisDomain } from 'recharts/types/util/types';
import s from './DashboardLineChart.module.css';
import { memo } from 'react';

type Props = {
  title: string;
  description?: string;
  data: ChartData;
  dataKeyX: string;
  dataKeyFirstLine: string;
  dataKeySecondLine: string;
  className: string;
  intervalXLine?: number;
  unitY?: string;
  domain?: AxisDomain;
  grid?: boolean;
  dashed?: boolean;
};

const CHART_MARGIN = { left: 20, right: 20, top: 10, bottom: 10 } as const;

export const DashboardLineChart = memo(
  ({
    title,
    dataKeySecondLine,
    dataKeyX,
    dataKeyFirstLine,
    data,
    description,
    className,
    intervalXLine = 0,
    unitY,
    domain,
    dashed = false,
    grid = false,
  }: Props) => {
    return (
      <div className={`${s.chartContainer} ${className}`}>
        <div className={s.descriptionContainer}>
          <h3>{title}</h3>
          {description && <span>{description}</span>}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={CHART_MARGIN}>
            {grid && <CartesianGrid vertical={true} horizontal={false} strokeDasharray="3 3" />}
            <XAxis dataKey={dataKeyX} tickLine={false} interval={intervalXLine} />
            <YAxis axisLine={false} hide={true} unit={unitY} domain={domain} />
            <Line
              isAnimationActive={false}
              dataKey={dataKeySecondLine}
              stroke={`${dashed ? '#5cbcf0' : '#d8dce8'}`}
              strokeWidth={2}
              strokeDasharray={`${dashed ? '3 3' : undefined}`}
              dot={false}
            />
            <Line dataKey={dataKeyFirstLine} isAnimationActive={false} stroke="#3874ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
