import { TableFooter as TableFooterMUI } from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React from "react";

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
        <TableCell 
          sx={{ 
            position: 'sticky', 
            left: 0, 
            backgroundColor: 'background.paper',
            zIndex: 1,
            borderRight: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box>
            <Typography color="inherit" variant="subtitle1" component="div">
              {props.totalSelected} selected
            </Typography>
          </Box>
        </TableCell>
        <TableCell colSpan={props.totalColumns - 1} />
        <TableCell 
          sx={{ 
            position: 'sticky', 
            right: 0, 
            backgroundColor: 'background.paper',
            zIndex: 1,
            borderLeft: '1px solid',
            borderColor: 'divider'
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
        </TableCell>
      </TableRow>
    </TableFooterMUI>
  );
}
