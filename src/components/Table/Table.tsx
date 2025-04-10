import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import React, { useCallback } from "react";
import { TableProvider } from "./contexts/TableContext";
import { StyledTableContainer } from "./styles/tableStyles";
import { TableProps } from "./Table.types";
import { TableBody } from "./TableBody/TableBody";
import { TableFooter } from "./TableFooter/TableFooter";
import { FilterChips } from "./TableHeader/FilterChips";
import { TableToolbar } from "./TableHeader/HeaderToolbar";
import { SearchBar } from "./TableHeader/SearchBar";
import { TableHeader } from "./TableHeader/TableHeader";

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
  const handleActionSelect = (action: string) => {
    // Implement action logic here
    // console.log(`Action selected: ${action}`);
  };

  const handleEditLocal = useCallback(
    (row: T, field: keyof T, newValue: any) => {
      if (onEdit) {
        onEdit(row, field, newValue);
      }
    },
    [onEdit]
  );

  const handleDeleteLocal = useCallback(
    (row: T) => {
      if (onDelete) {
        onDelete(row);
      }
    },
    [onDelete]
  );

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
    >
      <Box sx={{ height: "100%"}}>
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
            <Table sx={{ width: "max-content" }}>
              <TableHeader />
              <TableBody />
            </Table>
          </StyledTableContainer>
          <TableFooter
            page={page - 1}
            pageSize={pageSize}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </TableProvider>
  );
}
