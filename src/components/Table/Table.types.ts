export interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  editable?: boolean;
  sticky?: boolean;
  type?: "number" | "string" | "date" | "select" | "boolean";
  disabledPadding?: boolean;
  options?: string[]; // for select
}

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