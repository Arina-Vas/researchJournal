import { useState } from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../../entities/medications/lib/constants';

export const usePagination = () => {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const showAll = pageSize === MAX_PAGE_SIZE;

  const resetPage = () => {
    setPage(DEFAULT_PAGE);
  };

  const onNextPage = (totalPages: number) => {
    setPage(prev => Math.min(prev + 1, Math.max(totalPages, DEFAULT_PAGE)));
  };

  const onPreviousPage = () => setPage(prev => Math.max(prev - 1, DEFAULT_PAGE));

  const onPageSizeChange = (pageSize: number) => {
    setPage(DEFAULT_PAGE);
    setPageSize(Math.min(pageSize, MAX_PAGE_SIZE));
  };

  const onShowAll = (show: boolean) => onPageSizeChange(show ? MAX_PAGE_SIZE : DEFAULT_PAGE_SIZE);

  return {
    page,
    pageSize,
    showAll,
    resetPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    onShowAll,
  };
};
