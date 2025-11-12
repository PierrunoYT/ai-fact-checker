import { apiClient } from './apiClient';

export interface Session {
  id: string;
  type: 'fact-check' | 'exa-search';
  query: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
  limit: number;
  offset: number;
}

export interface SessionWithResult {
  session: Session;
  result: any;
}

export const sessionsApi = {
  /**
   * Get all sessions
   */
  async getAll(type?: 'fact-check' | 'exa-search', limit: number = 50, offset: number = 0): Promise<SessionsResponse> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await apiClient.get<SessionsResponse>(`/sessions?${params.toString()}`);
    return response;
  },

  /**
   * Get session by ID with results
   */
  async getById(id: string): Promise<SessionWithResult> {
    const response = await apiClient.get<SessionWithResult>(`/sessions/${id}`);
    return response;
  },

  /**
   * Delete session
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/sessions/${id}`);
  }
};

