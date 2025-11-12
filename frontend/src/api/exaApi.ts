import { apiClient } from './apiClient';
import type { ExaSearchRequest, ExaSearchResponse } from '../types';

/**
 * Exa API client for web search functionality
 */
export const exaApi = {
  /**
   * Perform a web search using Exa API
   * @param query - The search query
   * @param options - Search options
   * @returns Promise resolving to search results
   */
  async search(
    query: string,
    options: Partial<ExaSearchRequest> = {}
  ): Promise<ExaSearchResponse> {
    const payload: ExaSearchRequest = {
      query,
      ...options
    };

    try {
      const response = await apiClient.post<ExaSearchResponse>('/exa-search', payload);
      return response;
    } catch (error) {
      console.error('Exa search error:', error);
      throw error;
    }
  }
};

