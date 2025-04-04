import { useCallback } from 'react';
import { useTableContext } from '../contexts/TableContext';

export function useTableSelection<T>() {
  const { state, dispatch } = useTableContext<T>();

  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>, data: T[]) => {
    if (event.target.checked) {
      dispatch({
        type: 'SET_SELECTED',
        payload: data,
      });
    } else {
      dispatch({
        type: 'SET_SELECTED',
        payload: [],
      });
    }
  }, [dispatch]);

  const handleSelectOneClick = useCallback((event: React.MouseEvent<unknown>, row: T) => {
    const selectedIndex = state.selected.indexOf(row);
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(state.selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(state.selected.slice(1));
    } else if (selectedIndex === state.selected.length - 1) {
      newSelected = newSelected.concat(state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        state.selected.slice(0, selectedIndex),
        state.selected.slice(selectedIndex + 1)
      );
    }

    dispatch({
      type: 'SET_SELECTED',
      payload: newSelected,
    });
  }, [state.selected, dispatch]);

  return {
    selected: state.selected,
    handleSelectAllClick,
    handleSelectOneClick,
  };
} 