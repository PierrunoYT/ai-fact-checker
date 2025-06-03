import React from 'react';
import { formatDateForInput, formatDateForApi, formatDateObjectForApi, validateDomainFilter } from '../utils/validation';

interface AdvancedOptionsProps {
  searchContextSize: 'low' | 'medium' | 'high';
  setSearchContextSize: (size: 'low' | 'medium' | 'high') => void;
  searchAfterDate: string;
  setSearchAfterDate: (date: string) => void;
  searchBeforeDate: string;
  setSearchBeforeDate: (date: string) => void;
  searchDomains: string;
  setSearchDomains: (domains: string) => void;
  searchRecency: 'month' | 'week' | 'day' | 'hour' | undefined;
  setSearchRecency: (recency: 'month' | 'week' | 'day' | 'hour' | undefined) => void;
  isDarkMode: boolean;
}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  searchContextSize,
  setSearchContextSize,
  searchAfterDate,
  setSearchAfterDate,
  searchBeforeDate,
  setSearchBeforeDate,
  searchDomains,
  setSearchDomains,
  searchRecency,
  setSearchRecency,
  isDarkMode
}) => {
  const setDateRangePreset = (days: number | null) => {
    if (days === null) {
      setSearchRecency(undefined);
      setSearchAfterDate('');
      setSearchBeforeDate('');
      return;
    }

    if (days === 1) {
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
      setSearchRecency(undefined);
    }
  };

  const handleBeforeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setSearchBeforeDate(dateValue);
    if (dateValue) {
      setSearchRecency(undefined);
    }
  };

  const clearDateRange = () => {
    setSearchAfterDate('');
    setSearchBeforeDate('');
    setSearchRecency(undefined);
  };

  const handleDomainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchDomains(value);
    
    // Validate on blur or when user stops typing
    try {
      if (value.trim()) {
        validateDomainFilter(value);
      }
    } catch (error) {
      // Could show validation error here
      console.warn('Domain validation:', error);
    }
  };

  return (
    <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fade-in`}>
      {/* Search Context Size */}
      <div className="mb-4">
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Search Context Size
        </label>
        <div className="flex flex-wrap gap-4">
          {(['low', 'medium', 'high'] as const).map((size) => (
            <label key={size} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="searchContextSize"
                value={size}
                checked={searchContextSize === size}
                onChange={() => setSearchContextSize(size)}
                aria-label={`Search context size: ${size}`}
              />
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                {size}
              </span>
            </label>
          ))}
        </div>
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Controls how much search context is retrieved. Higher values provide more comprehensive answers but may cost more.
        </p>
      </div>

      {/* Date Filter */}
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
            aria-label="Remove date filter"
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
            aria-label="Filter to last 24 hours"
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
            aria-label="Filter to last week"
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
            aria-label="Filter to last month"
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
            aria-label="Filter to last year"
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
            aria-label="Clear date filter"
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
                aria-label="Search after date"
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
                aria-label="Search before date"
              />
            </div>
          </div>
        </div>

        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Either use a preset or set a custom date range to filter search results.
        </p>
      </div>

      {/* Domain Filters */}
      <div className="mb-4">
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Domain Filters
        </label>
        <input
          type="text"
          value={searchDomains}
          onChange={handleDomainsChange}
          placeholder="e.g., wikipedia.org, -pinterest.com"
          className={`w-full p-2 text-sm rounded-md border ${
            isDarkMode
              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          aria-label="Domain filters"
        />
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Comma-separated list of domains to include or exclude (prefix with - to exclude). Example: wikipedia.org, -pinterest.com
        </p>
      </div>
    </div>
  );
};
