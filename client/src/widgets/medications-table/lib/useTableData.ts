import { useMemo } from 'react';
import { MedicationFilters, MedicationItem } from '../../../entities/medications/lib/type';
import { usePagination } from './usePagination';
import { useMedications } from '../../../entities/medications/lib/hooks';
import { MEDICATIONS_COLUMNS } from './config';

type UseTableDataResult = {
  columns: typeof MEDICATIONS_COLUMNS;
  totalItems: number;
  rows: MedicationItem[];
  page: number;
  pageSize: number;
  showAll: boolean;
  startItem: number;
  endItem: number;
  hasNextPage: boolean;
  onPageSizeChange: (pageSize: number) => void;
  onShowAll: (show: boolean) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading: boolean;
  isFetching: boolean;
  resetPagination: () => void;
  isError: boolean;
  error: Error | null;
};

export const useTableData = (
  filters: MedicationFilters,
  sortBy: MedicationFilters['sortBy'],
  sortDirection: 'asc' | 'desc',
): UseTableDataResult => {
  const { name, successReaction, location, startDate, endDate } = filters;

  const { page, pageSize, showAll, resetPagination, onNextPage, onPreviousPage, onPageSizeChange, onShowAll } =
    usePagination();

  const queryFilters: MedicationFilters = useMemo(
    () => ({
      name,
      successReaction,
      location,
      sortBy,
      sortDirection,
      page,
      pageSize,
      startDate,
      endDate,
    }),
    [name, successReaction, location, sortBy, sortDirection, page, pageSize, startDate, endDate],
  );

  console.log(queryFilters);

  const { data, isLoading, isFetching, isError, error } = useMedications(queryFilters);

  const { data: medication, pagination } = data || {};
  const { totalItems, totalPages, totalFilteredItems, hasNextPage } = pagination || {};

  const rowData = medication || [];

  const startItem = rowData.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = (page - 1) * pageSize + rowData.length;

  const onNextPageHandler = () => onNextPage(rowData.length, hasNextPage || false);
  const onShowAllHandler = (show: boolean) => onShowAll(show, totalItems || 0);

  return {
    columns: MEDICATIONS_COLUMNS,
    totalItems: totalFilteredItems || 0,
    rows: rowData,
    page,
    pageSize,
    showAll,
    startItem,
    endItem,
    hasNextPage: hasNextPage || false,
    onPageSizeChange,
    onShowAll: onShowAllHandler,
    onNextPage: onNextPageHandler,
    onPreviousPage,
    isLoading,
    isFetching,
    resetPagination,
    isError,
    error,
  };
};
