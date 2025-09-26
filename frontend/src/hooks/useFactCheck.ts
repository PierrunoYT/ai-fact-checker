import { useState, useCallback } from 'react';
import { factCheckApi } from '../api/perplexityApi';
import { validateStatement, validateDomainFilter } from '../utils/validation';
import type { 
  FactCheckResponse, 
  FactCheckRequest, 
  UseFactCheckReturn
} from '../types';

/**
 * Custom hook for managing fact-checking operations
 */
export const useFactCheck = (): UseFactCheckReturn => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkFact = useCallback(async (
    statement: string, 
    options: Partial<FactCheckRequest> = {}
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate statement
      validateStatement(statement);
      
      // Validate and parse domains if provided
      const domainsArray = options.searchDomains 
        ? validateDomainFilter(options.searchDomains.join(','))
        : undefined;

      // Prepare request options
      const requestOptions: Partial<FactCheckRequest> = {
        ...options,
        searchDomains: domainsArray,
        // Clear searchRecency if date filters are provided
        searchRecency: (options.searchAfterDate || options.searchBeforeDate) 
          ? undefined 
          : options.searchRecency
      };

      const response = await factCheckApi.checkFact(statement, requestOptions);
      setResult(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('Fact check error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setResult(null);
    setError(null);
  }, []);

  return {
    loading,
    result,
    error,
    checkFact,
    reset
  };
};
