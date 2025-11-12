import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

dotenv.config();

interface ExaSearchRequest {
  query: string;
  type?: 'neural' | 'keyword' | 'auto' | 'fast';
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string; // ISO 8601 format
  endPublishedDate?: string; // ISO 8601 format
  startCrawlDate?: string; // ISO 8601 format
  endCrawlDate?: string; // ISO 8601 format
  category?: string;
  userLocation?: string;
  includeText?: string[];
  excludeText?: string[];
  contents?: {
    text?: boolean;
    summary?: boolean | {
      query?: string;
      schema?: any;
    };
    highlights?: boolean | {
      query?: string;
      numSentences?: number;
      highlightsPerUrl?: number;
    };
    context?: boolean | {
      maxCharacters?: number;
    };
  };
  moderation?: boolean;
  context?: boolean;
}

interface ExaSearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  id: string;
  image?: string;
  favicon?: string;
  text?: string;
  summary?: string;
  highlights?: string[];
  highlightScores?: number[];
  subpages?: ExaSearchResult[];
}

interface ExaSearchResponse {
  requestId: string;
  resolvedSearchType: 'neural' | 'keyword';
  results: ExaSearchResult[];
  searchType: 'auto' | 'neural' | 'keyword' | 'fast';
  context?: string;
  costDollars?: {
    total: number;
    breakDown: Array<{
      search: number;
      contents: number;
      breakdown: {
        keywordSearch: number;
        neuralSearch: number;
        contentText: number;
        contentHighlight: number;
        contentSummary: number;
      };
    }>;
  };
}

interface ExaSearchOptions {
  type?: 'neural' | 'keyword' | 'auto' | 'fast';
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  startCrawlDate?: string;
  endCrawlDate?: string;
  category?: string;
  userLocation?: string;
  includeText?: string[];
  excludeText?: string[];
  getText?: boolean;
  getSummary?: boolean;
  getHighlights?: boolean;
  getContext?: boolean;
  contextMaxCharacters?: number;
  moderation?: boolean;
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
 * Converts date from MM/DD/YYYY format to ISO 8601 format
 */
function convertToISO8601(dateStr: string): string | undefined {
  if (!dateStr) return undefined;
  
  try {
    // Handle MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}T00:00:00.000Z`;
    }
    
    // If already in ISO format, return as is
    if (dateStr.includes('T')) {
      return dateStr;
    }
    
    // Try to parse as date and convert
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    logger.warn(`Failed to convert date: ${dateStr}`, error);
  }
  
  return undefined;
}

/**
 * Creates an Exa API search request configuration
 */
function createExaSearchRequest(
  query: string,
  options: ExaSearchOptions = {}
): ExaSearchRequest {
  const request: ExaSearchRequest = {
    query,
    type: options.type || 'auto',
    numResults: options.numResults || 10,
    includeDomains: options.includeDomains,
    excludeDomains: options.excludeDomains,
    userLocation: options.userLocation,
    category: options.category,
    includeText: options.includeText,
    excludeText: options.excludeText,
    moderation: options.moderation || false
  };

  // Convert dates to ISO 8601 format
  if (options.startPublishedDate) {
    request.startPublishedDate = convertToISO8601(options.startPublishedDate);
  }
  if (options.endPublishedDate) {
    request.endPublishedDate = convertToISO8601(options.endPublishedDate);
  }
  if (options.startCrawlDate) {
    request.startCrawlDate = convertToISO8601(options.startCrawlDate);
  }
  if (options.endCrawlDate) {
    request.endCrawlDate = convertToISO8601(options.endCrawlDate);
  }

  // Configure contents retrieval
  const contents: ExaSearchRequest['contents'] = {};
  
  if (options.getText) {
    contents.text = true;
  }
  
  if (options.getSummary) {
    contents.summary = true;
  }
  
  if (options.getHighlights) {
    contents.highlights = true;
  }
  
  if (options.getContext) {
    if (options.contextMaxCharacters) {
      contents.context = {
        maxCharacters: options.contextMaxCharacters
      };
    } else {
      contents.context = true;
    }
  }

  if (Object.keys(contents).length > 0) {
    request.contents = contents;
  }

  // Context can also be set at top level
  if (options.getContext && !request.contents) {
    request.context = true;
  }

  return request;
}

/**
 * Main function to search using Exa API
 */
export async function searchWithExa(
  query: string,
  options: ExaSearchOptions = {}
): Promise<{
  results: FactCheckSearchResult[];
  searchType: string;
  costDollars?: number;
  requestId?: string;
}> {
  logger.info(`Starting Exa search for query: "${query.slice(0, 100)}${query.length > 100 ? '...' : ''}"`);
  logger.debug('Exa search options:', options);

  if (!process.env.EXA_API_KEY) {
    logger.error('Exa API key not configured');
    throw new Error('Exa API key is not configured');
  }

  const headers = {
    'x-api-key': process.env.EXA_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    const requestBody = createExaSearchRequest(query, options);
    
    logger.debug('Exa request body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post<ExaSearchResponse>(
      CONFIG.EXA_API_URL,
      requestBody,
      { 
        headers, 
        timeout: CONFIG.REQUEST_TIMEOUT 
      }
    );

    logger.debug('Exa response received:', {
      status: response.status,
      resultsCount: response.data.results?.length || 0
    });

    // Transform Exa results to our FactCheckSearchResult format
    const transformedResults: FactCheckSearchResult[] = response.data.results.map((result, index) => ({
      title: result.title,
      url: result.url,
      publishedDate: result.publishedDate,
      author: result.author,
      snippet: result.text?.substring(0, 500) || result.summary || undefined,
      text: result.text,
      summary: result.summary,
      highlights: result.highlights,
      relevanceScore: result.highlightScores?.[0] || undefined
    }));

    return {
      results: transformedResults,
      searchType: response.data.resolvedSearchType || response.data.searchType || 'auto',
      costDollars: response.data.costDollars?.total,
      requestId: response.data.requestId
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Exa API Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });

      if (error.response?.status === 401) {
        throw new Error('Exa API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Exa API rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(`Exa API error: ${error.response.data.error}`);
      }
    }

    const enhancedError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred during Exa search'
    );
    throw enhancedError;
  }
}

/**
 * Health check function for Exa API
 */
export async function checkExaApiHealth(): Promise<boolean> {
  if (!process.env.EXA_API_KEY) {
    throw new Error('Exa API key is not configured');
  }

  try {
    const response = await axios.post(
      CONFIG.EXA_API_URL,
      {
        query: 'test',
        numResults: 1
      },
      {
        headers: {
          'x-api-key': process.env.EXA_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Shorter timeout for health check
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Exa API Health Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    return false;
  }
}

