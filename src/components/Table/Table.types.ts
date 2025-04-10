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
  value: any;
}

export interface TableProps<T> {
  tableName: string;
  data: T[];
  columns: Column<T>[];
  onSortChange?: (sortBy: keyof T, sortDirection: Order) => void;
  onFilterChange?: (filters: Partial<Record<keyof T, FilterValue>>) => void; // Improved filter types
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onEdit?: (row: T, field: keyof T, newValue: any) => void; // Use 'field' to match the second interface
  onDelete?: (row: T) => void;
  onExport?: (data?: T[]) => void; // make data optional to match both interfaces.
  onExpand?: (row: T) => void;
  expandedRows?: T[]; // Add expandedRows from second interface
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void; // use page instead of event for simplicity
  onPageSizeChange?: (pageSize: number) => void; // Add onPageSizeChange from second interface
  loading?: boolean;
  rowGrouping?: keyof T | ((row: T) => string); // allow both keyof T and function approach
  aggregation?: Record<keyof T, (values: T[keyof T][]) => any>; // Add aggregation from second interface
  isServerSide?: boolean;
  initialSort?: SortState<T>;
  height?: string | number;
  width?: string | number;
}