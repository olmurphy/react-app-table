import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { SelectionCheckbox } from "../components";
import { useTableContext } from "../contexts/TableContext";
import { useTableResize } from "../hooks/useTableResize";
import { useTableSort } from "../hooks/useTableSort";
import { ResizeHandle } from "./ResizeHandle";

export function TableHeader<T>() {
  const { state } = useTableContext<T>();
  const { handleRequestSort, sortState } = useTableSort<T>();
  const { columnWidths, handleResizeStart } = useTableResize<T>();
  const { order, orderBy } = sortState;

  const createSortHandler = (property: keyof T) => (_: React.MouseEvent<unknown>) => {
    handleRequestSort(property);
  };

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
        <TableCell
          sx={{
            width: "300px",
          }}
          id={"Presentation"}
        ></TableCell>
      </TableRow>
    </TableHead>
  );
}
