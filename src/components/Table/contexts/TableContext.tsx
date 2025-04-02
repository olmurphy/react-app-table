import React, { createContext, useContext } from 'react';
import { TableProps, Column } from '../Table.types';

interface TableContextValue<T> {
  columns: Column<T>[];
  data: T[];
  isServerSide: boolean;
  loading?: boolean;
  // Add other shared values
}

const TableContext = createContext<TableContextValue<any> | undefined>(undefined);

export function TableProvider<T>({ 
  children, 
  value 
}: { 
  children: React.ReactNode;
  value: TableContextValue<T>;
}) {
  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext<T>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextValue<T>;
}