import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TableProvider } from "./contexts/TableContext";
import { StyledTableContainer } from "./styles/tableStyles";
import { Order, SortState, TableProps } from "./Table.types";
import { TableFooter } from "./TableFooter/TableFooter";
import { FilterChips } from "./TableHeader/FilterChips";
import { TableToolbar } from "./TableHeader/HeaderToolbar";
import { SearchBar } from "./TableHeader/SearchBar";
import { TableHeader } from "./TableHeader/TableHeader";
import { SelectionCheckbox } from "./components";

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
  const [columnWidths, setColumnWidths] = useState<Record<keyof T, string | number>>({});
  const resizingColumn = useRef<keyof T | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  const handleRefresh = useCallback(() => {
    setLastRefreshTime(Date.now());
    // Implement refresh logic here
    console.log("Refresh clicked");
  }, []);

  const handleActionSelect = (action: string) => {
    // Implement action logic here
    // console.log(`Action selected: ${action}`);
  };

  const handleResizeStart = useCallback(
    (event: React.MouseEvent, columnId: keyof T) => {
      event.preventDefault();
      resizingColumn.current = columnId;
      startX.current = event.clientX;
      startWidth.current = columnWidths[columnId] || 100;

      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
    },
    [columnWidths]
  );

  const handleResize = useCallback((event: MouseEvent) => {
    if (!resizingColumn.current) return;

    const diff = event.clientX - startX.current;
    const newWidth = Math.max(100, startWidth.current + diff); // Minimum width of 100px

    setColumnWidths((prev) => ({
      ...prev,
      [resizingColumn.current!]: newWidth,
    }));
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizingColumn.current = null;
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleResizeEnd);
  }, [handleResize]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [handleResize, handleResizeEnd]);

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

  // Handle filter change
  const handleFilterChangeLocal = useCallback(
    (property: keyof T, value: string | number | boolean | string[]) => {
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

  // Handle row click
  const handleRowClickLocal = useCallback(
    (event: React.MouseEvent<unknown>, row: T) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

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

  const handleChangePage = (event: unknown, newPage: number) => {
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
        <TableToolbar
          tableName={tableName}
          onRefresh={handleRefresh}
          onActionSelect={handleActionSelect}
          lastRefreshTime={lastRefreshTime}
        />
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
                {processedData.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClickLocal(event, row)}
                      key={row.id}
                      role="checkbox"
                      tabIndex={-1}
                      sx={{ cursor: "pointer", height: "40px" }}
                    >
                      <TableCell padding="checkbox">
                        <SelectionCheckbox row={row} />
                      </TableCell>
                      {columns.map((column) => {
                        return <TableCell key={column.id as number}>{row[column.id as keyof T]}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter
                totalColumns={columns.length}
                totalCount={totalCount || 0}
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

// export function Table<T extends Record<string, any>>(props: TableProps<T>) {
//   const {
//     data,
//     columns,
//     isServerSide = false,
//     loading = false,
//     // ... other props destructuring
//   } = props;

//   const { sortState, handleRequestSort } = useTableSort<T>({
//     initialSort: props.initialSort,
//     onSortChange: props.onSortChange,
//   });

//   const contextValue = {
//     columns,
//     data,
//     isServerSide,
//     loading,
//     // ... other shared values
//   };

//   return (
//     <TableProvider value={contextValue}>
//       <Box>
//         <SearchBar />
//         <FilterChips />
//         <StyledTableContainer>
//           <TableHeader
//             onRequestSort={handleRequestSort}
//             sortState={sortState}
//           />
//           <TableBody />
//           <TableFooter />
//         </StyledTableContainer>
//       </Box>
//     </TableProvider>
//   );
// }

// export function CustomTable<T extends Record<string, any>>({
//   tableName,
//   data,
//   columns,
//   // ... other props
// }: Readonly<TableProps<T>>) {
//   const { sortState, handleRequestSort } = useTableSort({
//     initialSort,
//     onSortChange,
//   });

//   const {
//     filters,
//     activeFilters,
//     handleFilterChange,
//     handleRemoveFilter,
//     handleClearFilters,
//   } = useTableFilter({
//     onFilterChange,
//   });

//   const { selected, handleSelectAllClick, handleSelectOneClick } = useTableSelection({
//     data,
//     onSelectionChange,
//   });

//   const { columnWidths, handleResizeStart } = useTableResize<T>();

//   const {
//     searchTerm,
//     searchAnchorEl,
//     searchInputRef,
//     handleSearchChange,
//     handleSearchFocus,
//     handleFilterSelect,
//     handleSearchClose,
//   } = useTableSearch({
//     columns,
//     onFilterChange: handleFilterChange,
//   });

//   const { handleChangePage, handleChangeRowsPerPage } = useTablePagination({
//     page,
//     pageSize,
//     onPageChange,
//     onPageSizeChange,
//   });

//   // ... rest of the component
// }
