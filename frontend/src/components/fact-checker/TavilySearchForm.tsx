import React from 'react';
import type { TavilySearchDepth, TavilyTopic } from '../../types';

interface TavilySearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  searchDepth: TavilySearchDepth;
  setSearchDepth: (depth: TavilySearchDepth) => void;
  maxResults: number;
  setMaxResults: (num: number) => void;
  includeDomains: string;
  setIncludeDomains: (domains: string) => void;
  excludeDomains: string;
  setExcludeDomains: (domains: string) => void;
  includeAnswer: boolean;
  setIncludeAnswer: (value: boolean) => void;
  includeImages: boolean;
  setIncludeImages: (value: boolean) => void;
  includeRawContent: boolean;
  setIncludeRawContent: (value: boolean) => void;
  topic: TavilyTopic;
  setTopic: (topic: TavilyTopic) => void;
  isDarkMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const TavilySearchForm: React.FC<TavilySearchFormProps> = ({
  query,
  setQuery,
  loading,
  showOptions,
  setShowOptions,
  searchDepth,
  setSearchDepth,
  maxResults,
  setMaxResults,
  includeDomains,
  setIncludeDomains,
  excludeDomains,
  setExcludeDomains,
  includeAnswer,
  setIncludeAnswer,
  includeImages,
  setIncludeImages,
  includeRawContent,
  setIncludeRawContent,
  topic,
  setTopic,
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
          aria-label="Toggle Tavily search options"
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
              Search Depth
            </label>
            <select
              value={searchDepth}
              onChange={(e) => setSearchDepth(e.target.value as TavilySearchDepth)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Max Results
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value) || 10)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as TavilyTopic)}
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="general">General</option>
              <option value="news">News</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Include Domains (comma-separated)
            </label>
            <input
              type="text"
              value={includeDomains}
              onChange={(e) => setIncludeDomains(e.target.value)}
              placeholder="example.com, another.com"
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Exclude Domains (comma-separated)
            </label>
            <input
              type="text"
              value={excludeDomains}
              onChange={(e) => setExcludeDomains(e.target.value)}
              placeholder="spam.com, ads.com"
              className={`w-full p-2 rounded border ${
                isDarkMode
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={includeAnswer}
                onChange={(e) => setIncludeAnswer(e.target.checked)}
                className="mr-2"
              />
              Include Answer
            </label>
            <label className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="mr-2"
              />
              Include Images
            </label>
            <label className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={includeRawContent}
                onChange={(e) => setIncludeRawContent(e.target.checked)}
                className="mr-2"
              />
              Include Raw Content
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

