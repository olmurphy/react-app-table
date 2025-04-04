import { useCallback } from 'react';
import { Order, SortState } from '../Table.types';
import { useTableContext } from '../contexts/TableContext';

export function useTableSort<T>() {
  const { state, dispatch } = useTableContext<T>();

  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = state.sortState.orderBy === property && state.sortState.order === 'asc';
    dispatch({
      type: 'SET_SORT_STATE',
      payload: {
        orderBy: property,
        order: isAsc ? 'desc' : 'asc',
      },
    });
  }, [state.sortState, dispatch]);

  return {
    sortState: state.sortState,
    handleRequestSort,
  };
} 