import { useState, useCallback } from 'react';
import { FilterValue, SearchFilter } from '../types';

interface UseTableFilterProps<T> {
  onFilterChange?: (filters: Partial<Record<keyof T, FilterValue>>) => void;
}

export function useTableFilter<T>({ onFilterChange }: UseTableFilterProps<T>) {
  const [filters, setFilters] = useState<Partial<Record<keyof T, FilterValue>>>({});
  const [activeFilters, setActiveFilters] = useState<SearchFilter<T>[]>([]);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<keyof T | null>(null);

  const handleFilterChange = useCallback(
    (property: keyof T, value: FilterValue) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [property]: value,
      }));
      
      if (onFilterChange) {
        onFilterChange({ ...filters, [property]: value });
      }
    },
    [filters, onFilterChange]
  );

  const handleRemoveFilter = useCallback((filter: SearchFilter<T>) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
    handleFilterChange(filter.column, '');
  }, [handleFilterChange]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters([]);
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);

  const handleAddFilter = useCallback((column: keyof T, value: string) => {
    setActiveFilters((prev) => [...prev, { column, value }]);
    handleFilterChange(column, value);
  }, [handleFilterChange]);

  return {
    filters,
    activeFilters,
    currentFilterColumn,
    setCurrentFilterColumn,
    handleFilterChange,
    handleRemoveFilter,
    handleClearFilters,
    handleAddFilter,
  };
}