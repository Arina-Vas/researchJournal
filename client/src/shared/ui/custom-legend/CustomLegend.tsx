import s from './CustomLegend.module.css';
import { memo, type ReactNode } from 'react';
import type { Props } from 'recharts/types/component/DefaultLegendContent';

interface Payload {
  name: string;
  value: number;
  fill: string;
}

export const CustomLegend = memo(({ payload }: Props): ReactNode => {
  if (!payload || !payload.length) return null;

  const total = payload.reduce((acc: number, entry) => acc + ((entry?.payload as Payload).value || 0), 0);

  return (
    <ul className={s.legendList}>
      {payload.map(entry => {
        const value = (entry?.payload as Payload).value || 0;
        const percent = total > 0 ? Math.round((value / total) * 100) : 0;
        const name = entry?.value;

        return (
          <li key={`legend-item-${entry.value}`} className={s.legendItem}>
            <div className={s.legendLabel}>
              <span className={s.legendMarker} style={{ backgroundColor: (entry.payload as Payload).fill }} />
              <span className={s.legendText}>{name}</span>
            </div>
            <span className={s.legendValue}>{percent}%</span>
          </li>
        );
      })}
    </ul>
  );
});
