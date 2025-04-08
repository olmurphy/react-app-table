import { TableFooter as TableFooterMUI } from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTableSelection } from "../hooks";
import { useTableContext } from "../contexts/TableContext";
import { StyleFooter } from "../styles/tableStyles";

type TableFooterProps<T> = {
  page: number;
  pageSize: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TableFooter<T>(props: Readonly<TableFooterProps<T>>) {
  const { state, dispatch } = useTableContext<T>();
  
  const { getSelectedCount } = useTableSelection<T>();


  return (
    <StyleFooter>

      <TableFooterMUI sx={{
        width: "100%",
        position: "sticky",
        bottom: 0,
        // backgroundColor: theme.palette.background.paper,
        zIndex: 1,
      }}>
        <TableRow
        sx={{
          width: "100%",
        }}>
          <TableCell sx={{ width: "100vw", py: 0}} colSpan={10}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 0,
                width: "100%",
                backgroundColor: "inherit",
                margin: 0,
                "& .MuiTablePagination-root": {
                  marign: 0,
                  padding: 0,
                },
              }}
            >
              <Box>
                <Typography color="inherit" variant="subtitle1" component="div">
                  {getSelectedCount()} selected
                </Typography>
              </Box>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={state.columns.length}
                count={state.data.length}
                rowsPerPage={props.pageSize}
                page={props.page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                  },
                }}
                onPageChange={(_, newPage) => props.handleChangePage(_, newPage)}
                onRowsPerPageChange={props.handleChangeRowsPerPage}
              />
            </Box>
          </TableCell>
        </TableRow>
      </TableFooterMUI>
    </StyleFooter>
  );
}
