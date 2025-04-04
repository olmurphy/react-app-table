import React from 'react';
import Box from '@mui/material/Box';
import { TableProvider } from './contexts/TableContext';
import { TableHeader } from './TableHeader/TableHeader';
import { TableBody } from './TableBody/TableBody';
import { TableFooter } from './TableFooter/TableFooter';
import { TableToolbar } from './TableHeader/HeaderToolbar';
import { SearchBar } from './TableHeader/SearchBar';
import { FilterChips } from './TableHeader/FilterChips';
import { StyledTableContainer } from './styles/tableStyles';
import { TableProps } from './Table.types';

export function Table<T extends Record<string, any>>({
  tableName,
  data,
  columns,
  onRowClick,
  onSelectionChange,
  onEdit,
  onDelete,
  onExport,
  onSortChange,
  onFilterChange,
  totalCount,
  pageSize = 10,
  page = 1,
  onPageChange,
  onPageSizeChange,
  loading,
  rowGrouping,
  aggregation,
  isServerSide = false,
  initialSort,
  height = '100%',
  width = '100%',
}: Readonly<TableProps<T>>) {
  return (
    <TableProvider initialSort={initialSort}>
      <Box>
        <TableToolbar
          tableName={tableName}
          onExport={onExport}
          data={data}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '8px', gap: '8px' }}>
          <SearchBar columns={columns} />
          <FilterChips columns={columns} />
        </Box>
        <Box>
          <StyledTableContainer>
            <TableHeader
              columns={columns}
              onSortChange={onSortChange}
            />
            <TableBody
              data={data}
              columns={columns}
              onRowClick={onRowClick}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
              rowGrouping={rowGrouping}
              aggregation={aggregation}
              isServerSide={isServerSide}
            />
            <TableFooter
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </StyledTableContainer>
        </Box>
      </Box>
    </TableProvider>
  );
}
