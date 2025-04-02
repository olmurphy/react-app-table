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

  const formatTimeAgo = () => {
    const { value, unit } = timeAgo;
    if (value === 0) return 'just now';
    if (value === 1) return `1 ${unit} ago`;
    return `${value} ${unit}s ago`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 0.5,
        color: 'text.secondary',
        cursor: 'pointer',
        '&:hover': {
          color: 'primary.main',
        },
      }}
      onClick={onRefresh}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onRefresh();
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="caption" component="span" sx={{ fontSize: '0.75rem' }}>
          Last updated
        </Typography>
        <RefreshIcon sx={{ fontSize: '0.875rem' }} />
      </Box>
      <Typography variant="caption" component="span" sx={{ fontSize: '0.75rem' }}>
        {formatTimeAgo()}
      </Typography>
    </Box>
  );
}; 