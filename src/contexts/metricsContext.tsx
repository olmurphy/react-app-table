import React, { createContext, useContext, useReducer } from "react";

// Define metric types
interface PerformanceMetricsState {
  renderTimes: { [component: string]: number[] }; // Component-specific render times
  paintTimes: number[]; // Time taken to paint the screen
  layoutTimes: number[]; // Time spent on layout calculations
  scriptExecutionTimes: number[]; // Time spent executing JavaScript
  resourceLoadTimes: { [resource: string]: number }; // Time taken to load resources
  memoryUsages: number[]; // Memory usage snapshots
  cpuUsages: number[]; // CPU usage snapshots
  frameRates: number[]; // Frames per second
  firstContentfulPaints: number[]; // First contentful paint times
  largestContentfulPaints: number[]; // Largest contentful paint times
  cumulativeLayoutShifts: number[]; // Cumulative layout shift scores
  firstInputDelays: number[]; // First input delay times
  timeToInteractive: number[]; // Time to interactive times
}

// Define action types
type PerformanceMetricsAction =
  | { type: "RECORD_RENDER_TIME"; payload: { component: string; time: number } }
  | { type: "RECORD_PAINT_TIME"; payload: number }
  | { type: "RECORD_LAYOUT_TIME"; payload: number }
  | { type: "RECORD_SCRIPT_EXECUTION_TIME"; payload: number }
  | { type: "RECORD_RESOURCE_LOAD_TIME"; payload: { resource: string; time: number } }
  | { type: "RECORD_MEMORY_USAGE"; payload: number }
  | { type: "RECORD_CPU_USAGE"; payload: number }
  | { type: "RECORD_FRAME_RATE"; payload: number }
  | { type: "RECORD_FIRST_CONTENTFUL_PAINT"; payload: number }
  | { type: "RECORD_LARGEST_CONTENTFUL_PAINT"; payload: number }
  | { type: "RECORD_CUMULATIVE_LAYOUT_SHIFT"; payload: number }
  | { type: "RECORD_FIRST_INPUT_DELAY"; payload: number }
  | { type: "RECORD_TIME_TO_INTERACTIVE"; payload: number };

// Initial performance metrics state
const initialPerformanceMetricsState: PerformanceMetricsState = {
  renderTimes: {},
  paintTimes: [],
  layoutTimes: [],
  scriptExecutionTimes: [],
  resourceLoadTimes: {},
  memoryUsages: [],
  cpuUsages: [],
  frameRates: [],
  firstContentfulPaints: [],
  largestContentfulPaints: [],
  cumulativeLayoutShifts: [],
  firstInputDelays: [],
  timeToInteractive: [],
};

const performanceMetricsReducer = (
  state: PerformanceMetricsState,
  action: PerformanceMetricsAction
): PerformanceMetricsState => {
  console.log("this gets");

  switch (action.type) {
    case "RECORD_RENDER_TIME":
      return {
        ...state,
        renderTimes: {
          ...state.renderTimes,
          [action.payload.component]: [...(state.renderTimes[action.payload.component] || []), action.payload.time],
        },
      };
    case "RECORD_PAINT_TIME":
      return { ...state, paintTimes: [...state.paintTimes, action.payload] };
    case "RECORD_LAYOUT_TIME":
      return { ...state, layoutTimes: [...state.layoutTimes, action.payload] };
    case "RECORD_SCRIPT_EXECUTION_TIME":
      return { ...state, scriptExecutionTimes: [...state.scriptExecutionTimes, action.payload] };
    case "RECORD_RESOURCE_LOAD_TIME":
      return {
        ...state,
        resourceLoadTimes: {
          ...state.resourceLoadTimes,
          [action.payload.resource]: action.payload.time,
        },
      };
    case "RECORD_MEMORY_USAGE":
      return { ...state, memoryUsages: [...state.memoryUsages, action.payload] };
    case "RECORD_CPU_USAGE":
      return { ...state, cpuUsages: [...state.cpuUsages, action.payload] };
    case "RECORD_FRAME_RATE":
      return { ...state, frameRates: [...state.frameRates, action.payload] };
    case "RECORD_FIRST_CONTENTFUL_PAINT":
      return { ...state, firstContentfulPaints: [...state.firstContentfulPaints, action.payload] };
    case "RECORD_LARGEST_CONTENTFUL_PAINT":
      return { ...state, largestContentfulPaints: [...state.largestContentfulPaints, action.payload] };
    case "RECORD_CUMULATIVE_LAYOUT_SHIFT":
      return { ...state, cumulativeLayoutShifts: [...state.cumulativeLayoutShifts, action.payload] };
    case "RECORD_FIRST_INPUT_DELAY":
      return { ...state, firstInputDelays: [...state.firstInputDelays, action.payload] };
    case "RECORD_TIME_TO_INTERACTIVE":
      return { ...state, timeToInteractive: [...state.timeToInteractive, action.payload] };
    default:
      return state;
  }
};

const PerformanceMetricsContext = createContext<
  | {
      state: PerformanceMetricsState;
      dispatch: React.Dispatch<PerformanceMetricsAction>;
    }
  | undefined
>(undefined);

export const PerformanceMetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(performanceMetricsReducer, initialPerformanceMetricsState);
  return (
    <PerformanceMetricsContext.Provider value={{ state, dispatch }}>{children}</PerformanceMetricsContext.Provider>
  );
};

export const usePerformanceMetrics = () => {
  const context = useContext(PerformanceMetricsContext);
  if (!context) {
    throw new Error("usePerformanceMetrics must be used within a PerformanceMetricsProvider");
  }
  return context;
};
