import { useCallback } from 'react';
import { useTableContext } from '../contexts/TableContext';

export function useTableFilter<T>() {
  const { state, dispatch } = useTableContext<T>();

  const handleFilterChange = useCallback((property: keyof T, value: string | number | boolean | string[]) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        ...state.filters,
        [property]: value,
      },
    });
  }, [state.filters, dispatch]);

  const handleRemoveFilter = useCallback((column: keyof T) => {
    const newFilters = { ...state.filters };
    delete newFilters[column];
    dispatch({
      type: 'SET_FILTERS',
      payload: newFilters,
    });
  }, [state.filters, dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {},
    });
  }, [dispatch]);

  return {
    filters: state.filters,
    activeFilters: state.activeFilters,
    handleFilterChange,
    handleRemoveFilter,
    handleClearFilters,
  };
} 