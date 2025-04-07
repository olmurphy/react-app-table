import { useCallback } from 'react';
import { useTableContext } from '../contexts/TableContext';

/**
 * Custom hook for handling table row selection
 * Follows Google/Meta best practices for scalable React applications
 * 
 * @returns Object containing selection state and handlers
 */
export function useTableSelection<T>() {
  const { state, dispatch } = useTableContext<T>();
  const { selected, data } = state;

  /**
   * Handles selecting all rows in the table
   * @param event - The checkbox change event
   */
  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch({ type: 'SELECT_ALL' });
      } else {
        dispatch({ type: 'DESELECT_ALL' });
      }
    },
    [dispatch]
  );

  /**
   * Handles selecting or deselecting a single row
   * @param event - The checkbox change event
   * @param row - The row data to select/deselect
   */
  const handleSelectOneClick = useCallback(
    (event: React.MouseEvent<unknown>, row: T) => {
      const isSelected = selected.includes(row);
      
      if (isSelected) {
        dispatch({ type: 'DESELECT_ROW', payload: row });
      } else {
        dispatch({ type: 'SELECT_ROW', payload: row });
      }
    },
    [selected, dispatch]
  );

  /**
   * Checks if a row is currently selected
   * @param row - The row to check
   * @returns boolean indicating if the row is selected
   */
  const isRowSelected = useCallback(
    (row: T) => selected.includes(row),
    [selected]
  );

  /**
   * Gets the number of selected rows
   * @returns number of selected rows
   */
  const getSelectedCount = useCallback(
    () => selected.length,
    [selected]
  );

  /**
   * Gets the total number of rows
   * @returns total number of rows
   */
  const getTotalCount = useCallback(
    () => data.length,
    [data]
  );

  return {
    selected,
    handleSelectAllClick,
    handleSelectOneClick,
    isRowSelected,
    getSelectedCount,
    getTotalCount,
  };
} 