import type { Dispatch, SetStateAction } from 'react';
import type { Location } from '../../../entities/location/lib/type.ts';
import s from './LocationsDropdown.module.css';

type Props = {
  options: Location[];
  onChange: Dispatch<SetStateAction<string | null>>;
  currentOption: string;
  label: string;
};
export const Dropdown = ({ options, label, onChange, currentOption }: Props) => {
  return (
    <div className="s.locationsDropdown">
      <select id="location" className={s.select} value={currentOption} onChange={e => onChange(e.target.value)}>
        {label && <option value="">{label}</option>}
        {options.map(location => (
          <option key={location.id} value={location._id}>
            {location.clinicName}
          </option>
        ))}
      </select>
    </div>
  );
};
