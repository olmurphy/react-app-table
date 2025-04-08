import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ResizeHandle } from "./ResizeHandle";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { Column, Order } from "../Table.types";
import { useTableContext } from "../contexts/TableContext";
import { SelectionCheckbox } from "../components";
import { useEffect } from "react";

type TableHeader<T> = {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  columnWidths: Record<keyof T, number | string>;
  handleResizeStart: (event: React.MouseEvent, columnId: keyof T) => void;
};

export function TableHeader<T>(props: Readonly<TableHeader<T>>) {
  const { state, dispatch } = useTableContext<T>();
  const { order, orderBy, onRequestSort, columnWidths, handleResizeStart } = props;

  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    const isAsc = state.sortState.orderBy === property && state.sortState.order === "asc";
    dispatch({
      type: "SET_SORT",
      payload: {
        orderBy: property,
        order: isAsc ? "desc" : "asc",
      },
    });
    onRequestSort(event, property);
  };


  useEffect(() => {
    console.log(columnWidths);
  }, [columnWidths])

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <SelectionCheckbox isHeader={true} />
        </TableCell>
        {state.columns.map((column) => (
          <TableCell
            key={column.id as number}
            align={column.align || "left"}
            sortDirection={orderBy === column.id ? order : false}
            sx={{
              position: "relative",
              width: columnWidths[column.id] || "auto",
              maxWidth: "1000px", // Prevent columns from becoming too narrow
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
                columnId={column.id}
              />
            </Box>
          </TableCell>
        ))}
        <TableCell sx={{
          width: "300px",
        }} id={"Presentation"}></TableCell>
      </TableRow>
    </TableHead>
  );
}
