import { TableFooter as TableFooterMUI } from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type TableFooterProps = {
  totalSelected: number;
  totalColumns: number;
  totalCount: number;
  page: number;
  pageSize: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TableFooter(props: Readonly<TableFooterProps>) {
  return (
    <TableFooterMUI>
      <TableRow>
        <TableCell colSpan={props.totalColumns}>
          <Box>
            <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
              {props.totalSelected} selected
            </Typography>
          </Box>
        </TableCell>
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
              native: true,
            },
          }}
          onPageChange={props.handleChangePage}
          onRowsPerPageChange={props.handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooterMUI>
  );
}
