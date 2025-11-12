import { apiClient } from './apiClient';
import type { ParallelSearchRequest, ParallelSearchResponse } from '../types';

/**
 * Parallel API client for web search functionality
 */
export const parallelApi = {
  /**
   * Perform a web search using Parallel API
   * @param objective - The search objective
   * @param options - Search options
   * @returns Promise resolving to search results
   */
  async search(
    objective: string,
    options: Partial<ParallelSearchRequest> = {}
  ): Promise<ParallelSearchResponse> {
    const payload: ParallelSearchRequest = {
      objective,
      ...options
    };

    try {
      const response = await apiClient.post<ParallelSearchResponse>('/parallel-search', payload);
      return response;
    } catch (error) {
      console.error('Parallel search error:', error);
      throw error;
    }
  }
};

