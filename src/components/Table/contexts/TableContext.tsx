import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Column, Order, SortState } from '../Table.types';

interface TableState<T> {
  selected: T[];
  sortState: SortState<T>;
  filters: Partial<Record<keyof T, string | number | boolean | string[]>>;
  columnWidths: Record<keyof T, string | number>;
  searchTerm: string;
  activeFilters: Array<{ column: keyof T; value: string }>;
  currentFilterColumn: keyof T | null;
}

type TableAction<T> =
  | { type: 'SET_SELECTED'; payload: T[] }
  | { type: 'SET_SORT_STATE'; payload: SortState<T> }
  | { type: 'SET_FILTERS'; payload: Partial<Record<keyof T, string | number | boolean | string[]>> }
  | { type: 'SET_COLUMN_WIDTHS'; payload: Record<keyof T, string | number> }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_ACTIVE_FILTERS'; payload: Array<{ column: keyof T; value: string }> }
  | { type: 'SET_CURRENT_FILTER_COLUMN'; payload: keyof T | null };

interface TableContextValue<T> {
  state: TableState<T>;
  dispatch: React.Dispatch<TableAction<T>>;
}

const TableContext = createContext<TableContextValue<any> | undefined>(undefined);

function tableReducer<T>(state: TableState<T>, action: TableAction<T>): TableState<T> {
  switch (action.type) {
    case 'SET_SELECTED':
      return { ...state, selected: action.payload };
    case 'SET_SORT_STATE':
      return { ...state, sortState: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_COLUMN_WIDTHS':
      return { ...state, columnWidths: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_ACTIVE_FILTERS':
      return { ...state, activeFilters: action.payload };
    case 'SET_CURRENT_FILTER_COLUMN':
      return { ...state, currentFilterColumn: action.payload };
    default:
      return state;
  }
}

interface TableProviderProps<T> {
  children: ReactNode;
  initialSort?: SortState<T>;
}

export function TableProvider<T>({ children, initialSort }: TableProviderProps<T>) {
  const initialState: TableState<T> = {
    selected: [],
    sortState: {
      orderBy: initialSort?.orderBy || '' as keyof T,
      order: initialSort?.order || 'asc',
    },
    filters: {},
    columnWidths: {},
    searchTerm: '',
    activeFilters: [],
    currentFilterColumn: null,
  };

  const [state, dispatch] = useReducer(tableReducer, initialState);

  return (
    <TableContext.Provider value={{ state, dispatch }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext<T>() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextValue<T>;
}