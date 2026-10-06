import s from './Medications.module.css';
import Arrow from '@/shared/assets/images/Arrow.svg';
import { useState } from 'react';
import { useTableData } from '../lib/useTableData';
import { FiltersBlock } from '../../../features/filter-medications/FiltersBlock';
import { Spinner } from '../../../shared/ui/spinner/Spinner';
import { Button } from '../../../shared/ui/button/Button';
import { MedicationRow } from './medication-row/MedicationRow';
import { Pagination } from '../../../shared/ui/pagination/Pagination';
import {
  type MedicationsFilters,
  PAGE_SIZE_OPTIONS,
  type SortBy,
  type SortDirection,
} from '@research/shared';

const isSameFilters = (a: MedicationsFilters, b: MedicationsFilters) =>
  (Object.keys({ ...a, ...b }) as (keyof MedicationsFilters)[]).every(key => a[key] === b[key]);

export const Medications = () => {
  const [filters, setFilters] = useState<MedicationsFilters>({});

  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(undefined);

  const {
    totalItems,
    page,
    hasNextPage,
    rows,
    columns,
    onShowAll,
    onPageSizeChange,
    showAll,
    startItem,
    endItem,
    onNextPage,
    onPreviousPage,
    isLoading,
    isFetching,
    resetPage,
    pageSize,
  } = useTableData(filters, sortBy, sortDirection);

  const onSort = (value: SortBy) => {
    setSortBy(value);
    setSortDirection(p => (p === 'asc' ? 'desc' : 'asc'));
    resetPage();
  };

  const onFiltersChange = (update: Partial<MedicationsFilters> | null) => {
    const next = update === null ? {} : { ...filters, ...update };
    if (isSameFilters(filters, next)) return;

    setFilters(next);
    resetPage();
  };

  const isDataLoading = isLoading || isFetching;

  return (
    <div className={s.tableContainer}>
      <div className={s.header}>
        <h1 className={s.title}>List of medications in development</h1>
        <p className={s.subtitle}>Brief summary of testing processes</p>
      </div>
      <FiltersBlock onChange={onFiltersChange} />
      <div className={s.tableWrapper}>
        {isDataLoading && <Spinner />}
        <table className={s.table}>
          <thead className={s.columnWrapper}>
            <tr>
              {columns.map(col => (
                <th scope="col" key={col.key}>
                  <div className={s.columnTitle}>
                    <span>{col.title.toUpperCase()}</span>
                    {col.isSortable && (
                      <div>
                        <Button
                          aria-label={`${col.key}-sortDirection`}
                          variant="text"
                          onClick={() => onSort(col.key)}
                          disabled={totalItems === 0 && !isDataLoading}
                          className={`${s.sortBtn} ${sortDirection === 'desc' && sortBy === col.key ? s.desc : ''}`}
                        >
                          <Arrow />
                        </Button>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {totalItems === 0 && !isDataLoading ? (
              <tr>
                <td colSpan={columns.length || 7} className={s.stateCell}>
                  There is nothing to show
                </td>
              </tr>
            ) : (
              rows?.map(item => {
                return <MedicationRow item={item} key={item._id} />;
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onNextPage={onNextPage}
        onPrevPage={onPreviousPage}
        hasNextPage={hasNextPage}
        totalItems={totalItems}
        endItem={endItem}
        onPageSizeChange={onPageSizeChange}
        onShowAll={onShowAll}
        page={page}
        pageSize={pageSize}
        showAll={showAll}
        startItem={startItem}
      />
    </div>
  );
};
