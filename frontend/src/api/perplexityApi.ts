import axios, { AxiosError } from 'axios';

// Constants
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 120000, // 2 minutes
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
} as const;

// Logging utility with proper types
const log = {
  info: (...args: unknown[]) => console.log('%c[Fact Checker]', 'color: #0ea5e9', ...args),
  error: (...args: unknown[]) => console.log('%c[Fact Checker Error]', 'color: #ef4444', ...args),
  debug: (...args: unknown[]) => console.log('%c[Fact Checker Debug]', 'color: #8b5cf6', ...args)
};

// Types
export type PerplexityModel = 'sonar' | 'sonar-pro' | 'sonar-reasoning' | 'sonar-reasoning-pro';

export interface Citation {
  id: number;
  url: string;
  title?: string;
  domain?: string;
  snippet?: string;
}

export interface FactCheckResponse {
  isFactual: boolean;
  confidence: number;
  explanation: string;
  sources: string[];
  thinking?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: Citation[];
}

export interface FactCheckOptions {
  model?: PerplexityModel;
  maxTokens?: number;
  temperature?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  topK?: number;
  topP?: number;
  searchDomains?: string[];
  searchRecency?: 'month' | 'week' | 'day' | 'hour';
  searchAfterDate?: string; // MM/DD/YYYY format
  searchBeforeDate?: string; // MM/DD/YYYY format
  searchContextSize?: 'low' | 'medium' | 'high';
  returnImages?: boolean;
  returnRelatedQuestions?: boolean;
  onThinking?: (thinking: string) => void;
  stream?: boolean;
}

// API Client
const apiClient = axios.create(API_CONFIG);

// Error Handler
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; details?: string }>;

    // Log the full error details
    log.error('API Request Failed:', {
      code: axiosError.code,
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        data: axiosError.config?.data,
        headers: axiosError.config?.headers
      }
    });

    // Handle timeout specifically
    if (axiosError.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The fact-checking process is taking longer than expected. Please try again.');
    }

    const errorMessage = axiosError.response?.data?.error ||
                        axiosError.response?.data?.details ||
                        axiosError.message;

    switch (axiosError.response?.status) {
      case 400:
        throw new Error(`Invalid request: ${errorMessage}`);
      case 401:
        throw new Error('Authentication required. Please check your credentials.');
      case 403:
        throw new Error('Access denied. Please check your permissions.');
      case 404:
        throw new Error('Service not found. Please check the API configuration.');
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.');
      case 500:
        throw new Error('Server error. Please try again later.');
      case 504:
        throw new Error('Gateway timeout. The fact-checking process took too long. Please try again.');
      default:
        throw new Error(`Error: ${errorMessage}`);
    }
  }
  log.error('Non-Axios Error:', error);
  throw error instanceof Error ? error : new Error('An unexpected error occurred');
};

// API Methods
export const factCheckApi = {
  async checkFact(
    statement: string,
    options: FactCheckOptions = {}
  ): Promise<FactCheckResponse> {
    log.info(`Checking fact: "${statement.slice(0, 100)}${statement.length > 100 ? '...' : ''}"`);
    log.debug('Options:', options);

    try {
      const {
        model,
        maxTokens,
        temperature,
        frequencyPenalty,
        presencePenalty,
        topK,
        topP,
        searchDomains,
        searchRecency,
        searchAfterDate,
        searchBeforeDate,
        searchContextSize,
        returnImages,
        returnRelatedQuestions,
        stream = false
      } = options;

      // Only include date-related parameters if they are defined
      const dateParams = {};
      if (searchRecency) {
        dateParams['searchRecency'] = searchRecency;
      }
      if (searchAfterDate) {
        dateParams['searchAfterDate'] = searchAfterDate;
      }
      if (searchBeforeDate) {
        dateParams['searchBeforeDate'] = searchBeforeDate;
      }

      const response = await apiClient.post<FactCheckResponse>('/check-fact', {
        statement,
        model,
        maxTokens,
        temperature,
        frequencyPenalty,
        presencePenalty,
        topK,
        topP,
        searchDomains,
        searchContextSize,
        returnImages,
        returnRelatedQuestions,
        stream,
        ...dateParams
      }, {
        timeout: 120000 // 2 minutes timeout for fact checking
      });

      log.debug('Response received:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async checkFactWithStream(
    statement: string,
    options: FactCheckOptions = {}
  ): Promise<FactCheckResponse> {
    log.info(`Checking fact with stream: "${statement.slice(0, 100)}${statement.length > 100 ? '...' : ''}"`);
    log.debug('Stream options:', options);

    try {
      const {
        model,
        maxTokens,
        temperature,
        frequencyPenalty,
        presencePenalty,
        topK,
        topP,
        searchDomains,
        searchRecency,
        searchAfterDate,
        searchBeforeDate,
        searchContextSize,
        returnImages,
        returnRelatedQuestions,
        onThinking
      } = options;

      const response = await apiClient.post('/check-fact', {
        statement,
        model,
        maxTokens,
        temperature,
        frequencyPenalty,
        presencePenalty,
        topK,
        topP,
        searchDomains,
        searchContextSize,
        returnImages,
        returnRelatedQuestions,
        stream: true
      }, {
        responseType: 'stream',
        headers: {
          ...API_CONFIG.headers,
          'Accept': 'text/event-stream',
        },
        timeout: 120000 // 2 minutes timeout for streaming
      });

      log.debug('Stream response received, setting up handlers');

      return new Promise((resolve, reject) => {
        let result: FactCheckResponse | null = null;

        // Set a timeout for the entire stream
        const streamTimeout = setTimeout(() => {
          log.error('Stream timeout reached');
          reject(new Error('Stream timed out. The fact-checking process took too long. Please try again.'));
        }, 120000);

        response.data.on('data', (chunk: Uint8Array) => {
          try {
            const data = JSON.parse(chunk.toString());
            log.debug('Stream chunk received:', data);

            if (data.type === 'thinking' && onThinking) {
              log.debug('Thinking update:', data.content);
              onThinking(data.content);
            } else if (data.type === 'result') {
              log.debug('Result received:', data.content);
              result = data.content;
            }
          } catch (error) {
            log.debug('Error parsing stream chunk:', error);
            // Ignore parse errors for partial chunks
          }
        });

        response.data.on('end', () => {
          log.info('Stream ended');
          clearTimeout(streamTimeout);
          if (result) {
            resolve(result);
          } else {
            log.error('Stream ended without result');
            reject(new Error('Stream ended without result'));
          }
        });

        response.data.on('error', (error: Error) => {
          log.error('Stream error:', error);
          clearTimeout(streamTimeout);
          reject(error);
        });
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }
};