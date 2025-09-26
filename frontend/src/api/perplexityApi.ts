import { apiClient } from './apiClient';
import type {
  FactCheckResponse as ImportedFactCheckResponse,
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
  searchRecency?: SearchRecency;
  searchAfterDate?: string; // MM/DD/YYYY format
  searchBeforeDate?: string; // MM/DD/YYYY format
  searchContextSize?: SearchContextSize;
  returnImages?: boolean;
  returnRelatedQuestions?: boolean;
  onThinking?: (thinking: string) => void;
  stream?: boolean;
}

const STREAM_TIMEOUT_MS = 120000;

const buildRequestPayload = (statement: string, options: FactCheckOptions): Record<string, unknown> => {
  const payload: Record<string, unknown> = { statement };

  const assignIfDefined = <T>(key: string, value: T | undefined) => {
    if (value !== undefined) {
      payload[key] = value;
    }
  };

  assignIfDefined('model', options.model);
  assignIfDefined('maxTokens', options.maxTokens);
  assignIfDefined('temperature', options.temperature);
  assignIfDefined('frequencyPenalty', options.frequencyPenalty);
  assignIfDefined('presencePenalty', options.presencePenalty);
  assignIfDefined('topK', options.topK);
  assignIfDefined('topP', options.topP);

  if (options.searchDomains && options.searchDomains.length > 0) {
    payload.searchDomains = options.searchDomains;
  }

  assignIfDefined('searchRecency', options.searchRecency);
  assignIfDefined('searchAfterDate', options.searchAfterDate);
  assignIfDefined('searchBeforeDate', options.searchBeforeDate);
  assignIfDefined('searchContextSize', options.searchContextSize);
  assignIfDefined('returnImages', options.returnImages);
  assignIfDefined('returnRelatedQuestions', options.returnRelatedQuestions);

  return payload;
};

const resolveBaseUrl = (): string => {
  const configured = apiClient.getBaseURL();
  const fallback = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  return (configured || fallback).replace(/\/$/, '');
};

const parseStreamChunk = (
  rawMessage: string,
  onThinking?: (thinking: string) => void
): FactCheckResponse | null => {
  const trimmed = rawMessage.trim();
  if (!trimmed) {
    return null;
  }

  const dataLines = trimmed
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.replace(/^data:\s*/, ''));

  const candidate = dataLines.length > 0 ? dataLines.join('') : trimmed;

  try {
    const parsed = JSON.parse(candidate) as { type?: string; content?: unknown };

    if (parsed.type === 'thinking' && typeof parsed.content === 'string') {
      onThinking?.(parsed.content);
      return null;
    }

    if (parsed.type === 'result' && parsed.content) {
      return parsed.content as FactCheckResponse;
    }
  } catch (error) {
    log.debug('Error parsing stream message:', error, candidate);
  }

  return null;
};

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
      const payload = buildRequestPayload(statement, options);
      payload.stream = Boolean(options.stream);

      const response = await apiClient.post<FactCheckResponse>('/check-fact', payload);

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
      const payload = buildRequestPayload(statement, options);
      payload.stream = true;

      const baseUrl = resolveBaseUrl();
      const endpoint = `${baseUrl}/check-fact`;
      const controller = new AbortController();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Streaming request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Streaming is not supported in this environment.');
      }

      const reader = response.body.getReader();
      const textDecoder = new TextDecoder();
      const { onThinking } = options;

      return await new Promise<FactCheckResponse>((resolve, reject) => {
        let buffer = '';
        let result: FactCheckResponse | null = null;

        const streamTimeout = setTimeout(() => {
          controller.abort();
          reject(new Error('Stream timed out. The fact-checking process took too long. Please try again.'));
        }, STREAM_TIMEOUT_MS);

        const cleanup = () => {
          clearTimeout(streamTimeout);
        };

        const handleResolve = (value: FactCheckResponse) => {
          cleanup();
          resolve(value);
        };

        const handleReject = (error: Error) => {
          cleanup();
          reject(error);
        };

        const processBuffer = () => {
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const event of events) {
            const parsedResult = parseStreamChunk(event, onThinking);
            if (parsedResult) {
              result = parsedResult;
            }
          }
        };

        const read = () => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                log.info('Stream ended');
                if (buffer) {
                  const parsedResult = parseStreamChunk(buffer, onThinking);
                  if (parsedResult) {
                    result = parsedResult;
                  }
                  buffer = '';
                }
                if (result) {
                  handleResolve(result);
                } else {
                  handleReject(new Error('Stream ended without result'));
                }
                return;
              }

              buffer += textDecoder.decode(value, { stream: true });
              processBuffer();
              read();
            })
            .catch((error) => {
              log.error('Stream read error:', error);
              if (error.name === 'AbortError') {
                handleReject(new Error('Stream aborted. Please try again.'));
                return;
              }
              handleReject(error instanceof Error ? error : new Error('An unexpected streaming error occurred.'));
            });
        };

        read();
      });
    } catch (error) {
      log.error('Fact check stream error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during streaming.');
    }
  }
};