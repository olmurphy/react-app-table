import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { useTableContext } from '../contexts/TableContext';
import { useTableSelection } from '../hooks/useTableSelection';

interface TableBodyProps<T> {
  onRowClick?: (row: T) => void;
  onEdit?: (row: T, field: keyof T, newValue: any) => void;
  onDelete?: (row: T) => void;
  rowGrouping?: keyof T | ((row: T) => string);
  aggregation?: Record<keyof T, (values: T[keyof T][]) => any>;
}

export function TableBodyComponent<T>({
  onRowClick,
  onEdit,
  onDelete,
  rowGrouping,
  aggregation,
}: TableBodyProps<T>) {
  const { state, processedData } = useTableContext<T>();
  const { selected, handleSelectOneClick } = useTableSelection<T>();

  if (state.loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={state.columns.length + 1} align="center">
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
            {state.columns.map((column) => (
              <TableCell key={String(column.id)}>{row[column.id]}</TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
} 