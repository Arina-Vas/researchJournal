import s from './MedicationTags.module.css';
import { useMedications } from '../../../entities/medications/lib/hooks';
import { NavButton } from '../../../shared/ui/nav-button/NavButton';

const MEDICATIONS_LIMIT = 6;

type Props = {
  location: string;
  currentId?: string;
};
export const MedicationTags = ({ location, currentId }: Props) => {
  const { data: medications } = useMedications({
    location,
    pageSize: MEDICATIONS_LIMIT,
    excludeId: currentId,
  });

  return (
    <ul className={s.tagList}>
      {medications?.data.map(medication => (
        <li key={medication._id}>
          <NavButton
            title={medication.name}
            className={s.tag}
            link={`/medications/${medication._id}`}
          />
        </li>
      ))}
    </ul>
  );
};
