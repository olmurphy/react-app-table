import { styled } from "@mui/material/styles";

interface ResizeHandleProps {
  onMouseDown: (event: React.MouseEvent) => void;
  columnId: string | number;
  className?: string;
}

/**
 * Styled component for the resize handle visual appearance
 */
const StyledResizeHandle = styled("div")(({ theme }) => ({
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


/**
 * ResizeHandle component for table column resizing
 * Provides a visual handle that users can drag to resize columns
 */
export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, columnId, className }) => {
  return (
    <StyledResizeHandle
      onMouseDown={onMouseDown}
      data-column-id={columnId}
      className={className}
      aria-label={`Resize column ${columnId}`}
    />
  );
};