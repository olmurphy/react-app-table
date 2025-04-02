import { logger } from "../../utils/logger";

type Headers = Record<string, string>;

interface ApiClientOptions {
  headers?: Headers;
  timeout?: number;
}

export class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Headers;

  constructor(baseURL: string, options: ApiClientOptions = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    this.timeout = options.timeout || 1000;
  }

  async request(endpoint: string, method = "GET", data = null, headers: Headers = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const options = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      signal: controller.signal,
      body: data ? JSON.stringify(data) : undefined,
    };

    logger.debug("API Request", options);

    try {
      const startTime = performance.now();
      const response = await fetch(url, options);
      const endTime = performance.now();
      const latency = endTime - startTime;
      const responseSize = response.headers.get("content-length") || "unknown";
      clearTimeout(timeoutId);

      logger.debug("API Response", {
        url,
        method,
        status: response.status,
        headers: response.headers,
        latency: `${latency}ms`,
        responseSize,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 404) {
          throw new Error("Not found");
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          throw new Error(`HTTP error! status ${response.status}`);
        }
      }

      if (response.status == 204) {
        return null;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        logger.error("Request timeout", { url, method });
        throw new Error("Request timeout");
      }
      logger.error("API Error", { url, method, error: error.message });
      throw error;
    }
  }

  async get<T>(endpoint: string, headers: Headers = {}): Promise<T | null> {
    return this.request(endpoint, "GET", null, headers);
  }

  async put<T>(endpoint: string, headers: Headers = {}): Promise<T | null> {
    return this.request(endpoint, "PUT", null, headers);
  }

  async post<T>(endpoint: string, headers: Headers = {}): Promise<T | null> {
    return this.request(endpoint, "POST", null, headers);
  }

  async delete<T>(endpoint: string, headers: Headers = {}): Promise<T | null> {
    return this.request(endpoint, "DELETE", null, headers);
  }

  async patch<T>(endpoint: string, headers: Headers = {}): Promise<T | null> {
    return this.request(endpoint, "PATCH", null, headers);
  }
}

export const apiClient = new ApiClient("http://localhost:8000", {
  headers: {
    "x-custom-header": "foobar",
  },
  timeout: 15000,
});
