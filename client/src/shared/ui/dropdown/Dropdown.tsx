import type { ChangeEvent } from 'react';
import s from './LocationsDropdown.module.css';
import type { LocationDTO } from '@research/shared';

type Props = {
  options: LocationDTO[];
  onChange: (value: string | undefined) => void;
  currentOption: string;
  label: string;
};
export const Dropdown = ({ options, label, onChange, currentOption }: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) =>
    onChange(e.target.value || undefined);

  return (
    <select
      aria-label={label}
      className={s.select}
      value={currentOption}
      onChange={onChangeHandler}
    >
      <option value="">{label}</option>
      {options.map(location => (
        <option key={location.id} value={location._id}>
          {location.clinicName}
        </option>
      ))}
    </select>
  );
};
