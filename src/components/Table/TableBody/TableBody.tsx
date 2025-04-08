import { TableBody as TableBodyMUI, TableCell as TableCellMUI, TableRow as TableRowMUI } from "@mui/material";
import { useTableContext } from "../contexts/TableContext";
import { TableRow } from "../TableRow/TableRow";

export function TableBody<T>(): React.ReactElement | null {
  const { state } = useTableContext<T>();

  if (state.loading) {
    return (
      <TableBodyMUI>
        <TableRowMUI>
          <TableCellMUI colSpan={state.columns.length + 1} align="center">
            Loading...
          </TableCellMUI>
        </TableRowMUI>
      </TableBodyMUI>
    );
  }

  return (
    <TableBodyMUI>
      {state.processedData.map((row) => {
        return <TableRow key={row.id} row={row} />;
      })}
    </TableBodyMUI>
  );
}
