import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { useTableSelection } from '../hooks/useTableSelection';

interface SelectionCheckboxProps<T> {
  row?: T;
  isHeader?: boolean;
}

/**
 * A reusable checkbox component for table row selection
 * Can be used for both header (select all) and individual row selection
 * 
 * @param row - The row data (optional, only needed for row selection)
 * @param isHeader - Whether this is the header checkbox for selecting all rows
 */
export function SelectionCheckbox<T>({ row, isHeader = false }: SelectionCheckboxProps<T>) {
  const { 
    handleSelectAllClick, 
    handleSelectOneClick, 
    isRowSelected, 
    getSelectedCount, 
    getTotalCount 
  } = useTableSelection<T>();

  // For header checkbox (select all)
  if (isHeader) {
    const numSelected = getSelectedCount();
    const totalCount = getTotalCount();
    const indeterminate = numSelected > 0 && numSelected < totalCount;
    const checked = totalCount > 0 && numSelected === totalCount;

    return (
      <Checkbox
        color="primary"
        indeterminate={indeterminate}
        checked={checked}
        onChange={handleSelectAllClick}
        inputProps={{
          'aria-label': 'select all rows',
        }}
      />
    );
  }

  // For individual row selection
  if (!row) {
    return null;
  }

  const isSelected = isRowSelected(row);

  return (
    <Checkbox
      color="primary"
      checked={isSelected}
      onClick={(event) => handleSelectOneClick(event, row)}
      inputProps={{
        'aria-label': `select row`,
      }}
    />
  );
} 