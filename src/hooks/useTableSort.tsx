// export function useTableSort<T>() {
//   const [sortState, setSortState] = useState<SortState<T>>({
//     orderBy: columns[0].id,
//     order: 'asc'
//   });

//   const handleSort = useCallback((property: keyof T) => {
//     // Sort logic
//   }, []);

//   return { sortState, handleSort };
// }