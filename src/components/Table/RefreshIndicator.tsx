import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTimeAgo } from "../../hooks/useTimeAgo";

type RefreshIndicatorProps = {
  lastRefreshTime: number;
  onRefresh: () => void;
};

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ lastRefreshTime, onRefresh }) => {
  const timeAgo = useTimeAgo(lastRefreshTime);

  const formatTimeAgo = (): string => {
    const { value, unit } = timeAgo;
    if (value === 0) return "just now";
    if (value === 1) return `1 ${unit} ago`;
    return `${value} ${unit}s ago`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        color: "text.primary",
        background: "none",
        border: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: "fit-content",
          alignItems: "flex-end",
        }}
      >
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1,
          }}
        >
          Last updated
        </Typography>
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1,
          }}
        >
          {formatTimeAgo()}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "5px",
          borderRadius: "50%",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          "&:focus": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
        onClick={onRefresh}
        aria-label="Refresh data"
      >
        <RefreshIcon sx={{ fontSize: "1.25rem" }} />
      </Box>
    </Box>
  );
};
