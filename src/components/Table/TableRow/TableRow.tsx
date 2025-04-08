import {TableRow as TableRowMUI} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { SelectionCheckbox } from "../components";
import { useTableContext } from "../contexts/TableContext";
import { useTableSelection } from "@src/components/Table/hooks";

type TableRowProps<T> = {
  row: T;
}

export function TableRow<T>(props: Readonly<TableRowProps<T>>) {
  const { state } = useTableContext<T>();
  const { isRowSelected, handleSelectOneClick } = useTableSelection<T>();
  
  return (
    <TableRowMUI
      hover
      onClick={(event) => handleSelectOneClick(event, props.row)}
      key={props.row.id}
      role="checkbox"
      tabIndex={-1}
      sx={{ cursor: "pointer", height: "40px" }}
      selected={isRowSelected(props.row)}
    >
      <TableCell padding="checkbox">
        <SelectionCheckbox row={props.row} />
      </TableCell>
      {state.columns.map((column) => {
        return <TableCell key={column.id as number}>{props.row[column.id as keyof T]}</TableCell>;
      })}
          <TableCell sx={{width: "300px"}} id={"Presentation"}></TableCell>
    </TableRowMUI>
  );
}
