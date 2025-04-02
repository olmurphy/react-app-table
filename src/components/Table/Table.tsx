import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { RefreshIndicator } from "@src/components/Table/RefreshIndicator";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

const ResizeHandle = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: "10px",
  bottom: "10px",
  width: "2px",
  background: theme.palette.border.main,
  cursor: "col-resize",
  userSelect: "none",
  touchAction: "none",
  "&:hover": {
    background: theme.palette.border.dark,
  },
  "&:active": {
    background: theme.palette.primary.main,
  },
}));

// Add themed table styles
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
      : "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
  maxHeight: "900px",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",

  "& .MuiTableRow-root": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.04)
          : alpha(theme.palette.primary.main, 0.08),
    },
    "&.Mui-selected": {
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.08)
          : alpha(theme.palette.primary.main, 0.16),
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.primary.main, 0.24),
      },
    },
  },
  "& .MuiTableCell-root": {
    borderColor: theme.palette.border.light,
  },
  "& .MuiTableHead-root": {
    position: "sticky",
    top: 0,
    zIndex: 2,
    backgroundColor: theme.palette.background.paper,

    "& .MuiTableCell-root": {
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.02)
          : alpha(theme.palette.primary.main, 0.03),
      color: theme.palette.text.primary,
      fontWeight: 600,
      fontSize: "0.875rem",
      height: "32px",
      padding: "4px 8px",
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      height: "36px", // Reduced row height
      "& .MuiTableCell-root": {
        padding: "4px 8px", // Reduced padding
      },
    },
  },

  // Fixed footer
  "& .MuiTableFooter-root": {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
  },
}));

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

type Order = "asc" | "desc";

type FilterValue = string | number | boolean | string[];

interface SortState<T> {
  orderBy: keyof T;
  order: Order;
}

interface SearchFilter {
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

function SearchFilterDropdown<T>({ anchorEl, onClose, columns, onFilterSelect, searchTerm }: SearchFilterDropdownProps<T>) {
  const open = Boolean(anchorEl);
  const id = open ? 'search-filter-popper' : undefined;

  const filteredColumns = columns.filter(column => 
    column.filterable !== false && 
    column.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
          <List>
            {filteredColumns.map((column) => (
              <ListItem key={String(column.id)} disablePadding>
                <ListItemButton onClick={() => {
                  onFilterSelect(column.id);
                  onClose();
                }}>
                  <ListItemText 
                    primary={column.label}
                    secondary={`Filter by ${column.label.toLowerCase()}`}
                  />
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

type EnhancedTableProps<T> = {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
  columns: Column<T>[];
  columnWidths: Record<keyof T, number | string>;
  handleResizeStart: (event: React.MouseEvent, columnId: keyof T) => void;
};

type EnhancedTableToolbarProps = {
  tableName: string;
  onRefresh: () => void;
  onActionSelect: (action: string) => void;
  lastRefreshTime: number;
};
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { tableName, onRefresh, onActionSelect, lastRefreshTime } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: string) => {
    onActionSelect(action);
    handleMenuClose();
  };

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
        {tableName}
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <RefreshIndicator lastRefreshTime={lastRefreshTime} onRefresh={onRefresh} />
        <Button aria-controls="actions-menu" aria-haspopup="true" onClick={handleMenuOpen}>
          Actions
        </Button>
        <Menu id="actions-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleActionClick("Edit")}>Edit</MenuItem>
          <MenuItem onClick={() => handleActionClick("Delete")}>Delete</MenuItem>
          <MenuItem onClick={() => handleActionClick("Add")}>Add</MenuItem>
          <MenuItem onClick={() => handleActionClick("Export to Excel")}>Export to Excel</MenuItem>
          <MenuItem onClick={() => handleActionClick("Export to CSV")}>Export to CSV</MenuItem>
        </Menu>
      </div>
    </Toolbar>
  );
}

function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
    columnWidths,
    handleResizeStart,
  } = props;
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                "aria-label": "Checkbox demo",
              },
            }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={String(column.id)}
            align={column.align || "left"}
            padding={column.disabledPadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
            sx={{
              position: "relative",
              width: columnWidths[column.id] || "auto",
              minWidth: "100px", // Prevent columns from becoming too narrow
              fontSize: "0.875rem",
              padding: "4px 24px 4px 8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // Pushes label and resize handle apart
                pr: 2, // Additional right padding for label
              }}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
              <ResizeHandle
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResizeStart(e, column.id);
                }}
              />
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
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
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
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

  useEffect(() => {
    console.log(sortState);
  }, [sortState]);

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

  useEffect(() => {
    console.log(sortState);
  }, [sortState]);

  const handleRequestSort = (_: React.MouseEvent<unknown>, property: keyof T) => {
    console.log("inside of handleRequestSort");
    const isAsc = sortState.orderBy === property && sortState.order === "asc";
    setSortState({
      orderBy: property,
      order: isAsc ? "desc" : "asc",
    });
  };

  const handleSearchFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchBlur = () => {
    // Small delay to allow click events to fire
    setTimeout(() => {
      setSearchAnchorEl(null);
    }, 200);
  };

  const handleFilterSelect = (column: keyof T) => {
    setCurrentFilterColumn(column);
    const columnLabel = columns.find(c => c.id === column)?.label || String(column);
    setSearchTerm(`${columnLabel} = `);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = searchTerm.split(' = ')[1]?.trim();
      if (value && currentFilterColumn) {
        setActiveFilters(prev => [...prev, { column: currentFilterColumn, value }]);
        handleFilterChangeLocal(currentFilterColumn, value);
        setSearchTerm('');
        setCurrentFilterColumn(null);
      }
    }
  };

  const handleRemoveFilter = (filter: SearchFilter) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
    handleFilterChangeLocal(filter.column, '');
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <Box
    // sx={{
    //   display: "flex",
    //   flexDirection: "column",
    //   height,
    //   width,
    //   overflow: "hidden",
    // }}
    >
      <EnhancedTableToolbar
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
            placeholder="Search…"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={`${columns.find(c => c.id === filter.column)?.label || String(filter.column)} = ${filter.value}`}
                onDelete={() => handleRemoveFilter(filter)}
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
        )}
      </Box>
      <Box>
        <StyledTableContainer>
          <Table>
            <EnhancedTableHead<T>
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

                console.log("isItemSelected", isItemSelected);

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
            <TableFooter>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box>
                    <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                      {selected.length} selected
                    </Typography>
                  </Box>
                </TableCell>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={columns.length}
                  count={totalCount || 0}
                  rowsPerPage={pageSize}
                  page={page - 1}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </StyledTableContainer>
      </Box>
    </Box>
  );
}
