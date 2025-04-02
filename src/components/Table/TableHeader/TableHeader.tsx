import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ResizeHandle } from "./ResizeHandle";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { Column, Order } from "../Table";

type TableHeader<T> = {
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

export function TableHeader<T>(props: Readonly<TableHeader<T>>) {
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