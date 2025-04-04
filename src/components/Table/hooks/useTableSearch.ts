import { useCallback, useRef, useState } from 'react';
import { useTableContext } from '../contexts/TableContext';
import { Column } from '../Table.types';

export function useTableSearch<T>() {
  const { state, dispatch } = useTableContext<T>();
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SEARCH_TERM',
      payload: event.target.value,
    });
  }, [dispatch]);

  const handleSearchFocus = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    setSearchAnchorEl(event.currentTarget);
  }, []);

  const handleFilterSelect = useCallback((column: keyof T, columns: Column<T>[]) => {
    dispatch({
      type: 'SET_CURRENT_FILTER_COLUMN',
      payload: column,
    });
    const columnLabel = columns.find((c) => c.id === column)?.label || String(column);
    dispatch({
      type: 'SET_SEARCH_TERM',
      payload: `${columnLabel} = `,
    });

    if (searchInputRef.current) {
      searchInputRef.current.focus();
      const length = `${columnLabel} = `.length;
      requestAnimationFrame(() => {
        searchInputRef.current?.setSelectionRange(length, length);
      });
    }
  }, [dispatch]);

  const handleSearchKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = state.searchTerm.split(' = ')[1]?.trim();
      if (value && state.currentFilterColumn) {
        dispatch({
          type: 'SET_ACTIVE_FILTERS',
          payload: [...state.activeFilters, { column: state.currentFilterColumn, value }],
        });
        dispatch({
          type: 'SET_SEARCH_TERM',
          payload: '',
        });
        dispatch({
          type: 'SET_CURRENT_FILTER_COLUMN',
          payload: null,
        });
      }
    }
  }, [state.searchTerm, state.currentFilterColumn, state.activeFilters, dispatch]);

  return {
    searchTerm: state.searchTerm,
    searchAnchorEl,
    searchInputRef,
    handleSearchChange,
    handleSearchFocus,
    handleFilterSelect,
    handleSearchKeyDown,
    setSearchAnchorEl,
  };
} 