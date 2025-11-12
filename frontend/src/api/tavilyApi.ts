import { apiClient } from './apiClient';
import type { TavilySearchRequest, TavilySearchResponse } from '../types';

/**
 * Tavily API client for web search functionality
 */
export const tavilyApi = {
  /**
   * Perform a web search using Tavily API
   * @param query - The search query
   * @param options - Search options
   * @returns Promise resolving to search results
   */
  async search(
    query: string,
    options: Partial<TavilySearchRequest> = {}
  ): Promise<TavilySearchResponse> {
    const payload: TavilySearchRequest = {
      query,
      ...options
    };

    try {
      const response = await apiClient.post<TavilySearchResponse>('/tavily-search', payload);
      return response;
    } catch (error) {
      console.error('Tavily search error:', error);
      throw error;
    }
  }
};

