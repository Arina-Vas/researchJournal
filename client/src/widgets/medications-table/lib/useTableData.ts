import { useMemo } from 'react';
import { MedicationFilters } from '../../../entities/medications/lib/type';
import { usePagination } from './usePagination';
import { useMedications } from '../../../entities/medications/lib/hooks';
import { MEDICATIONS_COLUMNS } from './config';

export const useTableData = (filters: MedicationFilters, sortBy: string, sortDirection: 'asc' | 'desc') => {
  const { name, successReaction, locationId, startDate, endDate } = filters;

  const {
    page,
    pageSize,
    showAll,
    activeCursor,
    resetPagination,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    onShowAll,
  } = usePagination();

  const queryFilters: MedicationFilters = useMemo(
    () => ({
      name,
      successReaction,
      locationId,
      sortBy,
      sortDirection,
      pageSize,
      startDate,
      endDate,
      cursorDoc: activeCursor,
    }),
    [name, successReaction, locationId, pageSize, activeCursor, sortBy, startDate, endDate, sortDirection],
  );

  const { data, isLoading, isFetching, isError, error } = useMedications();
  // const { data: totalItems } = useGetMedicationsCount(queryFilters);

  console.log(data);

  const rowData = data?.data || [];
  const totalItems = data?.data?.length;

  const startItem = rowData.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = (page - 1) * pageSize + rowData.length;
  const hasNextPage = !(endItem === totalItems);

  const onNextPageHandler = () => onNextPage(rowData.length, data?.data.lastVisibleDoc);
  const onShowAllHandler = (show: boolean) => onShowAll(show, totalItems || 0);

  return {
    columns: MEDICATIONS_COLUMNS,
    totalItems: totalItems || 0,
    rows: rowData,
    page,
    pageSize,
    showAll,
    startItem,
    endItem,
    hasNextPage,
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
