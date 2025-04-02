import { useCallback } from 'react';

interface UseTablePaginationProps {
  page: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function useTablePagination({
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UseTablePaginationProps) {
  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      if (onPageChange) {
        onPageChange(newPage);
      }
    },
    [onPageChange]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onPageSizeChange) {
        onPageSizeChange(parseInt(event.target.value, 10));
      }
    },
    [onPageSizeChange]
  );

  return {
    handleChangePage,
    handleChangeRowsPerPage,
  };
}