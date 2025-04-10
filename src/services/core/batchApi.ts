import { apiClient, ApiClient } from "./api";
import { logger } from "../../utils/logger";

interface BatchRequest<T> {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  headers?: Record<string, string>;
  resolve: (value: T | null | PromiseLike<T | null>) => void;
  reject: (reason?: any) => void;
}

export class BatchApiClient {
  private readonly apiClient: ApiClient;
  private readonly batch: BatchRequest<any>[] = [];
  private batchProcessingPromise: Promise<void> | null = null;
  private readonly batchSize: number;
  private readonly autoFlushInterval: number;
  private autoFlushTimer: any = null;
  private activeRequests: number = 0;

  constructor(apiClient: ApiClient, batchSize = 5, autoFlushInterval = 500) {
    this.apiClient = apiClient;
    this.batchSize = batchSize;
    this.autoFlushInterval = autoFlushInterval;
    this.setupAutoFlush();
  }

  private setupAutoFlush(): void {
    this.autoFlushTimer = setInterval(() => {
      this.flush();
    }, this.autoFlushInterval);
  }

  private clearAutoFlush(): void {
    if (this.autoFlushTimer) {
      clearInterval(this.autoFlushTimer);
      this.autoFlushTimer = null;
    }
  }

  enqueue<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    headers?: Record<string, string>
  ): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      this.batch.push({ endpoint, method, data, headers, resolve, reject });
      this.processBatch();
    });
  }

  private async processBatch(): Promise<void> {
    if (this.batchProcessingPromise) {
      return this.batchProcessingPromise;
    }

    this.batchProcessingPromise = this.executeBatch();
    await this.batchProcessingPromise;
    this.batchProcessingPromise = null;
  }

  private async executeBatch(): Promise<void> {
    while (this.batch.length > 0 && this.activeRequests < this.batchSize) {
      const requests = this.batch.splice(0, this.batchSize - this.activeRequests);
      console.log("executeBatch", requests);
      const promises = requests.map(async (request) => {
        try {
          const result = await this.apiClient.request(request.endpoint, request.method, request.data, request.headers);
          request.resolve(result);
        } catch (error: any) {
          request.reject(error);
          logger.error("Batch API Error", {
            endpoint: request.endpoint,
            method: request.method,
            error: error.message,
          });
        } finally {
          this.activeRequests--;
          this.processBatch();
        }
      });

      await Promise.all(promises);
    }
  }

  async flush(): Promise<void> {
    if (this.batch.length > 0) {
      await this.executeBatch();
    }
  }

  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T | null> {
    return this.enqueue<T>(endpoint, "GET", undefined, headers);
  }

  async post<T>(endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<T | null> {
    return this.enqueue<T>(endpoint, "POST", data, headers);
  }

  async put<T>(endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<T | null> {
    return this.enqueue<T>(endpoint, "PUT", data, headers);
  }

  async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T | null> {
    return this.enqueue<T>(endpoint, "DELETE", undefined, headers);
  }

  async patch<T>(endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<T | null> {
    return this.enqueue<T>(endpoint, "PATCH", data, headers);
  }
}

export const batchApiClient = new BatchApiClient(apiClient, 5, 0); // Adjust batchSize and autoFlushInterval as needed
