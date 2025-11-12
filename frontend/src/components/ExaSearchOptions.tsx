import React from 'react';
import type { ExaSearchType, ExaCategory } from '../types';
import { formatDateForInput, formatDateForApi, formatDateObjectForApi, validateDomainFilter } from '../utils/validation';

interface ExaSearchOptionsProps {
  searchType: ExaSearchType;
  setSearchType: (type: ExaSearchType) => void;
  numResults: number;
  setNumResults: (num: number) => void;
  includeDomains: string;
  setIncludeDomains: (domains: string) => void;
  excludeDomains: string;
  setExcludeDomains: (domains: string) => void;
  startPublishedDate: string;
  setStartPublishedDate: (date: string) => void;
  endPublishedDate: string;
  setEndPublishedDate: (date: string) => void;
  category: ExaCategory | '';
  setCategory: (category: ExaCategory | '') => void;
  getText: boolean;
  setGetText: (value: boolean) => void;
  getSummary: boolean;
  setGetSummary: (value: boolean) => void;
  getHighlights: boolean;
  setGetHighlights: (value: boolean) => void;
  getContext: boolean;
  setGetContext: (value: boolean) => void;
  contextMaxCharacters: number;
  setContextMaxCharacters: (value: number) => void;
  isDarkMode: boolean;
}

export const ExaSearchOptions: React.FC<ExaSearchOptionsProps> = ({
  searchType,
  setSearchType,
  numResults,
  setNumResults,
  includeDomains,
  setIncludeDomains,
  excludeDomains,
  setExcludeDomains,
  startPublishedDate,
  setStartPublishedDate,
  endPublishedDate,
  setEndPublishedDate,
  category,
  setCategory,
  getText,
  setGetText,
  getSummary,
  setGetSummary,
  getHighlights,
  setGetHighlights,
  getContext,
  setGetContext,
  contextMaxCharacters,
  setContextMaxCharacters,
  isDarkMode
}) => {
  const handleIncludeDomainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIncludeDomains(value);
    try {
      if (value.trim()) {
        validateDomainFilter(value);
      }
    } catch (error) {
      console.warn('Domain validation:', error);
    }
  };

  const handleExcludeDomainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExcludeDomains(value);
    try {
      if (value.trim()) {
        validateDomainFilter(value);
      }
    } catch (error) {
      console.warn('Domain validation:', error);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setStartPublishedDate(dateValue);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = formatDateForApi(e.target.value);
    setEndPublishedDate(dateValue);
  };

  const categories: ExaCategory[] = [
    'company',
    'research paper',
    'news',
    'pdf',
    'github',
    'tweet',
    'personal site',
    'linkedin profile',
    'financial report'
  ];

  return (
    <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fade-in space-y-4`}>
      {/* Search Type */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Search Type
        </label>
        <div className="flex flex-wrap gap-4">
          {(['neural', 'keyword', 'auto', 'fast'] as ExaSearchType[]).map((type) => (
            <label key={type} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="exaSearchType"
                value={type}
                checked={searchType === type}
                onChange={() => setSearchType(type)}
                aria-label={`Search type: ${type}`}
              />
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                {type}
              </span>
            </label>
          ))}
        </div>
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          neural: Embeddings-based (up to 100 results) | keyword: Google-like SERP (up to 10) | auto: Combines both | fast: Streamlined
        </p>
      </div>

      {/* Number of Results */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Number of Results
        </label>
        <input
          type="number"
          min="1"
          max={searchType === 'keyword' ? 10 : 100}
          value={numResults}
          onChange={(e) => setNumResults(Math.max(1, Math.min(searchType === 'keyword' ? 10 : 100, parseInt(e.target.value) || 1)))}
          className={`w-full p-2 text-sm rounded-md border ${
            isDarkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          aria-label="Number of results"
        />
        <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Max {searchType === 'keyword' ? 10 : 100} results for {searchType} search
        </p>
      </div>

      {/* Domain Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Include Domains
          </label>
          <input
            type="text"
            value={includeDomains}
            onChange={handleIncludeDomainsChange}
            placeholder="e.g., wikipedia.org, nytimes.com"
            className={`w-full p-2 text-sm rounded-md border ${
              isDarkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            aria-label="Include domains"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Exclude Domains
          </label>
          <input
            type="text"
            value={excludeDomains}
            onChange={handleExcludeDomainsChange}
            placeholder="e.g., pinterest.com, reddit.com"
            className={`w-full p-2 text-sm rounded-md border ${
              isDarkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            aria-label="Exclude domains"
          />
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Published Date Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
              Start Date
            </label>
            <input
              type="date"
              value={formatDateForInput(startPublishedDate)}
              onChange={handleStartDateChange}
              className={`w-full p-2 text-sm rounded-md border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              aria-label="Start published date"
            />
          </div>
          <div>
            <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
              End Date
            </label>
            <input
              type="date"
              value={formatDateForInput(endPublishedDate)}
              onChange={handleEndDateChange}
              className={`w-full p-2 text-sm rounded-md border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              aria-label="End published date"
            />
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Category Filter
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExaCategory | '')}
          className={`w-full p-2 text-sm rounded-md border ${
            isDarkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          aria-label="Category filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Content Retrieval Options */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Content Retrieval Options
        </label>
        <div className="space-y-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={getText}
              onChange={(e) => setGetText(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Get Full Text (markdown)
            </span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={getSummary}
              onChange={(e) => setGetSummary(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Get AI Summary
            </span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={getHighlights}
              onChange={(e) => setGetHighlights(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Get Highlights
            </span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={getContext}
              onChange={(e) => setGetContext(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Get Context (LLM-optimized)
            </span>
          </label>
        </div>
      </div>

      {/* Context Max Characters */}
      {getContext && (
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Context Max Characters
          </label>
          <input
            type="number"
            min="100"
            max="50000"
            step="100"
            value={contextMaxCharacters}
            onChange={(e) => setContextMaxCharacters(Math.max(100, Math.min(50000, parseInt(e.target.value) || 10000)))}
            className={`w-full p-2 text-sm rounded-md border ${
              isDarkMode
                ? 'bg-gray-600 border-gray-500 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            aria-label="Context max characters"
          />
        </div>
      )}
    </div>
  );
};

