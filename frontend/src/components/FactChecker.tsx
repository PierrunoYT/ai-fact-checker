import React, { useState, useEffect } from 'react';
import { factCheckApi, type FactCheckResponse, type PerplexityModel } from '../api/perplexityApi';

export const FactChecker: React.FC = () => {
  const [statement, setStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<PerplexityModel>('sonar');
  const [thinking, setThinking] = useState<string>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const [searchContextSize, setSearchContextSize] = useState<'low' | 'medium' | 'high'>('low');
  const [searchAfterDate, setSearchAfterDate] = useState('');
  const [searchBeforeDate, setSearchBeforeDate] = useState('');
  const [searchDomains, setSearchDomains] = useState('');
  const [searchRecency, setSearchRecency] = useState<'month' | 'week' | 'day' | 'hour'>('month');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setThinking('');

    try {
      const domainsArray = searchDomains
        ? searchDomains.split(',').map(domain => domain.trim()).filter(Boolean)
        : undefined;

      const dateFilterOptions = searchAfterDate || searchBeforeDate
        ? {
            searchAfterDate: searchAfterDate || undefined,
            searchBeforeDate: searchBeforeDate || undefined,
            searchRecency: undefined
          }
        : {
            searchAfterDate: undefined,
            searchBeforeDate: undefined,
            searchRecency
          };

      const response = await factCheckApi.checkFact(statement, {
        model,
        searchContextSize,
        ...dateFilterOptions,
        searchDomains: domainsArray
      });

      setResult(response);
      if (response.thinking) {
        setThinking(response.thinking);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(message);
      console.error('Error checking fact:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';

    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
    return dateString;
  };

  const formatDateForApi = (dateString: string) => {
    if (!dateString) return '';

    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateString;
  };

  const formatDateObjectForApi = (date: Date): string => {
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const setDateRangePreset = (days: number | null) => {
    if (days === null) {
      setSearchRecency(undefined);
      setSearchAfterDate('');
      setSearchBeforeDate('');
    } else if (days === 1) {
      setSearchRecency('day');
      setSearchBeforeDate('');
      setSearchAfterDate('');
    } else if (days === 7) {
      setSearchRecency('week');
      setSearchBeforeDate('');
      setSearchAfterDate('');
    } else if (days === 30) {
      setSearchRecency('month');
      setSearchBeforeDate('');
      setSearchAfterDate('');
    } else {
      const today = new Date();
      const beforeDate = today;

      const afterDate = new Date();
      afterDate.setDate(afterDate.getDate() - days);

      setSearchBeforeDate(formatDateObjectForApi(beforeDate));
      setSearchAfterDate(formatDateObjectForApi(afterDate));
      setSearchRecency(undefined);
    }
  };

  const handleAfterDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setSearchAfterDate(dateValue);
    if (dateValue) {
      setSearchRecency('month');
    }
  };

  const handleBeforeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setSearchBeforeDate(dateValue);
    if (dateValue) {
      setSearchRecency('month');
    }
  };

  const clearDateRange = () => {
    setSearchAfterDate('');
    setSearchBeforeDate('');
    setSearchRecency('month');
  };

  const scrollToSource = (e: React.MouseEvent<HTMLAnchorElement>, sourceId: string) => {
    e.preventDefault();
    const element = document.getElementById(sourceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-blue-100', 'dark:bg-blue-900/30');
      setTimeout(() => {
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900/30');
      }, 2000);
    }
  };

  return (
    <div className={`h-full w-full flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-4 right-4 p-2 rounded-full transition-all duration-200 z-50
                   ${isDarkMode
                     ? 'bg-gray-800 hover:bg-gray-700'
                     : 'bg-gray-100 hover:bg-gray-200 shadow-md'}`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className={`w-[500px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-full flex flex-col overflow-y-auto pt-16`}>
        <div className="p-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            AI Fact Checker
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter any statement and our AI will verify its accuracy using multiple reliable sources
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 pt-0">
          <div className="mb-4">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Model
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar"
                  checked={model === 'sonar'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar-pro"
                  checked={model === 'sonar-pro'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar Pro</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar-reasoning"
                  checked={model === 'sonar-reasoning'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar Reasoning</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="model"
                  value="sonar-reasoning-pro"
                  checked={model === 'sonar-reasoning-pro'}
                  onChange={(e) => setModel(e.target.value as PerplexityModel)}
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sonar Reasoning Pro</span>
              </label>
            </div>
            <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {model.includes('pro') ?
                'Pro models have a larger context window (200k tokens) and higher output limit (8k tokens)' :
                'Standard models with 127k token context window'
              }
              {model.includes('reasoning') && ' - Includes detailed reasoning and citations'}
            </p>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className={`flex items-center text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
            >
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
              <svg
                className={`ml-1 w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showAdvancedOptions && (
            <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fade-in`}>
              <div className="mb-4">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Search Context Size
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="searchContextSize"
                      value="low"
                      checked={searchContextSize === 'low'}
                      onChange={() => setSearchContextSize('low')}
                    />
                    <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Low</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="searchContextSize"
                      value="medium"
                      checked={searchContextSize === 'medium'}
                      onChange={() => setSearchContextSize('medium')}
                    />
                    <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Medium</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="searchContextSize"
                      value="high"
                      checked={searchContextSize === 'high'}
                      onChange={() => setSearchContextSize('high')}
                    />
                    <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>High</span>
                  </label>
                </div>
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Controls how much search context is retrieved. Higher values provide more comprehensive answers but may cost more.
                </p>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Date Filter
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setDateRangePreset(null)}
                    className={`px-2 py-1 text-xs rounded ${
                      !searchRecency && !searchAfterDate && !searchBeforeDate ?
                        (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800') :
                        (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700')
                    }`}
                  >
                    No Date Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateRangePreset(1)}
                    className={`px-2 py-1 text-xs rounded ${
                      searchRecency === 'day' ?
                        (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800') :
                        (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700')
                    }`}
                  >
                    Last 24h
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateRangePreset(7)}
                    className={`px-2 py-1 text-xs rounded ${
                      searchRecency === 'week' ?
                        (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800') :
                        (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700')
                    }`}
                  >
                    Last Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateRangePreset(30)}
                    className={`px-2 py-1 text-xs rounded ${
                      searchRecency === 'month' && !searchAfterDate && !searchBeforeDate ?
                        (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800') :
                        (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700')
                    }`}
                  >
                    Last Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateRangePreset(365)}
                    className={`px-2 py-1 text-xs rounded ${
                      searchAfterDate && searchAfterDate.includes((new Date().getFullYear() - 1).toString()) ?
                        (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800') :
                        (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700')
                    }`}
                  >
                    Last Year
                  </button>
                  <button
                    type="button"
                    onClick={clearDateRange}
                    className={`px-2 py-1 text-xs rounded ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Clear
                  </button>
                </div>

                <div className="mb-2">
                  <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Custom Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        After Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(searchAfterDate)}
                        onChange={handleAfterDateChange}
                        className={`w-full p-2 text-sm rounded-md border ${
                          isDarkMode
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                        Before Date
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(searchBeforeDate)}
                        onChange={handleBeforeDateChange}
                        className={`w-full p-2 text-sm rounded-md border ${
                          isDarkMode
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Either use a preset or set a custom date range to filter search results.
                </p>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Domain Filters
                </label>
                <input
                  type="text"
                  value={searchDomains}
                  onChange={(e) => setSearchDomains(e.target.value)}
                  placeholder="e.g., wikipedia.org, -pinterest.com"
                  className={`w-full p-2 text-sm rounded-md border ${
                    isDarkMode
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Comma-separated list of domains to include or exclude (prefix with - to exclude). Example: wikipedia.org, -pinterest.com
                </p>
              </div>
            </div>
          )}

          <div className="relative flex-1 mb-4">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className={`w-full h-full p-4 border rounded-lg text-base
                       ${isDarkMode ?
                         'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' :
                         'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                       }
                       focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200 resize-none scrollbar`}
              placeholder="Enter a statement to fact check..."
              disabled={loading}
            />
            {loading && (
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} rounded-lg flex items-center justify-center backdrop-blur-sm`}>
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !statement.trim()}
            className={`w-full py-3 rounded-lg text-base font-medium
                     transition-all duration-200
                     ${loading || !statement.trim()
                       ? 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                       : isDarkMode
                         ? 'bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
                         : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50'
                     }`}
          >
            {loading ? 'Analyzing...' : 'Check Fact'}
          </button>
        </form>
      </div>

      <div className={`flex-1 h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto pt-16`}>
        <div className="p-8">
          {error && (
            <div className={`${isDarkMode ? 'bg-red-900/50' : 'bg-red-50'} border-l-4 border-red-500 rounded p-4 mb-6 animate-fade-in`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden animate-fade-in`}>
              <div className={`p-6 ${
                result.isFactual ?
                  (isDarkMode ? 'bg-green-900/30' : 'bg-green-50') :
                  (isDarkMode ? 'bg-red-900/30' : 'bg-red-50')
              }`}>
                <div className="flex items-center">
                  {result.isFactual ? (
                    <div className={`flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                      <svg className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 rounded-full p-2 ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                      <svg className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <div className="ml-4">
                    <h2 className={`text-xl font-bold ${
                      result.isFactual ?
                        (isDarkMode ? 'text-green-400' : 'text-green-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700')
                    }`}>
                      {result.isFactual ? 'Factual Statement' : 'Not Factual'}
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Confidence: <span className="font-medium">
                        {result.confidence !== undefined ? `${result.confidence.toFixed(1)}%` : 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explanation</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {result.explanation.split(/\[(\d+)\]/).map((part, index) => {
                      if (index % 2 === 0) {
                        return part;
                      } else {
                        const citationId = parseInt(part);
                        const sourceIndex = citationId - 1;

                        // Get the citation URL if available
                        const citationUrl = result.citations && result.citations.find(c => c.id === citationId)?.url;

                        return (
                          <a
                            key={index}
                            href={citationUrl ? citationUrl : `#source-${sourceIndex}`}
                            onClick={citationUrl ? undefined : (e) => scrollToSource(e, `source-${sourceIndex}`)}
                            target={citationUrl ? "_blank" : undefined}
                            rel={citationUrl ? "noopener noreferrer" : undefined}
                            className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline transition-colors duration-200`}
                          >
                            [{part}]
                          </a>
                        );
                      }
                    })}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sources</h3>
                  <ul className={`list-none pl-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {result.citations && result.citations.length > 0 ? (
                      result.citations.map((citation, index) => (
                        <li
                          key={index}
                          id={`source-${index}`}
                          className="mb-3 p-2 rounded transition-colors duration-300"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-baseline">
                              <span className="font-medium">[{citation.id}]</span>{' '}
                              <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 hover:underline font-medium"
                              >
                                {citation.title || citation.domain || citation.url}
                              </a>
                            </div>
                            {citation.domain && (
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-6`}>
                                {citation.domain}
                              </span>
                            )}
                            {citation.snippet && (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ml-6 mt-1`}>
                                {citation.snippet}
                              </p>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      result.sources.map((source, index) => (
                        <li
                          key={index}
                          id={`source-${index}`}
                          className="mb-2 p-2 rounded transition-colors duration-300"
                        >
                          <span className="font-medium">[{index + 1}]</span>{' '}
                          <a href={source} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                            {source}
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {thinking && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis Process</h3>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {thinking.split(/\[(\d+)\]/).map((part, index) => {
                        if (index % 2 === 0) {
                          return part;
                        } else {
                          const citationId = parseInt(part);
                          const sourceIndex = citationId - 1;

                          // Get the citation URL if available
                          const citationUrl = result.citations && result.citations.find(c => c.id === citationId)?.url;

                          return (
                            <a
                              key={index}
                              href={citationUrl ? citationUrl : `#source-${sourceIndex}`}
                              onClick={citationUrl ? undefined : (e) => scrollToSource(e, `source-${sourceIndex}`)}
                              target={citationUrl ? "_blank" : undefined}
                              rel={citationUrl ? "noopener noreferrer" : undefined}
                              className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline transition-colors duration-200`}
                            >
                              [{part}]
                            </a>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}

                {result.usage && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Usage Statistics</h3>
                    <div className="flex space-x-4">
                      <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Prompt Tokens:</span>
                        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.usage.prompt_tokens}</span>
                      </div>
                      <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Completion Tokens:</span>
                        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.usage.completion_tokens}</span>
                      </div>
                      <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Tokens:</span>
                        <span className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.usage.total_tokens}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div className={`flex flex-col items-center justify-center h-[80vh] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Enter a statement to check its factual accuracy</p>
              <p className="text-sm mt-2">Our AI will analyze it using multiple reliable sources</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
