import { useState, useEffect, useCallback } from 'react';

type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

interface TimeAgo {
  value: number;
  unit: TimeUnit;
}

const TIME_UNITS: TimeUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
const UNIT_SECONDS = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
};

export const useTimeAgo = (timestamp: number) => {
  const [timeAgo, setTimeAgo] = useState<TimeAgo>({ value: 0, unit: 'second' });

  const calculateTimeAgo = useCallback(() => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
      setTimeAgo({ value: diffInSeconds, unit: 'second' });
      return;
    }

    for (let i = TIME_UNITS.length - 1; i >= 0; i--) {
      const unit = TIME_UNITS[i];
      const value = Math.floor(diffInSeconds / UNIT_SECONDS[unit]);
      
      if (value >= 1) {
        setTimeAgo({ value, unit });
        return;
      }
    }
  }, [timestamp]);

  useEffect(() => {
    calculateTimeAgo();

    // Update every second if less than a minute
    if (timeAgo.unit === 'second') {
      const interval = setInterval(calculateTimeAgo, 1000);
      return () => clearInterval(interval);
    }

    // Update every minute if less than an hour
    if (timeAgo.unit === 'minute') {
      const interval = setInterval(calculateTimeAgo, 60000);
      return () => clearInterval(interval);
    }

    // Update every hour if less than a day
    if (timeAgo.unit === 'hour') {
      const interval = setInterval(calculateTimeAgo, 3600000);
      return () => clearInterval(interval);
    }

    // Update every day for larger units
    const interval = setInterval(calculateTimeAgo, 86400000);
    return () => clearInterval(interval);
  }, [calculateTimeAgo, timeAgo.unit]);

  return timeAgo;
}; 