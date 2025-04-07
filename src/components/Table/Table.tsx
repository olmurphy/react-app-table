import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TableProvider } from "./contexts/TableContext";
import { StyledTableContainer } from "./styles/tableStyles";
import { Order, SortState, TableProps } from "./Table.types";
import { TableFooter } from "./TableFooter/TableFooter";
import { FilterChips } from "./TableHeader/FilterChips";
import { TableToolbar } from "./TableHeader/HeaderToolbar";
import { SearchBar } from "./TableHeader/SearchBar";
import { TableHeader } from "./TableHeader/TableHeader";
import { TableRow } from "./TableRow/TableRow";
import { useTableResize } from "../../hooks/useTableResize";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced as T & { cancel: () => void };
}

export function CustomTable<T extends Record<string, any>>({
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
  height = "100%",
  width = "100%",
}: Readonly<TableProps<T>>) {
  const [sortState, setSortState] = useState<SortState<T>>(() => ({
    orderBy: initialSort?.orderBy || columns[0].id,
    order: initialSort?.order || "asc",
  }));
  const [filters, setFilters] = useState<Partial<Record<keyof T, string | number | boolean | string[]>>>({});
  
  // Use the custom hook for column resizing
  const { columnWidths, handleResizeStart, initializeColumnWidths } = useTableResize<T>();

  // Initialize column widths when columns change
  useEffect(() => {
    initializeColumnWidths(columns);
  }, [columns, initializeColumnWidths]);

  const handleActionSelect = (action: string) => {
    // Implement action logic here
    // console.log(`Action selected: ${action}`);
  };

  // Debounced sort handler for better performance
  const debouncedSortChange = useMemo(
    () =>
      debounce((property: keyof T, order: Order) => {
        if (onSortChange) {
          onSortChange(property, order);
        }
      }, 300),
    [onSortChange]
  );

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    if (isServerSide) {
      return data;
    }

    let filteredData = data;

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filteredData = filteredData.filter((row) => {
          const rowValue = row[key as keyof T];

          if (Array.isArray(value)) {
            return value.includes(rowValue as string); // Handle select/multiple filters
          }

          if (typeof rowValue === "string" && typeof value === "string") {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }

          return rowValue === value;
        });
      }
    });

    // Apply sorting & pagination
    return [...filteredData]
      .sort(getComparator(sortState.order, sortState.orderBy))
      .slice((page - 1) * pageSize, page * pageSize);
  }, [data, filters, sortState.order, sortState.orderBy, isServerSide, page, pageSize]);

  // Handle edit
  const handleEditLocal = useCallback(
    (row: T, field: keyof T, newValue: any) => {
      if (onEdit) {
        onEdit(row, field, newValue);
      }
    },
    [onEdit]
  );

  //Handle delete
  const handleDeleteLocal = useCallback(
    (row: T) => {
      if (onDelete) {
        onDelete(row);
      }
    },
    [onDelete]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSortChange.cancel();
    };
  }, [debouncedSortChange]);

  const handleRequestSort = (_: React.MouseEvent<unknown>, property: keyof T) => {
    console.log("inside of handleRequestSort");
    const isAsc = sortState.orderBy === property && sortState.order === "asc";
    setSortState({
      orderBy: property,
      order: isAsc ? "desc" : "asc",
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(event.target.value, 10));
    }
  };

  return (
    <TableProvider
      data={data}
      columns={columns}
      isServerSide={isServerSide}
      loading={loading}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
    >
      <Box>
        <TableToolbar tableName={tableName} onActionSelect={handleActionSelect} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            gap: "8px",
          }}
        >
          <SearchBar />
          <FilterChips />
        </Box>
        <Box>
          <StyledTableContainer>
            <Table>
              <TableHeader
                numSelected={0}
                onRequestSort={handleRequestSort}
                onSelectAllClick={() => {}}
                order={sortState.order}
                orderBy={sortState.orderBy}
                rowCount={data.length}
                columns={columns}
                columnWidths={columnWidths}
                handleResizeStart={handleResizeStart}
              />
              <TableBody>
                {processedData.map((row) => {
                  return <TableRow key={row.id} row={row} />;
                })}
              </TableBody>
              <TableFooter
                page={page - 1}
                pageSize={pageSize}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Table>
          </StyledTableContainer>
        </Box>
      </Box>
    </TableProvider>
  );
}
