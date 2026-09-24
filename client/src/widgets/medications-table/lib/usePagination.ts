import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

export const usePagination = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [pageCursors, setPageCursors] = useState<null[]>([null]);

  const activeCursor = pageCursors[page - 1] ?? null;

  const [showAll, setShowAll] = useState(false);

  const resetPagination = () => {
    setPage(DEFAULT_PAGE);
    setPageCursors([null]);
  };

  const onNextPage = (rowsLength: number, lastVisibleDoc: null | undefined) => {
    if (rowsLength === pageSize && lastVisibleDoc) {
      setPageCursors(prev => {
        const nextCursors = [...prev];
        nextCursors[page] = lastVisibleDoc;
        return nextCursors;
      });
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
    setPageCursors([null]);
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
    activeCursor,
    resetPagination,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    onShowAll,
  };
};
