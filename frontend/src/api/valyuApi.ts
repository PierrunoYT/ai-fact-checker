import { apiClient } from './apiClient';
import type { ValyuSearchRequest, ValyuSearchResponse } from '../types';

/**
 * Valyu API client for multi-source web and proprietary data search
 */
export const valyuApi = {
  async search(
    query: string,
    options: Partial<ValyuSearchRequest> = {}
  ): Promise<ValyuSearchResponse> {
    const payload: ValyuSearchRequest = {
      query,
      ...options
    };

    try {
      const response = await apiClient.post<ValyuSearchResponse>('/valyu-search', payload);
      return response;
    } catch (error) {
      console.error('Valyu search error:', error);
      throw error;
    }
  }
};
