import s from './MedicationRow.module.css';
import Success from '@/shared/assets/images/Success.svg';
import Error from '@/shared/assets/images/Error.svg';
import { useNavigate } from '@tanstack/react-router';
import { formatDate } from '../../../../shared/utils/formatDate';
import type { MedicationWithLocation } from '@research/shared';

const processPercent = (current: number, total: number) => Math.round((current / total) * 100);

export const MedicationRow = ({ item }: { item: MedicationWithLocation }) => {
  const navigate = useNavigate();
  return (
    <tr className={s.row} onClick={() => navigate({ to: `/medications/${item._id}` })}>
      <td className={`${s.item} ${s.nameCell}`}>{item.name}</td>
      <td className={s.item}>{item.location.clinicName}</td>
      <td className={s.item}>{formatDate(item.startDate)}</td>
      <td className={s.item}>{formatDate(item.endDate)}</td>
      <td className={s.item}>{item.successReaction ? <Success /> : <Error />}</td>
      <td className={s.item}>
        <div className={s.processWrapper}>
          <span className={s.processText}>
            {item.process.current} / {item.process.total}
          </span>
          <div className={s.progressBarTrack}>
            <div
              className={s.progressBarFill}
              style={{ width: `${processPercent(item.process.current, item.process.total)}%` }}
            />
          </div>
        </div>
      </td>
      <td className={s.item}>{item.status}</td>
    </tr>
  );
};
