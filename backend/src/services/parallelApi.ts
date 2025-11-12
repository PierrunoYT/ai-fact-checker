import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

dotenv.config();

interface ParallelSearchRequest {
  objective: string;
  search_queries?: string[];
  max_results?: number;
  excerpts?: {
    max_chars_per_result?: number;
  };
}

interface ParallelSearchResult {
  url: string;
  title: string;
  publish_date?: string | null;
  excerpts: string[];
}

interface ParallelSearchResponse {
  search_id: string;
  results: ParallelSearchResult[];
  warnings?: any;
  usage?: Array<{
    name: string;
    count: number;
  }>;
}

interface ParallelSearchOptions {
  objective: string;
  searchQueries?: string[];
  maxResults?: number;
  maxCharsPerResult?: number;
}

interface FactCheckSearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  snippet?: string;
  text?: string;
  summary?: string;
  highlights?: string[];
  relevanceScore?: number;
}

/**
 * Creates a Parallel API search request configuration
 */
function createParallelSearchRequest(
  objective: string,
  options: ParallelSearchOptions = {}
): ParallelSearchRequest {
  const request: ParallelSearchRequest = {
    objective,
    max_results: options.maxResults || 10
  };

  if (options.searchQueries && options.searchQueries.length > 0) {
    request.search_queries = options.searchQueries;
  }

  if (options.maxCharsPerResult) {
    request.excerpts = {
      max_chars_per_result: options.maxCharsPerResult
    };
  }

  return request;
}

/**
 * Main function to search using Parallel API
 */
export async function searchWithParallel(
  objective: string,
  options: ParallelSearchOptions = {}
): Promise<{
  results: FactCheckSearchResult[];
  searchId?: string;
}> {
  logger.info(`Starting Parallel search for objective: "${objective.slice(0, 100)}${objective.length > 100 ? '...' : ''}"`);
  logger.debug('Parallel search options:', options);

  if (!process.env.PARALLEL_API_KEY) {
    logger.error('Parallel API key not configured');
    throw new Error('Parallel API key is not configured');
  }

  const headers = {
    'x-api-key': process.env.PARALLEL_API_KEY,
    'Content-Type': 'application/json',
    'parallel-beta': 'search-extract-2025-10-10'
  };

  try {
    const requestBody = createParallelSearchRequest(objective, options);

    logger.debug('Parallel request body:', JSON.stringify(requestBody, null, 2));
    logger.info(`Parallel API URL: ${CONFIG.PARALLEL_API_URL}`);
    logger.info(`Request headers: ${JSON.stringify({ 'x-api-key': '***', 'Content-Type': 'application/json', 'parallel-beta': 'search-extract-2025-10-10' })}`);

    const response = await axios.post<ParallelSearchResponse>(
      CONFIG.PARALLEL_API_URL,
      requestBody,
      {
        headers,
        timeout: CONFIG.REQUEST_TIMEOUT
      }
    );

    logger.debug('Parallel response received:', {
      status: response.status,
      resultsCount: response.data.results?.length || 0,
      searchId: response.data.search_id
    });

    // Transform Parallel results to our FactCheckSearchResult format
    const transformedResults: FactCheckSearchResult[] = response.data.results.map((result) => {
      // Combine all excerpts into a single text/snippet
      const combinedExcerpts = result.excerpts.join('\n\n');
      const snippet = combinedExcerpts.substring(0, 500);
      const text = combinedExcerpts;

      return {
        title: result.title,
        url: result.url,
        publishedDate: result.publish_date || undefined,
        snippet: snippet || undefined,
        text: text || undefined
      };
    });

    return {
      results: transformedResults,
      searchId: response.data.search_id
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Parallel API Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });

      if (error.response?.status === 401) {
        throw new Error('Parallel API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Parallel API rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(`Parallel API error: ${error.response.data.error}`);
      }
    }

    const enhancedError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred during Parallel search'
    );
    throw enhancedError;
  }
}

/**
 * Health check function for Parallel API
 */
export async function checkParallelApiHealth(): Promise<boolean> {
  if (!process.env.PARALLEL_API_KEY) {
    throw new Error('Parallel API key is not configured');
  }

  try {
    const response = await axios.post(
      CONFIG.PARALLEL_API_URL,
      {
        objective: 'test',
        max_results: 1
      },
      {
        headers: {
          'x-api-key': process.env.PARALLEL_API_KEY,
          'Content-Type': 'application/json',
          'parallel-beta': 'search-extract-2025-10-10'
        },
        timeout: 10000 // Shorter timeout for health check
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Parallel API Health Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    return false;
  }
}

