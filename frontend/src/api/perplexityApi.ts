import { apiClient } from './apiClient';
import type {
  FactCheckResponse as ImportedFactCheckResponse,
  FactCheckRequest,
  PerplexityModel as ImportedPerplexityModel,
  SearchRecency as ImportedSearchRecency,
  SearchContextSize as ImportedSearchContextSize,
  Citation as ImportedCitation
} from '../types';

// Logging utility with proper types
const log = {
  info: (...args: unknown[]) => console.log('%c[Fact Checker]', 'color: #0ea5e9', ...args),
  error: (...args: unknown[]) => console.log('%c[Fact Checker Error]', 'color: #ef4444', ...args),
  debug: (...args: unknown[]) => console.log('%c[Fact Checker Debug]', 'color: #8b5cf6', ...args)
};

// Re-export types for backward compatibility
export type PerplexityModel = ImportedPerplexityModel;
export type SearchRecency = ImportedSearchRecency;
export type SearchContextSize = ImportedSearchContextSize;
export type Citation = ImportedCitation;
export type FactCheckResponse = ImportedFactCheckResponse;

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

// Set the API client base URL
apiClient.setBaseURL(import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

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
      });

      log.debug('Response received:', response);
      return response;
    } catch (error) {
      log.error('Fact check error:', error);
      throw error;
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