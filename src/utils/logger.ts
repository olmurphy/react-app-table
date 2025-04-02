import { ApiClient, apiClient } from "../services/core/api";

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = process.env.NODE_ENV === "production" ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
type Metadata = Record<string, any>;

export interface LogEntry {
  level: keyof typeof LOG_LEVELS;
  timestamp: string;
  host: string;
  pathname: string;
  message: string;
  metadata: Metadata;
  sessionId?: string; // TODO: Need add when integrate session
  traceId?: string; // TODO: Need add when integrate tracing
  module?: string;
  filePath?: string;
  lineNumber?: number;
  resource_utilization?: Record<string, any>;
}

export class Logger {
  private readonly apiClient: ApiClient = apiClient;
  private batchedLogs: any[] = [];
  private readonly batchSize: number = 10;
  private readonly logEndpoint: string;
  private flushTimer: any = null;
  private readonly flushInterval: number;

  constructor(batchSize = 10, logEndpoint = "/api/v1/logs", flushInterval = 1000) {
    this.batchSize = batchSize;
    this.logEndpoint = logEndpoint;
    this.flushInterval = flushInterval;
    this.setupFlushTimer();
  }

  private setupFlushTimer(): void {
    this.flushTimer = setInterval(() => this.flushLogs(), this.flushInterval);
  }

  private clearFlushTimer(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
  }

  private async flushLogs(): Promise<void> {
    if (this.batchedLogs.length === 0) return;

    const logsToSend = [...this.batchedLogs];
    this.batchedLogs = [];

    try {
      await this.apiClient.post(this.logEndpoint, {
        "Content-Type": "application/json",
        body: JSON.stringify(logsToSend),
        keepalive: "true",
      });
    } catch (err) {
      console.warn("Failed to send logs", err);
    }
  }
  private getDebugInfo(): { module: string; filePath: string; lineNumber: number } {
    const stack = new Error().stack;
    const stackLines = stack?.split("\n");
    const callerLine = stackLines?.[3];
    const regex = /\((.*):(\d+):\d+\)/;
    const match = callerLine ? regex.exec(callerLine) : null;
    if (match) {
      return {
        module: match[1].split("/").pop() || "",
        filePath: match[1],
        lineNumber: parseInt(match[2], 10),
      };
    }
    return { module: "", filePath: "", lineNumber: 0 };
  }

  private log(level: keyof typeof LOG_LEVELS, message: string, metadata: Metadata) {
    if (LOG_LEVELS[level] < CURRENT_LEVEL) {
      return;
    }
    const { module, filePath, lineNumber } = this.getDebugInfo();
    const memoryUsage = window.performance.memory
      ? this.formatBytes(window.performance.memory.usedJSHeapSize)
      : "unavailable";
    const networkType = (navigator as any).connection ? (navigator as any).connection.effectiveType : "unavailable";
    const logEntry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      host: window.location.hostname,
      pathname: window.location.pathname,
      message,
      metadata,
      module,
      filePath,
      lineNumber,
      resource_utilization: {
        memory: memoryUsage,
        network: networkType
      },
    };
    console.log(logEntry);
    // this.batchedLogs.push(logEntry); TODO: need to implement when backend api for logs implemented

    if (this.batchedLogs.length >= this.batchSize) {
      // this.flushLogs(); TODO: need to implement when backend api for logs implemented
    }
    if (level === "DEBUG") {
      console.log(logEntry);
    }
  }

  debug(message: string, metadata: Metadata = {}) {
    this.log("DEBUG", message, metadata);
  }

  info(message: string, metadata: Metadata = {}) {
    this.log("INFO", message, metadata);
  }

  warn(message: string, metadata: Metadata = {}) {
    this.log("WARN", message, metadata);
  }

  error(message: string, metadata: Metadata = {}) {
    this.log("ERROR", message, metadata);
  }

  /**
   * Flushes the batched logs to the backend.
   */
  async flush(): Promise<void> {
    await this.flushLogs();
  }

  /**
   * Converts bytes to a human-readable format (B, KB, MB, etc.).
   * @param bytes - The number of bytes.
   * @returns The formatted string.
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

export const logger = new Logger(10, "/api/v1/logs");
