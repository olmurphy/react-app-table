import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { Column } from '../Table.types';
import { useTableSelection } from '../hooks/useTableSelection';
import { useTableSort } from '../hooks/useTableSort';
import { useTableFilter } from '../hooks/useTableFilter';

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T, field: keyof T, newValue: any) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
  rowGrouping?: keyof T | ((row: T) => string);
  aggregation?: Record<keyof T, (values: T[keyof T][]) => any>;
  isServerSide?: boolean;
}

export function TableBodyComponent<T>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  loading,
  rowGrouping,
  aggregation,
  isServerSide = false,
}: TableBodyProps<T>) {
  const { selected, handleSelectOneClick } = useTableSelection<T>();
  const { sortState } = useTableSort<T>();
  const { filters } = useTableFilter<T>();

  // Process data based on filters and sorting
  const processedData = React.useMemo(() => {
    if (isServerSide) {
      return data;
    }

    let filteredData = data;

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredData = filteredData.filter((row) => {
          const rowValue = row[key as keyof T];

          if (Array.isArray(value)) {
            return value.includes(rowValue as string);
          }

          if (typeof rowValue === 'string' && typeof value === 'string') {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }

          return rowValue === value;
        });
      }
    });

    // Apply sorting
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortState.orderBy];
      const bValue = b[sortState.orderBy];

      if (bValue < aValue) {
        return sortState.order === 'desc' ? -1 : 1;
      }
      if (bValue > aValue) {
        return sortState.order === 'desc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, filters, sortState, isServerSide]);

  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + 1} align="center">
            Loading...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {processedData.map((row, index) => {
        const isItemSelected = selected.includes(row);
        const labelId = `enhanced-table-checkbox-${index}`;

        return (
          <TableRow
            hover
            onClick={(event) => handleSelectOneClick(event, row)}
            key={row.id}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            sx={{ cursor: 'pointer', height: '40px' }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={isItemSelected}
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={String(column.id)}>{row[column.id]}</TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
} 