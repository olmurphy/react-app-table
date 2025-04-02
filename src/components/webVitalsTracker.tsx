import { useEffect } from "react";
import { usePerformanceMetrics } from "../contexts/metricsContext";

export function WebVitalsTracker() {
  const { dispatch } = usePerformanceMetrics();
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          dispatch({ type: "RECORD_FIRST_CONTENTFUL_PAINT", payload: entry.startTime });
        } else if (entry.name === "largest-contentful-paint") {
          dispatch({ type: "RECORD_LARGEST_CONTENTFUL_PAINT", payload: entry.startTime });
        } else if (entry.name === "layout-shift") {
          dispatch({ type: "RECORD_CUMULATIVE_LAYOUT_SHIFT", payload: (entry as LayoutShift).value });
        } else if (entry.name === "first-input-delay") {
          dispatch({ type: "RECORD_FIRST_INPUT_DELAY", payload: entry.duration });
        } else if (entry.name === "time-to-interactive") {
          dispatch({ type: "RECORD_TIME_TO_INTERACTIVE", payload: entry.startTime });
        }
      });
    });
    observer.observe({ type: "first-contentful-paint", buffered: true });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    observer.observe({ type: "layout-shift", buffered: true });
    observer.observe({ type: "first-input-delay", buffered: true });
    observer.observe({ type: "time-to-interactive", buffered: true });

    return () => observer.disconnect();
  }, [dispatch]);

  return null;
}
