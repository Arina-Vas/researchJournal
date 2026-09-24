import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import s from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  isActive = false,
  children,
  className = '',
  disabled,
  type = 'button',
  ...restProps
}: ButtonProps) => {
  const isButtonDisabled = disabled || isLoading;

  const buttonClasses = [
    s.button,
    s[variant],
    s[size],
    fullWidth ? s.fullWidth : '',
    isLoading ? s.loading : '',
    isActive ? s.active : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} disabled={isButtonDisabled} className={buttonClasses} {...restProps}>
      {isLoading && <span className={s.spinner} aria-hidden="true" />}

      {!isLoading && iconLeft && <span className={s.icon}>{iconLeft}</span>}
      <span className={s.content}>{children}</span>
      {!isLoading && iconRight && <span className={s.icon}>{iconRight}</span>}
    </button>
  );
};
