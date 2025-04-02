import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTimeAgo } from '../../hooks/useTimeAgo';

interface RefreshIndicatorProps {
  lastRefreshTime: number;
  onRefresh: () => void;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ lastRefreshTime, onRefresh }) => {
  const timeAgo = useTimeAgo(lastRefreshTime);

  const formatTimeAgo = (): string => {
    const { value, unit } = timeAgo;
    if (value === 0) return 'just now';
    if (value === 1) return `1 ${unit} ago`;
    return `${value} ${unit}s ago`;
  };

  return (
    <Box
      component="button"
      onClick={onRefresh}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        color: 'text.secondary',
        background: 'none',
        border: 'none',
        padding: 0.5,
        cursor: 'pointer',
        '&:hover': {
          color: 'primary.main',
        },
        '&:focus': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
      aria-label="Refresh data"
    >
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 'fit-content',
          alignItems: 'flex-end',
        }}
      >
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontSize: '0.75rem',
            lineHeight: 1,
          }}
        >
          Last updated
        </Typography>
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontSize: '0.75rem',
            lineHeight: 1,
          }}
        >
          {formatTimeAgo()}
        </Typography>
      </Box>
      <RefreshIcon sx={{ fontSize: '1.25rem', mr: 0.5 }} />
    </Box>
  );
}; 