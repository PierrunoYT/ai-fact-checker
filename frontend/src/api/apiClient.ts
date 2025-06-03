import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from '../types';

/**
 * Enhanced API client with retry logic, error handling, and request/response interceptors
 */
class ApiClient {
  private client: AxiosInstance;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000; // 1 second

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      timeout: 120000, // 2 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error) => {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      // Handle specific HTTP status codes
      switch (status) {
        case 400:
          return {
            message: data?.error || 'Bad request. Please check your input.',
            statusCode: 400,
            details: data?.details,
            field: data?.field,
          };
        case 401:
          return {
            message: 'Unauthorized. Please check your API key.',
            statusCode: 401,
          };
        case 403:
          return {
            message: 'Forbidden. You do not have permission to perform this action.',
            statusCode: 403,
          };
        case 404:
          return {
            message: 'Resource not found.',
            statusCode: 404,
          };
        case 429:
          return {
            message: 'Too many requests. Please try again later.',
            statusCode: 429,
          };
        case 500:
          return {
            message: 'Internal server error. Please try again later.',
            statusCode: 500,
          };
        case 503:
          return {
            message: 'Service unavailable. Please try again later.',
            statusCode: 503,
          };
        default:
          return {
            message: data?.error || error.message || 'An unexpected error occurred.',
            statusCode: status,
            details: data?.details,
          };
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      return {
        message: 'Network error. Please check your internet connection.',
        statusCode: 0,
      };
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        message: 'Request timeout. The server is taking too long to respond.',
        statusCode: 408,
      };
    }

    // Generic error
    return {
      message: error.message || 'An unexpected error occurred.',
      statusCode: 500,
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shouldRetry(error: ApiError, attempt: number): boolean {
    // Don't retry if we've exceeded max attempts
    if (attempt >= this.maxRetries) {
      return false;
    }

    // Don't retry client errors (4xx), except for 429 (rate limit)
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
      return false;
    }

    // Retry for network errors, timeouts, and server errors
    return (
      error.statusCode === 0 || // Network error
      error.statusCode === 408 || // Timeout
      error.statusCode === 429 || // Rate limit
      (error.statusCode && error.statusCode >= 500) // Server error
    );
  }

  private calculateRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = this.retryDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * baseDelay;
    return baseDelay + jitter;
  }

  async request<T = any>(config: AxiosRequestConfig, attempt: number = 1): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      if (this.shouldRetry(apiError, attempt)) {
        const delay = this.calculateRetryDelay(attempt);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 Retrying request (attempt ${attempt + 1}/${this.maxRetries}) after ${delay}ms`);
        }

        await this.delay(delay);
        return this.request<T>(config, attempt + 1);
      }

      throw apiError;
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  // Get current base URL
  getBaseURL(): string | undefined {
    return this.client.defaults.baseURL;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient };
