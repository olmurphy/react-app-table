import { useState, useCallback, useRef } from 'react';
import { Column } from '@src/components/Table/Table.types';

interface UseTableSearchProps<T> {
  columns: Column<T>[];
  onFilterChange?: (property: keyof T, value: string) => void;
}

export function useTableSearch<T>({ columns, onFilterChange }: UseTableSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      if (onFilterChange) {
        onFilterChange('search' as keyof T, value);
      }
    },
    [onFilterChange]
  );

  const handleSearchFocus = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    setSearchAnchorEl(event.currentTarget);
  }, []);

  const handleFilterSelect = useCallback((column: keyof T) => {
    const columnLabel = columns.find((c) => c.id === column)?.label || String(column);
    setSearchTerm(`${columnLabel} = `);

    if (searchInputRef.current) {
      searchInputRef.current.focus();
      const length = `${columnLabel} = `.length;
      requestAnimationFrame(() => {
        searchInputRef.current?.setSelectionRange(length, length);
      });
    }
  }, [columns]);

  const handleSearchClose = useCallback(() => {
    setSearchAnchorEl(null);
  }, []);

  return {
    searchTerm,
    searchAnchorEl,
    searchInputRef,
    handleSearchChange,
    handleSearchFocus,
    handleFilterSelect,
    handleSearchClose,
  };
}