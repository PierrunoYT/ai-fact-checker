import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFactCheck } from '../useFactCheck';
import { factCheckApi } from '../../api/perplexityApi';

// Mock the API
vi.mock('../../api/perplexityApi', () => ({
  factCheckApi: {
    checkFact: vi.fn()
  }
}));

// Mock validation utilities
vi.mock('../../utils/validation', () => ({
  validateStatement: vi.fn(),
  validateDomainFilter: vi.fn((domains) => domains ? domains.split(',') : undefined)
}));

describe('useFactCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFactCheck());

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.checkFact).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should handle successful fact check', async () => {
    const mockResponse = {
      isFactual: true,
      confidence: 95,
      explanation: 'This is factual',
      sources: ['source1.com'],
      citations: []
    };

    vi.mocked(factCheckApi.checkFact).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFactCheck());

    await act(async () => {
      await result.current.checkFact('Test statement');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it('should handle fact check error', async () => {
    const mockError = new Error('API Error');
    vi.mocked(factCheckApi.checkFact).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFactCheck());

    await act(async () => {
      await result.current.checkFact('Test statement');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe('API Error');
  });

  it('should set loading state during fact check', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(factCheckApi.checkFact).mockReturnValue(promise);

    const { result } = renderHook(() => useFactCheck());

    act(() => {
      result.current.checkFact('Test statement');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise({
        isFactual: true,
        confidence: 95,
        explanation: 'Test',
        sources: [],
        citations: []
      });
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useFactCheck());

    // Set some state
    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should handle domain validation', async () => {
    const mockResponse = {
      isFactual: true,
      confidence: 95,
      explanation: 'Test',
      sources: [],
      citations: []
    };

    vi.mocked(factCheckApi.checkFact).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFactCheck());

    await act(async () => {
      await result.current.checkFact('Test statement', {
        searchDomains: ['example.com', 'test.org']
      });
    });

    expect(factCheckApi.checkFact).toHaveBeenCalledWith('Test statement', {
      searchDomains: ['example.com', 'test.org']
    });
  });

  it('should clear searchRecency when date filters are provided', async () => {
    const mockResponse = {
      isFactual: true,
      confidence: 95,
      explanation: 'Test',
      sources: [],
      citations: []
    };

    vi.mocked(factCheckApi.checkFact).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFactCheck());

    await act(async () => {
      await result.current.checkFact('Test statement', {
        searchAfterDate: '01/01/2024',
        searchRecency: 'month'
      });
    });

    expect(factCheckApi.checkFact).toHaveBeenCalledWith('Test statement', {
      searchAfterDate: '01/01/2024',
      searchRecency: undefined
    });
  });
});
