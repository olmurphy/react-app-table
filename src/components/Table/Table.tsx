import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyledTableContainer } from "./styles/tableStyles";
import { TableFooter } from "./TableFooter/TableFooter";
import { TableToolbar } from "./TableHeader/HeaderToolbar";
import { TableHeader } from "./TableHeader/TableHeader";


// Define the data types for better type safety
export interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  editable?: boolean;
  sticky?: boolean;
  type?: "number" | "string" | "date" | "select" | "boolean";
  disabledPadding?: boolean;
  options?: string[]; // for select
}

export type Order = "asc" | "desc";

type FilterValue = string | number | boolean | string[];

interface SortState<T> {
  orderBy: keyof T;
  order: Order;
}

interface SearchFilter<T> {
  column: keyof T;
  value: string;
}

interface SearchFilterDropdownProps<T> {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  columns: Column<T>[];
  onFilterSelect: (column: keyof T) => void;
  searchTerm: string;
}

function SearchFilterDropdown<T>({
  anchorEl,
  onClose,
  columns,
  onFilterSelect,
  searchTerm,
}: Readonly<SearchFilterDropdownProps<T>>) {
  const open = Boolean(anchorEl);
  const id = open ? "search-filter-popper" : undefined;

  const filteredColumns = columns.filter(
    (column) => column.filterable !== false && column.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterClick = (column: keyof T) => {
    // Prevent the default behavior that might cause focus loss
    onFilterSelect(column);
    // Don't close the dropdown here - let the parent component handle it
  };

  return (
    <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 2, fontSize: "8px" }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ width: 300, maxHeight: 400, overflow: "auto" }}>
          <List>
            {filteredColumns.map((column) => (
              <ListItem key={String(column.id)} disablePadding>
                <ListItemButton
                  sx={{ padding: 0 }}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default to maintain focus
                    handleFilterClick(column.id);
                  }}
                >
                  <span style={{ fontSize: "16px", paddingLeft: ".5rem" }}>{column.label}</span>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}

interface TableProps<T> {
  tableName: string;
  data: T[];
  columns: Column<T>[];
  onSortChange?: (sortBy: keyof T, sortDirection: Order) => void;
  onFilterChange?: (filters: Partial<Record<keyof T, FilterValue>>) => void; // Improved filter types
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onEdit?: (row: T, field: keyof T, newValue: any) => void; // Use 'field' to match the second interface
  onDelete?: (row: T) => void;
  onExport?: (data?: T[]) => void; // make data optional to match both interfaces.
  onExpand?: (row: T) => void;
  expandedRows?: T[]; // Add expandedRows from second interface
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void; // use page instead of event for simplicity
  onPageSizeChange?: (pageSize: number) => void; // Add onPageSizeChange from second interface
  loading?: boolean;
  rowGrouping?: keyof T | ((row: T) => string); // allow both keyof T and function approach
  aggregation?: Record<keyof T, (values: T[keyof T][]) => any>; // Add aggregation from second interface
  isServerSide?: boolean;
  initialSort?: SortState<T>;
  height?: string | number;
  width?: string | number;
}

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
  const [selected, setSelected] = useState<readonly T[]>([]);
  const [sortState, setSortState] = useState<SortState<T>>(() => ({
    orderBy: initialSort?.orderBy || columns[0].id,
    order: initialSort?.order || "asc",
  }));
  const [filters, setFilters] = useState<Partial<Record<keyof T, string | number | boolean | string[]>>>({});
  const [columnWidths, setColumnWidths] = useState<Record<keyof T, string | number>>({});
  const resizingColumn = useRef<keyof T | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFilter<T>[]>([]);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<keyof T | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    handleFilterChangeLocal("search", event.target.value);
  };

  const handleRefresh = useCallback(() => {
    setLastRefreshTime(Date.now());
    // Implement refresh logic here
    console.log("Refresh clicked");
  }, []);

  const handleActionSelect = (action: string) => {
    // Implement action logic here
    console.log(`Action selected: ${action}`);
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

  // Handle selection change
  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(data);
        if (onSelectionChange) {
          onSelectionChange(data);
        }
        return;
      }
      setSelected([]);
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    },
    [data, onSelectionChange]
  );

  const handleSelectOneClick = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, row: T) => {
      const selectedIndex = selected.indexOf(row);
      let newSelected: T[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, row);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }

      setSelected(newSelected);
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }
    },
    [selected, onSelectionChange]
  );

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

  const handleSearchFocus = (event: React.MouseEvent<HTMLInputElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleFilterSelect = (column: keyof T) => {
    setCurrentFilterColumn(column);
    const columnLabel = columns.find((c) => c.id === column)?.label || String(column);
    setSearchTerm(`${columnLabel} = `);

    // Ensure focus remains on the input and move cursor to the end
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      const length = `${columnLabel} = `.length;
      requestAnimationFrame(() => {
        searchInputRef.current?.setSelectionRange(length, length);
      });
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = searchTerm.split(" = ")[1]?.trim();
      if (value && currentFilterColumn) {
        setActiveFilters((prev) => [...prev, { column: currentFilterColumn, value }]);
        handleFilterChangeLocal(currentFilterColumn, value);
        setSearchTerm("");
        setCurrentFilterColumn(null);
      }
    }
  };

  const handleRemoveFilter = (filter: SearchFilter<T>) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
    handleFilterChangeLocal(filter.column, "");
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: "500px",
            width: "100%",
            position: "relative",
          }}
        >
          <SearchIcon
            sx={{
              position: "absolute",
              left: "8px",
              color: "text.secondary",
            }}
          />
          <InputBase
            inputRef={searchInputRef}
            placeholder="Search…"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
            sx={(theme) => ({
              width: "100%",
              padding: "4px 8px 4px 36px",
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === "light"
                  ? alpha(theme.palette.common.black, 0.05)
                  : alpha(theme.palette.common.white, 0.05),
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? alpha(theme.palette.common.black, 0.07)
                    : alpha(theme.palette.common.white, 0.07),
              },
            })}
          />
          <SearchFilterDropdown
            anchorEl={searchAnchorEl}
            onClose={() => setSearchAnchorEl(null)}
            columns={columns}
            onFilterSelect={handleFilterSelect}
            searchTerm={searchTerm}
          />
        </Box>
        {activeFilters.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={`${columns.find((c) => c.id === filter.column)?.label || String(filter.column)} = ${
                  filter.value
                }`}
                onDelete={() => handleRemoveFilter(filter)}
                color="primary"
                variant="outlined"
              />
            ))}
            <Chip label="Clear filters" onClick={handleClearFilters} color="default" variant="outlined" />
          </Box>
        )}
      </Box>
      <Box>
        <StyledTableContainer>
          <Table>
            <TableHeader
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              order={sortState.order}
              orderBy={sortState.orderBy}
              rowCount={data.length}
              columns={columns}
              columnWidths={columnWidths}
              handleResizeStart={handleResizeStart}
            />
            <TableBody>
              {processedData.map((row, index) => {
                const isItemSelected = selected.includes(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleSelectOneClick(event, row)}
                    key={row.id}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer", height: "40px" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            "aria-label": "Checkbox demo",
                          },
                        }}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      return <TableCell key={column.id as number}>{row[column.id as keyof T]}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter
              totalSelected={selected.length}
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