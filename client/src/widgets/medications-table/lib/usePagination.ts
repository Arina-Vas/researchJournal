import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

export const usePagination = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [showAll, setShowAll] = useState(false);

  const resetPagination = () => {
    setShowAll(false);
    setPage(DEFAULT_PAGE);
    setPageSize(DEFAULT_PAGE_SIZE);
  };

  const onNextPage = (rowsLength: number, hasNextPage: boolean) => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const onPreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const onPageSizeChange = (pageSize: number) => {
    setPage(DEFAULT_PAGE);
    setPageSize(pageSize);
    setShowAll(false);
  };

  const onShowAll = (show: boolean, totalItems: number) => {
    setPage(1);
    setShowAll(show);
    if (show) setPageSize(totalItems || 0);
    else setPageSize(DEFAULT_PAGE_SIZE);
  };

  return {
    page,
    pageSize,
    showAll,
    resetPagination,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    onShowAll,
  };
};
