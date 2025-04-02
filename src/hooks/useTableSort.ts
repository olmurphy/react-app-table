import { useState, useCallback } from 'react';
import { Order, SortState } from '../types';

export function useTableSort<T>({ 
  initialSort, 
  onSortChange 
}: { 
  initialSort?: SortState<T>;
  onSortChange?: (property: keyof T, order: Order) => void;
}) {
  const [sortState, setSortState] = useState<SortState<T>>(() => ({
    orderBy: initialSort?.orderBy || '',
    order: initialSort?.order || 'asc',
  }));

  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = sortState.orderBy === property && sortState.order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    
    setSortState({
      orderBy: property,
      order: newOrder,
    });

    if (onSortChange) {
      onSortChange(property, newOrder);
    }
  }, [sortState, onSortChange]);

  return {
    sortState,
    handleRequestSort,
  };
}