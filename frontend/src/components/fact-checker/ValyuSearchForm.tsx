import React from 'react';
import type { ValyuSearchType, ValyuResponseLength } from '../../types';

interface ValyuSearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  searchType: ValyuSearchType;
  setSearchType: (type: ValyuSearchType) => void;
  maxNumResults: number;
  setMaxNumResults: (num: number) => void;
  relevanceThreshold: number;
  setRelevanceThreshold: (value: number) => void;
  includedSources: string;
  setIncludedSources: (sources: string) => void;
  excludedSources: string;
  setExcludedSources: (sources: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  responseLength: ValyuResponseLength;
  setResponseLength: (length: ValyuResponseLength) => void;
  fastMode: boolean;
  setFastMode: (value: boolean) => void;
  isDarkMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ValyuSearchForm: React.FC<ValyuSearchFormProps> = ({
  query,
  setQuery,
  loading,
  showOptions,
  setShowOptions,
  searchType,
  setSearchType,
  maxNumResults,
  setMaxNumResults,
  relevanceThreshold,
  setRelevanceThreshold,
  includedSources,
  setIncludedSources,
  excludedSources,
  setExcludedSources,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  countryCode,
  setCountryCode,
  responseLength,
  setResponseLength,
  fastMode,
  setFastMode,
  isDarkMode,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className={`flex items-center text-sm font-medium ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
          } transition-colors duration-200`}
          aria-label="Toggle Valyu search options"
        >
          <svg
            className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
              showOptions ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          Search Options
        </button>
      </div>

      {showOptions && (
        <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} space-y-4`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as ValyuSearchType)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All (Web + Proprietary)</option>
              <option value="web">Web</option>
              <option value="proprietary">Proprietary (PubMed, arXiv, SEC, Patents…)</option>
              <option value="news">News</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Max Results (1–20)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxNumResults}
              onChange={(e) => setMaxNumResults(parseInt(e.target.value) || 10)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Response Length
            </label>
            <select
              value={responseLength}
              onChange={(e) => setResponseLength(e.target.value as ValyuResponseLength)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="short">Short (~25k chars)</option>
              <option value="medium">Medium (~50k chars)</option>
              <option value="large">Large (~100k chars)</option>
              <option value="max">Max (full content)</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Relevance Threshold (0.0–1.0)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={relevanceThreshold}
              onChange={(e) => setRelevanceThreshold(parseFloat(e.target.value) || 0.5)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Start Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              End Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Country Code (ISO 2-letter, e.g. US)
            </label>
            <input
              type="text"
              maxLength={2}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="US"
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Include Sources (comma-separated)
            </label>
            <input
              type="text"
              value={includedSources}
              onChange={(e) => setIncludedSources(e.target.value)}
              placeholder="pubmed, arxiv, sec"
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Exclude Sources (comma-separated)
            </label>
            <input
              type="text"
              value={excludedSources}
              onChange={(e) => setExcludedSources(e.target.value)}
              placeholder="example.com"
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={fastMode}
                onChange={(e) => setFastMode(e.target.checked)}
                className="mr-2"
              />
              Fast Mode (reduced latency)
            </label>
          </div>
        </div>
      )}

      <div className="relative flex-1 mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a search query..."
          className={`w-full h-32 p-4 text-lg rounded-lg border resize-none ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          required
          aria-label="Search query"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !query.trim()}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
          loading || !query.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        }`}
        aria-label="Search"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};
