import s from './NavButton.module.css';
import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

type Props = {
  title: string;
  link?: string;
  children?: ReactNode;
  className?: string;
};

export const NavButton = ({ title, className, link, children }: Props) => {
  return (
    <Link to={link || '/'} className={`${s.wrapper} ${className}`}>
      {children}
      <span>{title}</span>
    </Link>
  );
};
