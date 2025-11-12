import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

dotenv.config();

interface TavilySearchRequest {
  query: string;
  search_depth?: 'basic' | 'advanced';
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
  include_answer?: boolean;
  include_images?: boolean;
  include_raw_content?: boolean;
  topic?: 'general' | 'news';
}

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
  images?: string[];
}

interface TavilySearchResponse {
  query: string;
  response_time: number;
  results: TavilySearchResult[];
  answer?: string;
}

interface TavilySearchOptions {
  searchDepth?: 'basic' | 'advanced';
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeAnswer?: boolean;
  includeImages?: boolean;
  includeRawContent?: boolean;
  topic?: 'general' | 'news';
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
 * Creates a Tavily API search request configuration
 */
function createTavilySearchRequest(
  query: string,
  options: TavilySearchOptions = {}
): TavilySearchRequest {
  const request: TavilySearchRequest = {
    query,
    search_depth: options.searchDepth || 'basic',
    max_results: options.maxResults || 10,
    topic: options.topic || 'general'
  };

  if (options.includeDomains && options.includeDomains.length > 0) {
    request.include_domains = options.includeDomains;
  }

  if (options.excludeDomains && options.excludeDomains.length > 0) {
    request.exclude_domains = options.excludeDomains;
  }

  if (options.includeAnswer !== undefined) {
    request.include_answer = options.includeAnswer;
  }

  if (options.includeImages !== undefined) {
    request.include_images = options.includeImages;
  }

  if (options.includeRawContent !== undefined) {
    request.include_raw_content = options.includeRawContent;
  }

  return request;
}

/**
 * Main function to search using Tavily API
 */
export async function searchWithTavily(
  query: string,
  options: TavilySearchOptions = {}
): Promise<{
  results: FactCheckSearchResult[];
  answer?: string;
  responseTime?: number;
}> {
  logger.info(`Starting Tavily search for query: "${query.slice(0, 100)}${query.length > 100 ? '...' : ''}"`);
  logger.debug('Tavily search options:', options);

  if (!process.env.TAVILY_API_KEY) {
    logger.error('Tavily API key not configured');
    throw new Error('Tavily API key is not configured');
  }

  const headers = {
    'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const requestBody = createTavilySearchRequest(query, options);

    logger.debug('Tavily request body:', JSON.stringify(requestBody, null, 2));
    logger.info(`Tavily API URL: ${CONFIG.TAVILY_API_URL}`);
    logger.info(`Request headers: ${JSON.stringify({ 'Authorization': 'Bearer ***', 'Content-Type': 'application/json' })}`);

    const response = await axios.post<TavilySearchResponse>(
      CONFIG.TAVILY_API_URL,
      requestBody,
      {
        headers,
        timeout: CONFIG.REQUEST_TIMEOUT
      }
    );

    logger.debug('Tavily response received:', {
      status: response.status,
      resultsCount: response.data.results?.length || 0,
      responseTime: response.data.response_time
    });

    // Transform Tavily results to our FactCheckSearchResult format
    const transformedResults: FactCheckSearchResult[] = response.data.results.map((result) => ({
      title: result.title,
      url: result.url,
      publishedDate: result.published_date,
      snippet: result.content?.substring(0, 500) || undefined,
      text: result.content,
      relevanceScore: result.score
    }));

    return {
      results: transformedResults,
      answer: response.data.answer,
      responseTime: response.data.response_time
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Tavily API Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });

      if (error.response?.status === 401) {
        throw new Error('Tavily API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Tavily API rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(`Tavily API error: ${error.response.data.error}`);
      }
    }

    const enhancedError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred during Tavily search'
    );
    throw enhancedError;
  }
}

/**
 * Health check function for Tavily API
 */
export async function checkTavilyApiHealth(): Promise<boolean> {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const response = await axios.post(
      CONFIG.TAVILY_API_URL,
      {
        query: 'test',
        max_results: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Shorter timeout for health check
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Tavily API Health Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    return false;
  }
}

