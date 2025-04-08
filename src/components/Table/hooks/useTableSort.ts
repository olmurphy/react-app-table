import { useCallback, useMemo } from "react";
import { Order } from "../Table.types";
import { useTableContext } from "../contexts/TableContext";
import { debounce } from "../utils/sortUtils";

/**
 * Custom hook for table sorting functionality
 * Provides sorting state and handlers for sorting operations
 */
export function useTableSort<T>() {
  const { state, dispatch } = useTableContext<T>();

  const handleRequestSort = useCallback(
    (property: keyof T) => {
      const isAsc = state.sortState.orderBy === property && state.sortState.order === "asc";
      dispatch({
        type: "SET_SORT",
        payload: {
          orderBy: property,
          order: isAsc ? "desc" : "asc",
        },
      });
    },
    [state.sortState, dispatch]
  );

  /**
   * Sorts data based on current sort state
   */
  // const getSortedData = useCallback(
  //   (data: T[]) => {
  //     return sortData(data, state.sortState.orderBy, state.sortState.order);
  //   },
  //   [state.sortState]
  // );

  /**
   * Returns the current sort state
   */
  const sortState = useMemo(() => state.sortState, [state.sortState]);

  const createDebouncedSortHandler = useCallback((callback: (property: keyof T, order: Order) => void, wait = 300) => {
    return debounce((property: keyof T, order: Order) => {
      callback(property, order);
    }, wait);
  }, []);


    // // Debounced sort handler for better performance
    // const debouncedSortChange = useMemo(
    //   () =>
    //     createDebouncedSortHandler((property: keyof T, order: Order) => {
    //       if (onSortChange) {
    //         onSortChange(property, order);
    //       }
    //     }),
    //   [onSortChange, createDebouncedSortHandler]
    // );
  
  
    // // Clean up debounce on unmount
    // useEffect(() => {
    //   return () => {
    //     debouncedSortChange.cancel();
    //   };
    // }, [debouncedSortChange]);

  return {
    sortState,
    handleRequestSort,
    createDebouncedSortHandler,
  };
}
