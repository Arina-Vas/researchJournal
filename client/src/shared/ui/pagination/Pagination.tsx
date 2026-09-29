import s from './Pagination.module.css';
import Arrow from '@/shared/assets/images/Arrow.svg';
import { Button } from '../button/Button';

type Props = {
  page: number;
  showAll: boolean;
  startItem: number;
  endItem: number;
  totalItems: number;
  hasNextPage: boolean;
  onPageSizeChange: (pageSize: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onShowAll: (show: boolean) => void;
  pageSize: number;
};
export const Pagination = ({
  page,
  totalItems,
  onShowAll,
  hasNextPage,
  endItem,
  startItem,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  showAll,
  pageSize,
}: Props) => {
  return (
    <div className={s.paginationContainer}>
      <div className={s.pages}>
        <Button
          aria-label={'prev button'}
          variant={'text'}
          className={s.prevBtn}
          onClick={onPrevPage}
          disabled={page === 1 || showAll}
        >
          <Arrow />
        </Button>
        <span>
          {startItem} to {endItem} of {totalItems} items{' '}
        </span>
        <Button
          aria-label={'next button'}
          variant={'text'}
          className={s.nextBtn}
          onClick={onNextPage}
          disabled={!hasNextPage || showAll}
        >
          <Arrow />
        </Button>
        <label className={s.showAllWrapper}>
          <input
            checked={showAll}
            type={'checkbox'}
            onChange={e => {
              onShowAll(e.target.checked);
            }}
          />
          Show all
        </label>
      </div>

      <div className={s.pageSize}>
        <span>Page size</span>
        <Button
          aria-label={'page size 6'}
          size={'sm'}
          isActive={pageSize === 6}
          variant={'outline'}
          onClick={() => onPageSizeChange(6)}
        >
          6
        </Button>
        <Button
          aria-label={'page size 12'}
          size={'sm'}
          isActive={pageSize === 12}
          variant={'outline'}
          onClick={() => onPageSizeChange(12)}
        >
          12
        </Button>
      </div>
    </div>
  );
};
