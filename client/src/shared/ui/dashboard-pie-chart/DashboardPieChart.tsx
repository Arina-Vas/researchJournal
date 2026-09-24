import { Legend, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import type { ChartData } from 'recharts/types/state/chartDataSlice';
import s from './DashboardPieChart.module.css';
import { memo } from 'react';
import { CustomLegend } from '../custom-legend/CustomLegend';

type Props = {
  className: string;
  data: ChartData;
  title: string;
  dataKey?: string;
  cx?: string;
  cy?: string;
  innerRadius?: string;
  outerRadius?: string;
  paddingAngle?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  stroke?: string;
};

const CHART_MARGIN = { left: 20, right: 20, top: 10, bottom: 15 };

export const DashboardPieChart = memo(
  ({
    data,
    className,
    title,
    dataKey = 'value',
    cx = '50%',
    cy = '50%',
    innerRadius = '80%',
    outerRadius = '100%',
    paddingAngle = 5,
    startAngle,
    endAngle,
    stroke = 'white',
    fill,
  }: Props) => {
    return (
      <div className={className}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={CHART_MARGIN} className={s.pie}>
            <Pie
              data={data}
              dataKey={dataKey}
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              fill={fill}
              stroke={stroke}
              shape={<Sector />}
              startAngle={startAngle}
              endAngle={endAngle}
              isAnimationActive={false}
            />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
