import s from './Spinner.module.css';

export const Spinner = ({ overlay = true }: { overlay?: boolean }) => {
  return (
    <div className={`${overlay && s.overlay}`}>
      <div className={s.spinner} />
    </div>
  );
};
