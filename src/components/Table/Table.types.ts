import { ReactNode } from 'react';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: T[keyof T]) => ReactNode;
  filterable?: boolean;
  sortable?: boolean;
}

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
  | { type: 'SET_FILTER'; payload: { field: keyof T; value: string | number | boolean | string[] } }
  | { type: 'CLEAR_FILTER'; payload: keyof T }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: 'SET_SEARCH'; payload: { term: string; field: keyof T | null } }
  | { type: 'SELECT_ROW'; payload: T }
  | { type: 'DESELECT_ROW'; payload: T }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' };

export type Order = "asc" | "desc";
export type FilterValue = string | number | boolean | string[];

export interface SortState<T> {
  orderBy: keyof T;
  order: Order;
}

export interface SearchFilter<T> {
  column: keyof T;
  value: string;
}

export interface TableProps<T> {
  tableName: string;
  data: T[];
  columns: Column<T>[];
  onSortChange?: (sortBy: keyof T, sortDirection: Order) => void;
  onFilterChange?: (filters: Partial<Record<keyof T, FilterValue>>) => void;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onEdit?: (row: T, field: keyof T, newValue: any) => void;
  onDelete?: (row: T) => void;
  onExport?: (data?: T[]) => void;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  isServerSide?: boolean;
  initialSort?: SortState<T>;
  height?: string | number;
  width?: string | number;
}