import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import s from './LocationsDropdown.module.css';
import type { LocationDTO } from '@research/shared';

type Props = {
  options: LocationDTO[];
  onChange: Dispatch<SetStateAction<string | undefined>>;
  currentOption: string;
  label: string;
};
export const Dropdown = ({ options, label, onChange, currentOption }: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value || undefined);

  return (
    <select id="location" className={s.select} value={currentOption} onChange={onChangeHandler}>
      {label && <option value="">{label}</option>}
      {options.map(location => (
        <option key={location.id} value={location._id}>
          {location.clinicName}
        </option>
      ))}
    </select>
  );
};
