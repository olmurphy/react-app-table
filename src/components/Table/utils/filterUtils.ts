import { SearchFilter } from '../Table.types';

/**
 * Applies filters to data with AND logic
 * @param data The data to filter
 * @param filters The filters to apply
 * @returns Filtered data
 */
export function applyFilters<T>(data: T[], filters: SearchFilter<T>[]): T[] {
  if (!filters.length) {
    return data;
  }

  return data.filter((row: T) => {
    // Apply all filters with AND logic
    return filters.every((filter) => {
      const columnValue = row[filter.column];
      
      // Handle different data types
      if (typeof columnValue === 'string') {
        return columnValue.toLowerCase().includes(filter.value.toLowerCase());
      } else if (typeof columnValue === 'number') {
        // Try to parse the filter value as a number
        const numericValue = parseFloat(filter.value);
        return !isNaN(numericValue) && columnValue === numericValue;
      } else if (typeof columnValue === 'boolean') {
        // Handle boolean values
        return String(columnValue).toLowerCase() === filter.value.toLowerCase();
      } else if (Array.isArray(columnValue)) {
        // Handle array values
        return columnValue.some(item => 
          String(item).toLowerCase().includes(filter.value.toLowerCase())
        );
      } else if (columnValue instanceof Date) {
        // Handle date values
        const dateValue = new Date(filter.value);
        return !isNaN(dateValue.getTime()) && columnValue.getTime() === dateValue.getTime();
      }
      
      // Default case: convert to string and compare
      return String(columnValue).toLowerCase().includes(filter.value.toLowerCase());
    });
  });
}

/**
 * Applies search to data
 * @param data The data to search
 * @param searchTerm The search term
 * @param searchField The field to search in
 * @returns Filtered data
 */
export function applySearch<T>(data: T[], searchTerm: string, searchField: keyof T | null): T[] {
  if (!searchTerm || !searchField) {
    return data;
  }

  const term = searchTerm.toLowerCase();
  return data.filter((row: T) => {
    const value = row[searchField];
    return String(value).toLowerCase().includes(term);
  });
} 