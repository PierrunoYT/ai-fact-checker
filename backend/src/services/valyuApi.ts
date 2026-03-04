import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

dotenv.config();

type ValyuSearchType = 'web' | 'proprietary' | 'news' | 'all';
type ValyuResponseLength = 'short' | 'medium' | 'large' | 'max';

interface ValyuSearchRequest {
  query: string;
  search_type?: ValyuSearchType;
  max_num_results?: number;
  max_price?: number;
  is_tool_call?: boolean;
  relevance_threshold?: number;
  included_sources?: string[];
  excluded_sources?: string[];
  start_date?: string;
  end_date?: string;
  country_code?: string;
  response_length?: ValyuResponseLength;
  fast_mode?: boolean;
  url_only?: boolean;
  category?: string;
}

interface ValyuSearchResultItem {
  title: string;
  url: string;
  content: string;
  source: string;
  price: number;
  length: number;
  relevance_score: number;
  description?: string;
  data_type?: string;
  publication_date?: string;
  authors?: string[];
  citation?: string;
  doi?: string;
}

interface ValyuSearchResponse {
  success: boolean;
  error?: string;
  tx_id: string;
  query: string;
  results: ValyuSearchResultItem[];
  results_by_source?: Record<string, ValyuSearchResultItem[]>;
  total_deduction_dollars: number;
  total_characters: number;
}

export interface ValyuSearchOptions {
  searchType?: ValyuSearchType;
  maxNumResults?: number;
  maxPrice?: number;
  relevanceThreshold?: number;
  includedSources?: string[];
  excludedSources?: string[];
  startDate?: string;
  endDate?: string;
  countryCode?: string;
  responseLength?: ValyuResponseLength;
  fastMode?: boolean;
  category?: string;
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

function createValyuSearchRequest(
  query: string,
  options: ValyuSearchOptions = {}
): ValyuSearchRequest {
  const request: ValyuSearchRequest = {
    query,
    search_type: options.searchType || 'all',
    max_num_results: options.maxNumResults || 10,
    is_tool_call: true,
    response_length: options.responseLength || 'short',
    fast_mode: options.fastMode || false
  };

  if (options.relevanceThreshold !== undefined) {
    request.relevance_threshold = options.relevanceThreshold;
  }
  if (options.maxPrice !== undefined) {
    request.max_price = options.maxPrice;
  }
  if (options.includedSources && options.includedSources.length > 0) {
    request.included_sources = options.includedSources;
  }
  if (options.excludedSources && options.excludedSources.length > 0) {
    request.excluded_sources = options.excludedSources;
  }
  if (options.startDate) {
    request.start_date = options.startDate;
  }
  if (options.endDate) {
    request.end_date = options.endDate;
  }
  if (options.countryCode) {
    request.country_code = options.countryCode;
  }
  if (options.category) {
    request.category = options.category;
  }

  return request;
}

export async function searchWithValyu(
  query: string,
  options: ValyuSearchOptions = {}
): Promise<{
  results: FactCheckSearchResult[];
  txId?: string;
  totalDeductionDollars?: number;
  totalCharacters?: number;
}> {
  logger.info(`Starting Valyu search for query: "${query.slice(0, 100)}${query.length > 100 ? '...' : ''}"`);
  logger.debug('Valyu search options:', options);

  if (!process.env.VALYU_API_KEY) {
    logger.error('Valyu API key not configured');
    throw new Error('Valyu API key is not configured');
  }

  const headers = {
    'X-API-Key': process.env.VALYU_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    const requestBody = createValyuSearchRequest(query, options);

    logger.debug('Valyu request body:', JSON.stringify(requestBody, null, 2));
    logger.info(`Valyu API URL: ${CONFIG.VALYU_API_URL}`);

    const response = await axios.post<ValyuSearchResponse>(
      CONFIG.VALYU_API_URL,
      requestBody,
      {
        headers,
        timeout: CONFIG.REQUEST_TIMEOUT
      }
    );

    logger.debug('Valyu response received:', {
      status: response.status,
      resultsCount: response.data.results?.length || 0,
      txId: response.data.tx_id
    });

    if (!response.data.success && response.data.error) {
      throw new Error(`Valyu API error: ${response.data.error}`);
    }

    const transformedResults: FactCheckSearchResult[] = (response.data.results || []).map((item) => ({
      title: item.title,
      url: item.url,
      publishedDate: item.publication_date,
      author: item.authors?.join(', '),
      snippet: item.description || item.content?.substring(0, 500) || undefined,
      text: item.content,
      relevanceScore: item.relevance_score
    }));

    return {
      results: transformedResults,
      txId: response.data.tx_id,
      totalDeductionDollars: response.data.total_deduction_dollars,
      totalCharacters: response.data.total_characters
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Valyu API Request Failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Valyu API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Valyu API rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error) {
        throw new Error(`Valyu API error: ${error.response.data.error}`);
      }
    }

    throw new Error(
      error instanceof Error ? error.message : 'Unknown error occurred during Valyu search'
    );
  }
}

export async function checkValyuApiHealth(): Promise<boolean> {
  if (!process.env.VALYU_API_KEY) {
    throw new Error('Valyu API key is not configured');
  }

  try {
    const response = await axios.post(
      CONFIG.VALYU_API_URL,
      {
        query: 'test',
        max_num_results: 1,
        is_tool_call: true
      },
      {
        headers: {
          'X-API-Key': process.env.VALYU_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Valyu API Health Check Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    return false;
  }
}
