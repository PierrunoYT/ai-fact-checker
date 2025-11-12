import React from 'react';
import { ExaSearchOptions } from '../ExaSearchOptions';
import type { ExaSearchType, ExaCategory } from '../../types';

interface ExaSearchFormProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
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
  onSubmit: (e: React.FormEvent) => void;
}

export const ExaSearchForm: React.FC<ExaSearchFormProps> = ({
  query,
  setQuery,
  loading,
  showOptions,
  setShowOptions,
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
          aria-label="Toggle Exa search options"
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
        <ExaSearchOptions
          searchType={searchType}
          setSearchType={setSearchType}
          numResults={numResults}
          setNumResults={setNumResults}
          includeDomains={includeDomains}
          setIncludeDomains={setIncludeDomains}
          excludeDomains={excludeDomains}
          setExcludeDomains={setExcludeDomains}
          startPublishedDate={startPublishedDate}
          setStartPublishedDate={setStartPublishedDate}
          endPublishedDate={endPublishedDate}
          setEndPublishedDate={setEndPublishedDate}
          category={category}
          setCategory={setCategory}
          getText={getText}
          setGetText={setGetText}
          getSummary={getSummary}
          setGetSummary={setGetSummary}
          getHighlights={getHighlights}
          setGetHighlights={setGetHighlights}
          getContext={getContext}
          setGetContext={setGetContext}
          contextMaxCharacters={contextMaxCharacters}
          setContextMaxCharacters={setContextMaxCharacters}
          isDarkMode={isDarkMode}
        />
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

