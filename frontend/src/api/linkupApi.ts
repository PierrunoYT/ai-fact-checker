import { apiClient } from './apiClient';
import type { LinkupSearchRequest, LinkupSearchResponse } from '../types';

/**
 * Linkup API client for web search functionality
 */
export const linkupApi = {
  /**
   * Perform a web search using Linkup API
   * @param query - The search query
   * @param options - Search options
   * @returns Promise resolving to search results
   */
  async search(
    query: string,
    options: Partial<LinkupSearchRequest> = {}
  ): Promise<LinkupSearchResponse> {
    const payload: LinkupSearchRequest = {
      query,
      ...options
    };

    try {
      const response = await apiClient.post<LinkupSearchResponse>('/linkup-search', payload);
      return response;
    } catch (error) {
      console.error('Linkup search error:', error);
      throw error;
    }
  }
};

