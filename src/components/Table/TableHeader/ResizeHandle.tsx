import { styled } from "@mui/material/styles";
import React from "react";

interface ResizeHandleProps {
  onMouseDown: (event: React.MouseEvent) => void;
  columnId: string | number;
  className?: string;
}

/**
 * Styled component for the resize handle visual appearance
 * Follows best practices for scalable React/TypeScript applications
 */
const StyledResizeHandle = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: "4px", // Slightly wider for better usability
  background: "transparent", // Transparent by default
  cursor: "col-resize",
  userSelect: "none",
  touchAction: "none",
  transition: "background-color 0.2s ease",
  zIndex: 2, // Ensure it's above other elements
  
  // Hover state
  "&:hover": {
    background: theme.palette.primary.main,
  },
  
  // Active state during resize
  "&:active": {
    background: theme.palette.primary.dark,
  },
  
  // Add a subtle indicator when not hovering
  "&::after": {
    content: '""',
    position: "absolute",
    right: "1px",
    top: "10%",
    bottom: "10%",
    width: "1px",
    background: theme.palette.mode === "light" 
      ? "rgba(0, 0, 0, 0.1)" 
      : "rgba(255, 255, 255, 0.1)",
  },
}));

/**
 * ResizeHandle component for table column resizing
 * Provides a visual handle that users can drag to resize columns
 * Follows best practices for scalable React/TypeScript applications
 */
export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, columnId, className }) => {
  return (
    <StyledResizeHandle
      onMouseDown={onMouseDown}
      data-column-id={columnId}
      className={className}
      aria-label={`Resize column ${columnId}`}
      role="separator"
      aria-orientation="vertical"
    />
  );
};