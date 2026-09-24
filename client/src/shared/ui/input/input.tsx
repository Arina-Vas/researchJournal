import s from './Input.module.css';
import type { InputHTMLAttributes } from 'react';

type InputProps = {
  value?: string;
  placeholder?: string;
  className?: string;
  isError?: boolean;
  onChange: (value: string) => void;
  label?: string;
  type?: 'search' | 'input' | 'password' | 'date';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export const Input = ({ value, onChange, placeholder, isError, label, type, id, ...rest }: InputProps) => {
  return (
    <div className={s.inputWrapper}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        className={`${s.input} ${isError ? s.error : ''}`}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
};
