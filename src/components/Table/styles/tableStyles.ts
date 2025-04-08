import { alpha, styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
      : "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
  maxHeight: "900px",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  overflowX: "auto",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light" 
      ? "rgba(0, 0, 0, 0.2)" 
      : "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "& .MuiTableRow-root": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.04)
          : alpha(theme.palette.primary.main, 0.08),
    },
    "&.Mui-selected": {
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.08)
          : alpha(theme.palette.primary.main, 0.16),
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.primary.main, 0.24),
      },
    },
  },
  "& .MuiTableCell-root": {
    borderColor: theme.palette.border.light,
  },
  "& .MuiTableHead-root": {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,

    "& .MuiTableCell-root": {
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.02)
          : alpha(theme.palette.primary.main, 0.03),
      color: theme.palette.text.primary,
      fontWeight: 600,
      fontSize: "0.875rem",
      height: "32px",
      padding: "4px 8px",
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      height: "36px", // Reduced row height
      "& .MuiTableCell-root": {
        padding: "4px 8px", // Reduced padding
      },
    },
  },

  // Fixed footer
  "& .MuiTableFooter-root": {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
}));


export const StyleFooter = styled(TableContainer)(({ theme }) => ({

  // Fixed footer
  "& .MuiTableFooter-root": {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
}));
