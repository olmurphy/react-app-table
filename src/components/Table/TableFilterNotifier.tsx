import React, { useEffect } from 'react';
import { useTableContext } from './contexts/TableContext';
import { TableProps } from './Table.types';

interface TableFilterNotifierProps<T> {
  onFilterChange?: (filters: Partial<Record<keyof T, any>>) => void;
}

export function TableFilterNotifier<T>({ onFilterChange }: TableFilterNotifierProps<T>) {
  const { state } = useTableContext<T>();

  useEffect(() => {
    if (onFilterChange && state.activeFilters.length > 0) {
      // Convert active filters to the format expected by onFilterChange
      const filters: Partial<Record<keyof T, any>> = {};
      state.activeFilters.forEach(filter => {
        filters[filter.column] = filter.value;
      });
      onFilterChange(filters);
    }
  }, [state.activeFilters, onFilterChange]);

  // This component doesn't render anything
  return null;
} 