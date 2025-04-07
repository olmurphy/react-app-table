// import { useCallback } from 'react';
// import { useTableContext } from '../contexts/TableContext';

// export function useTableFilter<T>() {
//   const { state, dispatch } = useTableContext<T>();

//   const handleAddFilter = useCallback((property: keyof T, value: string | number | boolean | string[]) => {
//     dispatch({
//       type: 'SET_FILTERS',
//       payload: {
//         field: property,
//         value: value,
//       },
//     });
//   }, [state.filters, dispatch]);

//   const handleRemoveFilter = useCallback((column: keyof T) => {
//     const newFilters = { ...state.filters };
//     delete newFilters[column];
//     dispatch({
//       type: 'CLEAR_FILTER',
//       payload: column,
//     });
//   }, [state.filters, dispatch]);

//   const handleClearFilters = useCallback(() => {
//     dispatch({
//       type: 'CLEAR_ALL_FILTERS',
//     });
//   }, [dispatch]);

//   return {
//     filters: state.filters,
//     handleAddFilter,
//     handleRemoveFilter,
//     handleClearFilters,
//   };
// } 