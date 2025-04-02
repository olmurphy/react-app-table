// src/services/core/loggingMetricsApi.ts
import { apiClient, ApiClient } from "./api";
import { logger, LogEntry } from "../../utils/logger";

interface MetricEntry {
  name: string;
  value: number;
  timestamp: number;
  // ... other metric fields
}

export class LoggingMetricsApiClient {
  private readonly apiClient: ApiClient;
  private readonly logBatch: LogEntry[] = [];
  private readonly metricBatch: MetricEntry[] = [];
  private readonly logBatchSize: number;
  private readonly metricBatchSize: number;
  private readonly logFlushInterval: number;
  private readonly metricFlushInterval: number;
  private logFlushTimer: any = null;
  private metricFlushTimer: any = null;

  constructor(apiClient: ApiClient, logBatchSize = 100, metricBatchSize = 50, logFlushInterval = 1000, metricFlushInterval = 500) {
    this.apiClient = apiClient;
    this.logBatchSize = logBatchSize;
    this.metricBatchSize = metricBatchSize;
    this.logFlushInterval = logFlushInterval;
    this.metricFlushInterval = metricFlushInterval;
    this.setupFlushTimers();
  }

  private setupFlushTimers(): void {
    this.logFlushTimer = setInterval(() => this.flushLogs(), this.logFlushInterval);
    this.metricFlushTimer = setInterval(() => this.flushMetrics(), this.metricFlushInterval);
  }

  private clearFlushTimers(): void {
    if (this.logFlushTimer) clearInterval(this.logFlushTimer);
    if (this.metricFlushTimer) clearInterval(this.metricFlushTimer);
  }

  log(entry: LogEntry): void {
    this.logBatch.push(entry);
    this.flushLogsIfNeeded();
  }

  metric(entry: MetricEntry): void {
    this.metricBatch.push(entry);
    this.flushMetricsIfNeeded();
  }

  private flushLogsIfNeeded(): void {
    if (this.logBatch.length >= this.logBatchSize) this.flushLogs();
  }

  private flushMetricsIfNeeded(): void {
    if (this.metricBatch.length >= this.metricBatchSize) this.flushMetrics();
  }

  private async flushLogs(): Promise<void> {
    if (this.logBatch.length === 0) return;
    const batch = this.logBatch.splice(0, this.logBatch.length);
    try {
      await this.apiClient.post("/logs", batch);
    } catch (error) {
      logger.error("Logging API Error", error);
    }
  }

  private async flushMetrics(): Promise<void> {
    if (this.metricBatch.length === 0) return;
    const batch = this.metricBatch.splice(0, this.metricBatch.length);
    try {
      await this.apiClient.post("/metrics", batch);
    } catch (error) {
      logger.error("Metrics API Error", error);
    }
  }
}

export const loggingMetricsApiClient = new LoggingMetricsApiClient(apiClient);