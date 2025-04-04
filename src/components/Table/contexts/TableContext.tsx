import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Column, SearchFilter } from '../Table.types';
export interface TableState<T> {
  data: T[];
  columns: Column<T>[];
  isServerSide: boolean;
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  sortState: {
    orderBy: keyof T | null;
    order: 'asc' | 'desc';
  };
  filters: Partial<Record<keyof T, string | number | boolean | string[]>>;
  activeFilters: SearchFilter<T>[];
  searchState: {
    searchTerm: string;
    searchField: keyof T | null;
  };
  selected: T[];
}

export type TableAction<T> =
  | { type: 'SET_DATA'; payload: T[] }
  | { type: 'SET_COLUMNS'; payload: Column<T>[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_TOTAL_COUNT'; payload: number }
  | { type: 'SET_SORT'; payload: { orderBy: keyof T; order: 'asc' | 'desc' } }
  | { type: 'SET_FILTERS'; payload: { field: keyof T; value: string | number | boolean | string[] } }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: "SET_ACTIVE_FILTER"; payload: { column: keyof T, value: string }}
  | { type: "CLEAR_ACTIVE_FILTER"; payload: { column: keyof T }}
  | { type: "CLEAR_ALL_ACTIVE_FILTERS"; }
  | { type: 'SET_SEARCH'; payload: { term: string; field: keyof T | null } }
  | { type: 'SELECT_ROW'; payload: T }
  | { type: 'DESELECT_ROW'; payload: T }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' } ;

type TableContextValue<T> = {
  state: TableState<T>;
  dispatch: React.Dispatch<TableAction<T>>;
}

const TableContext = createContext<TableContextValue<any> | undefined>(undefined);

const initialState = {
  data: [],
  columns: [],
  isServerSide: false,
  loading: false,
  page: 0,
  pageSize: 10,
  totalCount: 0,
  sortState: {
    orderBy: null,
    order: 'asc' as const,
  },
  filters: {},
  activeFilters: [],
  searchState: {
    searchTerm: '',
    searchField: null,
  },
  selected: [],
};

function tableReducer<T>(state: TableState<T>, action: TableAction<T>): TableState<T> {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload };
    case 'SET_TOTAL_COUNT':
      return { ...state, totalCount: action.payload };
    case 'SET_SORT':
      return { ...state, sortState: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.field]: action.payload.value },
      };
    
    case 'SET_ACTIVE_FILTER':
      return {
        ...state,
        activeFilters: [...state.activeFilters, { column: action.payload.column, value: action.payload.value}],
      }
    case 'CLEAR_ACTIVE_FILTER':
      return { ...state, activeFilters: state.activeFilters.filter((f) => f.column !== action.payload.column) };
    case 'CLEAR_ALL_ACTIVE_FILTERS':
      return { ...state, activeFilters: []};
    case 'SET_SEARCH':
      return {
        ...state,
        searchState: { searchTerm: action.payload.term, searchField: action.payload.field },
      };
    case 'SELECT_ROW':
      return {
        ...state,
        selected: [...state.selected, action.payload],
      };
    case 'DESELECT_ROW':
      return {
        ...state,
        selected: state.selected.filter((row) => row !== action.payload),
      };
    case 'SELECT_ALL':
      return {
        ...state,
        selected: [...state.data],
      };
    case 'DESELECT_ALL':
      return {
        ...state,
        selected: [],
      };
    default:
      return state;
  }
}

type TableProviderProps<T> = {
  children: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  isServerSide?: boolean;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
}

export function TableProvider<T>({
  children,
  data,
  columns,
  isServerSide = false,
  loading = false,
  page = 0,
  pageSize = 10,
  totalCount = 0,
}: TableProviderProps<T>) {
  const [state, dispatch] = useReducer<React.Reducer<TableState<T>, TableAction<T>>>(tableReducer, {
    ...initialState,
    data,
    columns,
    isServerSide,
    loading,
    page,
    pageSize,
    totalCount,
  });
  const processedData = useMemo(() => {
    if (state.isServerSide) {
      return state.data;
    }

    let filteredData = state.data;

    // // Apply filters
    // Object.entries(state.filters).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null && value !== '') {
    //     filteredData = filteredData.filter((row: T) => {
    //       const rowValue = row[key as keyof T];

    //       if (Array.isArray(value)) {
    //         return value.includes(rowValue as string);
    //       }

    //       if (typeof rowValue === 'string' && typeof value === 'string') {
    //         return rowValue.toLowerCase().includes(value.toLowerCase());
    //       }

    //       return rowValue === value;
    //     });
    //   }
    // });

    // Apply search
    if (state.searchState.searchTerm && state.searchState.searchField) {
      const searchTerm = state.searchState.searchTerm.toLowerCase();
      filteredData = filteredData.filter((row: T) => {
        const value = row[state.searchState.searchField as keyof T];
        return String(value).toLowerCase().includes(searchTerm);
      });
    }

    // Apply sorting
    if (state.sortState.orderBy) {
      filteredData = [...filteredData].sort((a: T, b: T) => {
        const aValue = a[state.sortState.orderBy as keyof T];
        const bValue = b[state.sortState.orderBy as keyof T];

        if (bValue < aValue) {
          return state.sortState.order === 'desc' ? -1 : 1;
        }
        if (bValue > aValue) {
          return state.sortState.order === 'desc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [state.data, state.filters, state.searchState, state.sortState, state.isServerSide]);

  const value: TableContextValue<T> = useMemo(
    () => ({
      state: { ...state, processedData },
      dispatch,
    }),
    [state, processedData]
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTableContext<T>() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextValue<T>;
}
