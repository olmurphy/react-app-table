import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useTableContext } from '../contexts/TableContext';
import { useTableFilter } from '../hooks/useTableFilter';

export function FilterChips<T>() {
  const { state } = useTableContext<T>();
  const { filters, removeFilter, clearFilters } = useTableFilter<T>();

  if (Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
      {Object.entries(filters).map(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return null;
        }

        const column = state.columns.find((col) => col.id === key);
        if (!column) {
          return null;
        }

        return (
          <Chip
            key={key}
            label={`${column.label}: ${Array.isArray(value) ? value.join(', ') : value}`}
            onDelete={() => removeFilter(key as keyof T)}
          />
        );
      })}
      <Chip label="Clear filters" onClick={clearFilters} />
    </Box>
  );
} 