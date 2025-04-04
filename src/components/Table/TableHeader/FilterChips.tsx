import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Column } from '../Table.types';
import { useTableFilter } from '../hooks/useTableFilter';

interface FilterChipsProps<T> {
  columns: Column<T>[];
}

export function FilterChips<T>({ columns }: FilterChipsProps<T>) {
  const { activeFilters, handleRemoveFilter, handleClearFilters } = useTableFilter<T>();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {activeFilters.map((filter, index) => (
        <Chip
          key={index}
          label={`${columns.find((c) => c.id === filter.column)?.label || String(filter.column)} = ${filter.value}`}
          onDelete={() => handleRemoveFilter(filter.column)}
          color="primary"
          variant="outlined"
        />
      ))}
      <Chip
        label="Clear filters"
        onClick={handleClearFilters}
        color="default"
        variant="outlined"
      />
    </Box>
  );
} 