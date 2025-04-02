

// export interface TableContextProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   selected: readonly T[];
//   filters: Partial<Record<keyof T, FilterValue>>;
//   sortState: SortState<T>;
//   // ... other shared state
// }


// export const TableContext = createContext<TableContextProps<any> | null>(null);

// export function TableProvider<T>({ children, ...props }: TableProviderProps<T>) {
//   // Shared state and handlers
//   return (
//     <TableContext.Provider value={...}>
//       { children }
//     </TableContext.Provider >
//   );
// }