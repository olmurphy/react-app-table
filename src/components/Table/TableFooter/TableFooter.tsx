import { TableFooter as TableFooterMUI } from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTableSelection } from "../hooks";

type TableFooterProps<T> = {
  totalColumns: number;
  totalCount: number;
  page: number;
  pageSize: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TableFooter<T>(props: Readonly<TableFooterProps<T>>) {
  const { getSelectedCount } = useTableSelection<T>();
  const totalSelected = getSelectedCount();

  return (
    <TableFooterMUI>
      <TableRow>
        <TableCell sx={{ width: "100%", py: 0}} colSpan={props.totalColumns + 1}>
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
                {totalSelected} selected
              </Typography>
            </Box>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={props.totalColumns}
              count={props.totalCount}
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
  );
}
