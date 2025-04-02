import { styled } from "@mui/material/styles";

export const ResizeHandle = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: "10px",
  bottom: "10px",
  width: "2px",
  background: theme.palette.border.main,
  cursor: "col-resize",
  userSelect: "none",
  touchAction: "none",
  "&:hover": {
    background: theme.palette.border.dark,
  },
  "&:active": {
    background: theme.palette.primary.main,
  },
}));