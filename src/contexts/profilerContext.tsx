import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { logger } from "../utils/logger";

interface ProfilerContextType {
  startProfiling: () => void;
  stopProfiling: () => void;
  recordRender: (
    id: string,
    phase: string,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: number
  ) => any;
  getProfilingData: () => any;
  isProfiling: boolean;
}

export const ProfilerContext = createContext<ProfilerContextType | undefined>(undefined);

export const ProfilerProvider = ({ children }) => {
  const [profilingData, setProfilingData] = useState({});
  const [isProfiling, setIsProfiling] = useState(true);
  const startTimeRef = useRef<any>(null);

  const startProfiling = () => {
    setIsProfiling(true);
    startTimeRef.current = performance.now();
    setProfilingData({});
  };

  const stopProfiling = () => {
    setIsProfiling(false);
    startTimeRef.current = null;
  };

  const recordRender = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
      if (!isProfiling) return;

      const metricData = {
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      }


      setProfilingData((prevData) => {
        return {
          ...prevData,
          [id]: metricData,
        };
      });

      logger.info(`Profiler Metrics for ${id}:`, metricData);
    },
    [isProfiling]
  );

  const getProfilingData = useCallback(() => {
    return profilingData;
  }, [profilingData]);

  const value = useMemo(
    () => ({
      startProfiling,
      stopProfiling,
      recordRender,
      getProfilingData,
      isProfiling,
    }),
    [startProfiling, stopProfiling, recordRender, getProfilingData, isProfiling]
  );
  return <ProfilerContext.Provider value={value}>{children}</ProfilerContext.Provider>;
};

export const useProfiler = (id) => {
  const context = useContext(ProfilerContext);
  if (!context) {
    throw new Error("useProfiler must be used within a ProfilerProvider");
  }

  const { recordRender, isProfiling } = context;

  const onRenderCallback = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
      if (isProfiling) {
        recordRender(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions);
      }
    },
    [recordRender, isProfiling]
  );

  return onRenderCallback;
};
