import { useCallback, useMemo } from 'react';
import { Order, SortState } from '../Table.types';
import { useTableContext } from '../contexts/TableContext';
import { sortData, debounce } from '../utils/sortUtils';

/**
 * Utility function to compare values for sorting
 */
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * Creates a comparator function based on sort order
 */
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Custom hook for table sorting functionality
 * Provides sorting state and handlers for sorting operations
 */
export function useTableSort<T>() {
  const { state, dispatch } = useTableContext<T>();

  /**
   * Handles sort request when a column header is clicked
   */
  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = state.sortState.orderBy === property && state.sortState.order === 'asc';
    dispatch({
      type: 'SET_SORT',
      payload: {
        orderBy: property,
        order: isAsc ? 'desc' : 'asc',
      },
    });
  }, [state.sortState, dispatch]);

  /**
   * Sorts data based on current sort state
   */
  const getSortedData = useCallback((data: T[]) => {
    return sortData(data, state.sortState.orderBy, state.sortState.order);
  }, [state.sortState]);

  /**
   * Returns the current sort state
   */
  const sortState = useMemo(() => state.sortState, [state.sortState]);

  /**
   * Creates a debounced sort handler for performance optimization
   */
  const createDebouncedSortHandler = useCallback((callback: (property: keyof T, order: Order) => void, wait = 300) => {
    return debounce((property: keyof T, order: Order) => {
      callback(property, order);
    }, wait);
  }, []);

  return {
    sortState,
    handleRequestSort,
    getSortedData,
    createDebouncedSortHandler,
  };
} 