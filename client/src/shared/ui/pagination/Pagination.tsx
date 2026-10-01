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
  pageSizeOptions: readonly number[];
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
  pageSizeOptions,
}: Props) => {
  return (
    <div className={s.paginationContainer}>
      <div className={s.pages}>
        <Button
          aria-label={'prev button'}
          variant={'text'}
          className={s.prevBtn}
          onClick={onPrevPage}
          disabled={page === 1}
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
          disabled={!hasNextPage}
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
        {pageSizeOptions.map(size => (
          <Button
            key={size}
            aria-label={`page size ${size}`}
            size={'sm'}
            isActive={pageSize === size}
            variant={'outline'}
            onClick={() => onPageSizeChange(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};
