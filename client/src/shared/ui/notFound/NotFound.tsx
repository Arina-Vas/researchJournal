import NotFoundImage from '../../assets/images/NotFound.png';
import s from './NotFound.module.css';

export const NotFound = () => {
  return (
    <div className={s.wrapper}>
      <img
        src={NotFoundImage}
        alt={'404 — page not found'}
        width={2700}
        height={2100}
        className={s.img}
      />
    </div>
  );
};
