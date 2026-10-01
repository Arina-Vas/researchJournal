import s from './MedicationTags.module.css';
import { useMedications } from '../../../entities/medications/lib/hooks';
import { NavButton } from '../../../shared/ui/nav-button/NavButton';

type Props = {
  location: string;
};
export const MedicationTags = ({ location }: Props) => {
  const { data: medications } = useMedications({ location, pageSize: 6 });

  return (
    <ul className={s.tagList}>
      {medications?.data.map(medication => (
        <li key={medication._id}>
          <NavButton title={medication.name} className={s.tag} link={`/medications/${medication._id}`} />
        </li>
      ))}
    </ul>
  );
};
