import { usePagination } from './usePagination';
import { useMedications } from '../../../entities/medications/lib/hooks';
import { MEDICATIONS_COLUMNS } from './config';
import type {
  MedicationsDTO,
  MedicationsFilters,
  MedicationWithLocation,
  SortBy,
  SortDirection,
} from '@research/shared';

type UseTableDataResult = {
  columns: typeof MEDICATIONS_COLUMNS;
  totalItems: number;
  rows: MedicationWithLocation[];
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
  isError: boolean;
  error: Error | null;
  resetPage: () => void;
};

export const useTableData = (
  filters: MedicationsFilters,
  sortBy?: SortBy,
  sortDirection?: SortDirection,
): UseTableDataResult => {
  const {
    page,
    pageSize,
    showAll,
    resetPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    onShowAll,
  } = usePagination();

  const queryFilters: MedicationsDTO = { ...filters, sortBy, sortDirection, page, pageSize };

  const { data, isLoading, isFetching, isError, error } = useMedications(queryFilters);

  const { data: medication, pagination } = data || {};
  const { totalPages = 1, totalFilteredItems = 0, hasNextPage = false } = pagination || {};

  const rowData = medication || [];

  const startItem = rowData.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = (page - 1) * pageSize + rowData.length;

  const onNextPageHandler = () => onNextPage(totalPages);

  return {
    columns: MEDICATIONS_COLUMNS,
    totalItems: totalFilteredItems,
    rows: rowData,
    page,
    pageSize,
    showAll,
    startItem,
    endItem,
    hasNextPage,
    onPageSizeChange,
    resetPage,
    onShowAll,
    onNextPage: onNextPageHandler,
    onPreviousPage,
    isLoading,
    isFetching,
    isError,
    error,
  };
};
