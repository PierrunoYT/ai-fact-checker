import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

dotenv.config();

interface LinkupSearchRequest {
  q: string;
  depth?: 'standard' | 'deep';
  outputType?: 'sourcedAnswer' | 'raw';
  structuredOutputSchema?: any;
  includeImages?: boolean;
  fromDate?: string; // YYYY-MM-DD format
  toDate?: string; // YYYY-MM-DD format
  excludeDomains?: string[];
  includeDomains?: string[];
  includeInlineCitations?: boolean;
  includeSources?: boolean;
}

interface LinkupSource {
  name: string;
  url: string;
  snippet: string;
}

interface LinkupSearchResponse {
  answer?: string;
  sources?: LinkupSource[];
}

interface LinkupSearchOptions {
  depth?: 'standard' | 'deep';
  outputType?: 'sourcedAnswer' | 'raw';
  structuredOutputSchema?: any;
  includeImages?: boolean;
  fromDate?: string; // YYYY-MM-DD or MM/DD/YYYY format
  toDate?: string; // YYYY-MM-DD or MM/DD/YYYY format
  excludeDomains?: string[];
  includeDomains?: string[];
  includeInlineCitations?: boolean;
  includeSources?: boolean;
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
 * Converts date from MM/DD/YYYY format to YYYY-MM-DD format
 */
function convertToYYYYMMDD(dateStr: string): string | undefined {
  if (!dateStr) return undefined;
  
  try {
    // Handle MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    
    // If already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // Try to parse as date and convert
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    logger.warn(`Failed to convert date: ${dateStr}`, error);
  }
  
  return undefined;
}

/**
 * Creates a Linkup API search request configuration
 */
function createLinkupSearchRequest(
  query: string,
  options: LinkupSearchOptions = {}
): LinkupSearchRequest {
  const request: LinkupSearchRequest = {
    q: query,
    depth: options.depth || 'standard',
    outputType: options.outputType || 'sourcedAnswer',
    includeImages: options.includeImages || false,
    includeInlineCitations: options.includeInlineCitations || false,
    includeSources: options.includeSources !== false, // Default to true
    excludeDomains: options.excludeDomains,
    includeDomains: options.includeDomains
  };

  // Convert dates to YYYY-MM-DD format
  if (options.fromDate) {
    request.fromDate = convertToYYYYMMDD(options.fromDate);
  }
  if (options.toDate) {
    request.toDate = convertToYYYYMMDD(options.toDate);
  }

  // Add structured output schema if provided
  if (options.structuredOutputSchema) {
    request.structuredOutputSchema = options.structuredOutputSchema;
  }

  return request;
}

/**
 * Main function to search using Linkup API
 */
export async function searchWithLinkup(
  query: string,
  options: LinkupSearchOptions = {}
): Promise<{
  results: FactCheckSearchResult[];
  answer?: string;
  sources?: LinkupSource[];
}> {
  logger.info(`Starting Linkup search for query: "${query.slice(0, 100)}${query.length > 100 ? '...' : ''}"`);
  logger.debug('Linkup search options:', options);

  if (!process.env.LINKUP_API_KEY) {
    logger.error('Linkup API key not configured');
    throw new Error('Linkup API key is not configured');
  }

  const headers = {
    'Authorization': `Bearer ${process.env.LINKUP_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const requestBody = createLinkupSearchRequest(query, options);

    logger.debug('Linkup request body:', JSON.stringify(requestBody, null, 2));
    logger.info(`Linkup API URL: ${CONFIG.LINKUP_API_URL}`);
    logger.info(`Request headers: ${JSON.stringify({ 'Authorization': 'Bearer ***', 'Content-Type': 'application/json' })}`);

    const response = await axios.post<LinkupSearchResponse>(
      CONFIG.LINKUP_API_URL,
      requestBody,
      {
        headers,
        timeout: CONFIG.REQUEST_TIMEOUT
      }
    );

    logger.debug('Linkup response received:', {
      status: response.status,
      hasAnswer: !!response.data.answer,
      sourcesCount: response.data.sources?.length || 0
    });

    // Transform Linkup results to our FactCheckSearchResult format
    const transformedResults: FactCheckSearchResult[] = (response.data.sources || []).map((source, index) => ({
      title: source.name,
      url: source.url,
      snippet: source.snippet,
      relevanceScore: undefined // Linkup doesn't provide relevance scores
    }));

    return {
      results: transformedResults,
      answer: response.data.answer,
      sources: response.data.sources
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Linkup API Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });

      if (error.response?.status === 401) {
        throw new Error('Linkup API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Linkup API rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(`Linkup API error: ${error.response.data.error}`);
      }
    }

    const enhancedError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred during Linkup search'
    );
    throw enhancedError;
  }
}

/**
 * Get Linkup API credits balance
 */
export async function getLinkupCreditsBalance(): Promise<number> {
  if (!process.env.LINKUP_API_KEY) {
    throw new Error('Linkup API key is not configured');
  }

  try {
    const response = await axios.get(
      CONFIG.LINKUP_CREDITS_URL,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LINKUP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Shorter timeout for balance check
      }
    );

    // Assuming the response has a balance field
    return response.data.balance || 0;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Linkup Credits Balance Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    throw error;
  }
}

/**
 * Health check function for Linkup API
 */
export async function checkLinkupApiHealth(): Promise<boolean> {
  if (!process.env.LINKUP_API_KEY) {
    throw new Error('Linkup API key is not configured');
  }

  try {
    const response = await axios.post(
      CONFIG.LINKUP_API_URL,
      {
        q: 'test',
        depth: 'standard',
        outputType: 'sourcedAnswer'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.LINKUP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Shorter timeout for health check
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Linkup API Health Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    return false;
  }
}

